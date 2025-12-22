const http = require('http');

const fetchApi = (ip) => {
    return new Promise((resolve) => {
        const url = `http://localhost:3000/api/v1/enrich?ip=${ip}`;
        http.get(url, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) { resolve(null); }
            });
        });
    });
};

const run = async () => {
    const id = Math.floor(Math.random() * 100);
    // Use 2.2.2.x range which likely resolves to Washington
    const ip1 = `2.2.2.${10 + id}`;
    const ip2 = `2.2.2.${11 + id}`;

    // 1. Prime Cache with IP A
    console.log(`1. Priming cache for Washington (${ip1})...`);
    const res1 = await fetchApi(ip1);
    console.log(`   Internal Latency: ${res1.meta.latency_ms}ms`);
    console.log(`   Shared Cache Hit: ${res1.meta.shared_cache_hit}`);
    console.log(`   Full Cache Hit:   ${res1.meta.cache_hit || false}`);

    // 2. Fetch with IP B (Same Location, New IP)
    console.log(`2. Fetching for Washington (${ip2})...`);
    const res2 = await fetchApi(ip2);
    console.log(`   Internal Latency: ${res2.meta.latency_ms}ms`);
    console.log(`   Shared Cache Hit: ${res2.meta.shared_cache_hit}`);
    console.log(`   Full Cache Hit:   ${res2.meta.cache_hit || false}`);

    if (res2.meta.shared_cache_hit && !res2.meta.cache_hit) {
        console.log(`✅ SUCCESS: Hit Shared Cache but verified Unique IP.`);
        console.log(`   Timings:`, JSON.stringify(res2.meta.debug_timings));
    } else {
        console.log(`⚠️ CHECK: Full cache might be interfering or Shared Cache Miss.`);
    }
};

run();
