const http = require('http');

const ip = '1.2.3.' + Math.floor(Math.random() * 255);
const url = `http://localhost:3000/api/v1/enrich?ip=${ip}`;

console.log(`Fetching ${url}...`);

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Overall Latency:', json.meta.latency_ms, 'ms');
            console.log('Debug Timings:', JSON.stringify(json.meta.debug_timings, null, 2));
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            console.log('Raw data:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
