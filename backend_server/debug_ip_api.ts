
import axios from 'axios';

async function debugIP() {
    const ip = '119.160.60.159'; // User's IP
    // Exact URL from ip-api.ts
    const fields = 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency';
    const url = `http://ip-api.com/json/${ip}?fields=${fields}`;

    console.log(`Fetching: ${url}`);

    try {
        const res = await axios.get(url);
        console.log('--- Response Headers ---');
        console.log(res.headers);
        console.log('--- Response Data ---');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e: any) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Data:', e.response.data);
        }
    }
}

debugIP();
