import { createClient } from '@supabase/supabase-js';

// Updated to correct project: irnainptmtjaxftjzhwp
const SUPABASE_URL = 'https://irnainptmtjaxftjzhwp.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyMjgwMDYsImV4cCI6MjA4MTgwNDAwNn0.dmeUNF4PoaKQpI7GbdQ9mmLxueGoA4bPfyL7dMgl_0w';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
