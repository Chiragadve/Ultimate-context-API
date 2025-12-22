

import axios from 'axios';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY || 'HRRH4UAAU8GX7HZF855WC43RP';

async function testWeather() {
    console.log('--- STARTING WEATHER TEST ---');
    console.log(`Key: ${API_KEY}`);
    const lat = 33.7123;
    const lon = 73.0402;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${API_KEY}&contentType=json&include=current`;

    try {
        console.log(`GET ${url}`);
        const response = await axios.get(url, { timeout: 10000 });
        console.log('✅ RESPONSE RECEIVED');
        console.log('Status:', response.status);
        console.log('Current Conditions:', JSON.stringify(response.data.currentConditions, null, 2));
    } catch (e: any) {
        console.error('❌ ERROR CAUGHT');
        if (e.response) {
            console.error('Status:', e.response.status);
            console.error('Data:', JSON.stringify(e.response.data));
        } else {
            console.error('Message:', e.message);
        }
    } finally {
        console.log('--- FINISHED ---');
    }
}

testWeather().then(() => console.log('Done')).catch(err => console.error('Top Level Error', err));

