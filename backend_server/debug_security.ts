
import axios from 'axios';

const API_KEY = process.env.ABUSEIPDB_API_KEY || 'f109ab0d197a95b27fd95a94f933b15e7a82f11244508b6ba6d0f7a6dc17fef844af3210d2a689cb';

async function testSecurity() {
    console.log('--- STARTING SECURITY TEST ---');
    console.log(`Key: ${API_KEY.substring(0, 10)}...`);
    const ip = '119.160.60.159'; // Provided IP

    try {
        const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
            params: {
                ipAddress: ip,
                maxAgeInDays: 90
            },
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            },
            timeout: 5000
        });

        console.log('✅ RESPONSE RECEIVED');
        console.log('Data:', JSON.stringify(response.data, null, 2));
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

testSecurity();
