"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichContext = enrichContext;
const visual_crossing_1 = require("./visual-crossing");
const nager_date_1 = require("./nager-date");
const ip_api_1 = require("./ip-api");
const abuse_ipdb_1 = require("./abuse-ipdb");
const frankfurter_1 = require("./frankfurter");
const redis_1 = require("./redis");
const ua_parser_js_1 = require("ua-parser-js");
const CURRENCY_MAP = {
    'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY',
    'IN': 'INR', 'CA': 'CAD', 'AU': 'AUD'
};
async function enrichContext(ip, userAgent, apiKey) {
    const startTime = performance.now();
    const timings = {};
    // 1. IP Resolution
    const t0 = performance.now();
    const geo = await (0, ip_api_1.resolveIP)(ip);
    timings['ip_api'] = performance.now() - t0;
    if (!geo) {
        return {
            status: 'error',
            message: 'Failed to resolve location'
        };
    }
    // ...
    const { lat, lon, countryCode, city, timezone, isp, currency: geoCurrency } = geo;
    // Use IP-API currency if available, otherwise fallback to Map, finally USD
    const currency = geoCurrency || CURRENCY_MAP[countryCode] || 'USD';
    // Shared Cache Key
    const sharedKey = `shared:context:${countryCode}:${city}`;
    // 2. Parallel Fetch (User Specific vs Shared)
    // Start User Specific Fetches
    const tSecStart = performance.now();
    const securityPromise = (0, abuse_ipdb_1.checkIPSafety)(ip);
    // Logic to Fetch or Get Cached Shared Data
    const getSharedData = async () => {
        // Try Cache
        const cached = await redis_1.redis.get(sharedKey);
        if (cached) {
            return { ...JSON.parse(cached), _cache_hit: true };
        }
        // Fetch Fresh
        const [weather, holidays, market] = await Promise.all([
            (0, visual_crossing_1.fetchWeather)(lat, lon),
            (0, nager_date_1.fetchHolidays)(countryCode),
            (0, frankfurter_1.fetchCurrency)(currency)
        ]);
        const sharedData = {
            weather,
            holidays,
            currency: market || { currencyCode: currency, rateUsd: null }, // Fallback if market fetch fails
            _cache_hit: false
        };
        // Cache for 1 hour
        redis_1.redis.setex(sharedKey, 3600, JSON.stringify(sharedData));
        return sharedData;
    };
    const tSharedStart = performance.now();
    const sharedDataPromise = getSharedData();
    const [security, sharedData] = await Promise.all([
        securityPromise,
        sharedDataPromise
    ]);
    timings['security'] = performance.now() - tSecStart;
    timings['shared_data'] = performance.now() - tSharedStart;
    // Device Info
    const parser = new ua_parser_js_1.UAParser(userAgent);
    const ua = parser.getResult();
    const totalTime = performance.now() - startTime;
    return {
        ip,
        location: {
            city: geo.city,
            country: geo.country,
            timezone: geo.timezone,
            coordinates: { lat: geo.lat, lon: geo.lon },
            isp: geo.isp
        },
        context: {
            weather: sharedData.weather,
            currency: sharedData.currency,
            holidays: sharedData.holidays,
            security: {
                trust_rating: security?.data?.abuseConfidenceScore ? 100 - security.data.abuseConfidenceScore : 100
            },
            device: {
                browser: ua.browser.name,
                os: ua.os.name,
                type: ua.device.type || 'desktop'
            }
        }
    };
}
