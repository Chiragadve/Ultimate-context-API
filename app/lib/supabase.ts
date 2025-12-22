import { createClient } from '@supabase/supabase-js';

// Hardcoded for reliable verification in agent environment
// Updated to correct project: irnainptmtjaxftjzhwp
const supabaseUrl = 'https://irnainptmtjaxftjzhwp.supabase.co';
// Using Service Role Key for backend operations
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyODAwNiwiZXhwIjoyMDgxODA0MDA2fQ.1QeNHcpu7vgoSo2V2PzH_ComI4XtviB_uysX0Km7NuY';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface RequestLog {
    ip?: string;
    country?: string;
    city?: string;
    lat?: number;
    lon?: number;
    user_agent?: string;
    shopping_vibe?: string;
    trust_index?: string;
    latency_ms?: number;
    status: 'success' | 'partial' | 'error';
    source_count: number;
}

export const logRequest = async (data: RequestLog) => {
    try {
        const { error } = await supabase.from('request_logs').insert([
            {
                ...data,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            console.error('Supabase Logging Error:', error.message);
        }
    } catch (err) {
        console.error('Supabase Logging Exception:', err);
    }
};
