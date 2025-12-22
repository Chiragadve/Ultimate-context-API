
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use Service Role to bypass RLS for debugging
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irnainptmtjaxftjzhwp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyODAwNiwiZXhwIjoyMDgxODA0MDA2fQ.1QeNHcpu7vgoSo2V2PzH_ComI4XtviB_uysX0Km7NuY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function diagnose() {
    console.log('--- Supabase Deep Diagnostic ---');
    console.log('Target Project:', SUPABASE_URL);

    // 1. Check if table exists and inspect columns via SELECT *
    console.log('\n[1] Inspecting Table Schema via Select...');
    const { data: tableData, error: selectError } = await supabase
        .from('api_keys')
        .select('*')
        .limit(1);

    if (selectError) {
        console.error('❌ Error reading table:', selectError.message);
        console.error('Details:', selectError);
    } else {
        console.log('✅ Read successful.');
        if (tableData.length === 0) {
            console.log('   Table is empty, cannot infer columns from data.');
        } else {
            console.log('   Detected Columns:', Object.keys(tableData[0]));
        }
    }

    // 2. Try to Insert a dummy record to force a schema error
    console.log('\n[2] Attempting Test Insert...');
    // We need a valid User ID. Let's try to fetch one first.
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError || !users || users.length === 0) {
        console.error('❌ Could not fetch any users to test insert against.');
        return;
    }

    const testUser = users[0];
    console.log(`   Using User ID: ${testUser.id} (${testUser.email})`);

    const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
            user_id: testUser.id,
            key: 'test_key_diagnostic_' + Date.now(),
            is_active: false
        });

    if (insertError) {
        console.error('❌ Insert Failed:', insertError.message);
        console.error('   Hint/Details:', insertError.details, insertError.hint);
    } else {
        console.log('✅ Insert Successful! The table schema is CORRECT.');
        // Cleanup
        await supabase.from('api_keys').delete().eq('key', 'test_key_diagnostic_' + Date.now());
    }
}

diagnose();
