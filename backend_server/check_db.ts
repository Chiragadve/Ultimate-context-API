
import { supabase } from './src/services/supabase';

async function check() {
    console.log('Checking connection to Supabase...');
    const { data, error } = await supabase.from('api_keys').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error connecting/reading:', error);
    } else {
        console.log('Success! Table api_keys exists.');
        console.log('Count:', data);
    }
}

check();
