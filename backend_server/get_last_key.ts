
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irnainptmtjaxftjzhwp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyODAwNiwiZXhwIjoyMDgxODA0MDA2fQ.1QeNHcpu7vgoSo2V2PzH_ComI4XtviB_uysX0Km7NuY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');

function decrypt(text: string) {
    if (ENCRYPTION_KEY.length !== 32) return text;
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) return text;
        const iv = Buffer.from(textParts[0], 'hex');
        const encryptedText = Buffer.from(textParts[1], 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        return text;
    }
}

async function getLastKey() {
    const { data, error } = await supabase
        .from('api_keys')
        .select('key, created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching key:', error.message);
    } else {
        const rawKey = decrypt(data.key);
        console.log(`LATEST_KEY=${rawKey}`);
    }
}

getLastKey();
