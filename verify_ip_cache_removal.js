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
    const ip1 = '2.2.2.150';

    console.log(`\n--- Request 1: ${ip1} ---`);
    const res1 = await fetchApi(ip1);
    printDetails(res1);

    console.log(`\n--- Request 2: ${ip1} (SAME IP - Should NOT be full cache hit) ---`);
    const res2 = await fetchApi(ip1);
    printDetails(res2);

    if (res2.meta.cache_hit === true) {
        console.log(`❌ FAILURE: IP Cache still active!`);
    } else {
        console.log(`✅ SUCCESS: Full IP Cache is gone.`);
    }

    if (res2.meta.shared_cache_hit === true) {
        console.log(`✅ SUCCESS: Shared City Cache is active.`);
    } else {
        console.log(`⚠️ CHECK: Shared Cache missed (might be first run/expired).`);
    }
};

const printDetails = (res) => {
    if (res.error) {
        console.log('Error:', res.raw);
        return;
    }
    console.log(`Total Client Latency: ${res.client_measured_latency}ms`);
    console.log(`API Reported Latency: ${res.meta.latency_ms}ms`);
    console.log(`Shared Cache Hit:     ${res.meta.shared_cache_hit}`);
    console.log(`Full Cache Hit:       ${res.meta.cache_hit}`);
};

run();
