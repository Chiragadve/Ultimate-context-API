const http = require('http');

const fetchApi = (ip, key = null) => {
    return new Promise((resolve) => {
        const headers = key ? { 'x-api-key': key } : {};
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: `/api/v1/enrich?ip=${ip}`,
            method: 'GET',
            headers: headers
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    remaining: res.headers['x-ratelimit-remaining'],
                    limit: res.headers['x-ratelimit-limit']
                });
            });
        });

        req.on('error', (e) => resolve({ status: 500 }));
        req.end();
    });
};

const run = async () => {
    const ip = '4.4.4.4';

    console.log(`\n--- Test 1: Anonymous (Expect Limit 20) ---`);
    for (let i = 0; i < 22; i++) {
        const res = await fetchApi(ip);
        process.stdout.write(`${res.status} `);
        if (i === 21 && res.status === 429) console.log('\n✅ Success: Blocked after 20');
        if (i === 0 && res.limit != 20) console.log(`\n❌ Fail: Limit header is ${res.limit}`);
    }

    console.log(`\n\n--- Test 2: Invalid Key (Expect 401) ---`);
    const resAuth = await fetchApi(ip, 'invalid-key-123');
    console.log(`Status: ${resAuth.status} (Expected 401)`);
    if (resAuth.status === 401) console.log('✅ Success: Invalid key rejected');
};

run();
