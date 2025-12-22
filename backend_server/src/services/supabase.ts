import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Use Service Role Key for Backend Operations
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://irnainptmtjaxftjzhwp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlybmFpbnB0bXRqYXhmdGp6aHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjIyODAwNiwiZXhwIjoyMDgxODA0MDA2fQ.1QeNHcpu7vgoSo2V2PzH_ComI4XtviB_uysX0Km7NuY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
