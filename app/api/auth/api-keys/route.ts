import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Helper to get authenticated user from request token
const getUser = async (req: NextRequest) => {
    // ⚠️ In a real app, use @supabase/auth-helpers-nextjs with cookies
    // Here we simplified by sending the Access Token in Authorization header
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return null;

    const { data: { user }, error } = await supabase.auth.getUser(token);
    return user;
};

// Encryption Helpers
const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
// Fallback if key is missing (dev only)
if (ENCRYPTION_KEY.length !== 32) {
    console.warn('WARNING: ENCRYPTION_KEY is not set or invalid (must be 32 bytes hex). using fallback for dev.');
}

function encrypt(text: string) {
    if (ENCRYPTION_KEY.length !== 32) return text; // Fail open for dev if needed
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text: string) {
    if (ENCRYPTION_KEY.length !== 32) return text;
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) return text; // Not encrypted or old format
        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        // Failed to decrypt (maybe it was old masked key), return as is
        return text;
    }
}

export async function POST(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Generate a secure random key (256-bit entropy)
        const rawKey = `sk_live_${crypto.randomBytes(32).toString('hex')}`;

        // Hash the key for verification (SHA-256) - One Way
        const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');

        // Encrypt the key for retrieval (AES-256) - Reversible
        const encryptedKey = encrypt(rawKey);

        // Insert into Supabase
        const { data, error } = await supabase
            .from('api_keys')
            .insert([{
                user_id: user.id,
                key_hash: hashedKey,       // Used for Rate Limiter / Auth Check (Fast & Secure)
                key: encryptedKey,         // Used for Dashboard Display (Encrypted)
                is_active: true,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // Return the RAW key to the user
        return NextResponse.json({ key: rawKey });
    } catch (e: any) {
        console.error('Generate Key Error:', e);
        return NextResponse.json({ error: e.message || 'Failed to generate key' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch existing key
    const { data, error } = await supabase
        .from('api_keys')
        .select('key, key_hash, created_at')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error && error.code !== 'PGRST116') {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json({ key: null });
    }

    // Decrypt the key for display
    const visibleKey = decrypt(data.key);

    return NextResponse.json({
        key: visibleKey,
        created_at: data.created_at
    });
}
