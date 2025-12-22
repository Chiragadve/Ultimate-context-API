const http = require('http');

const fetchApi = (ip) => {
    return new Promise((resolve) => {
        const url = `http://localhost:3000/api/v1/enrich?ip=${ip}`;
        const start = Date.now();
        http.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                const total = Date.now() - start;
                try {
                    const json = JSON.parse(data);
                    json.client_measured_latency = total;
                    resolve(json);
                } catch (e) { resolve({ error: true, raw: data, total }); }
            });
        });
    });
};

const run = async () => {
    // 2.2.2.x -> usually Washington, US
    const ip1 = '2.2.2.100';
    const ip2 = '2.2.2.101';

    console.log(`\n--- Request 1: ${ip1} (Prime Cache) ---`);
    const res1 = await fetchApi(ip1);
    printDetails(res1);

    console.log(`\n--- Request 2: ${ip2} (Should be Shared HIT) ---`);
    const res2 = await fetchApi(ip2);
    printDetails(res2);
};

const printDetails = (res) => {
    if (res.error) {
        console.log('Error:', res.raw);
        return;
    }
    console.log(`Total Client Latency: ${res.client_measured_latency}ms`);
    console.log(`API Reported Latency: ${res.meta.latency_ms}ms`);
    console.log(`Shared Cache Hit:     ${res.meta.shared_cache_hit}`);
    console.log(`Debug Timings:`);
    if (res.meta.debug_timings) {
        Object.entries(res.meta.debug_timings).forEach(([k, v]) => {
            console.log(`   - ${k}: ${v}ms`);
        });
    }
};

run();
