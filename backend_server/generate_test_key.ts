
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irnainptmtjaxftjzhwp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyODAwNiwiZXhwIjoyMDgxODA0MDA2fQ.1QeNHcpu7vgoSo2V2PzH_ComI4XtviB_uysX0Km7NuY'; // Replace with actual if needed from env or use env var
// Note: In real env, use process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

function encrypt(text: string) {
    if (ENCRYPTION_KEY.length !== 32) return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

async function createTestKey() {
    console.log('--- Generating Test Key ---');

    // 1. Get a random user
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    if (userError || !users || users.length === 0) {
        console.error('❌ No users found.');
        return;
    }
    const testUser = users[0];

    // 2. Generate Key
    const rawKey = `sk_live_TEST_${crypto.randomBytes(16).toString('hex')}`;
    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    const encryptedKey = encrypt(rawKey);

    // 3. Insert
    const { error: insertError } = await supabase
        .from('api_keys')
        .insert([{
            user_id: testUser.id,
            key_hash: hashedKey,
            key: encryptedKey,
            is_active: true,
            created_at: new Date().toISOString()
        }]);


    if (insertError) {
        console.error('❌ Insert Failed:', insertError.message);
    } else {
        console.log('✅ Test Key Created!');
        console.log(`KEY: ${rawKey}`);
        require('fs').writeFileSync('key.txt', rawKey);
    }
}

createTestKey();
