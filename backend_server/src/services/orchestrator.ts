import { fetchWeather, WeatherData } from './visual-crossing';
import { fetchHolidays, HolidayContext } from './nager-date';
import { resolveIP } from './ip-api';
import { checkIPSafety } from './abuse-ipdb';
import { fetchCurrency } from './frankfurter';
import { redis } from './redis';
import { UAParser } from 'ua-parser-js';

const CURRENCY_MAP: Record<string, string> = {
    'US': 'USD', 'GB': 'GBP', 'EU': 'EUR', 'JP': 'JPY',
    'IN': 'INR', 'CA': 'CAD', 'AU': 'AUD'
};

export async function enrichContext(ip: string, userAgent: string, apiKey: string) {
    const startTime = performance.now();
    const timings: Record<string, number> = {};

    // 1. IP Resolution
    const t0 = performance.now();
    const geo = await resolveIP(ip);
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
    const securityPromise = checkIPSafety(ip);

    // Logic to Fetch or Get Cached Shared Data
    const getSharedData = async () => {
        // Try Cache
        const cached = await redis.get(sharedKey);
        if (cached) {
            return { ...JSON.parse(cached), _cache_hit: true };
        }

        // Fetch Fresh
        const [weather, holidays, market] = await Promise.all([
            fetchWeather(lat, lon),
            fetchHolidays(countryCode),
            fetchCurrency(currency)
        ]);

        const sharedData = {
            weather,
            holidays,
            currency: market || { currencyCode: currency, rateUsd: null }, // Fallback if market fetch fails
            _cache_hit: false
        };

        // Cache for 1 hour
        redis.setex(sharedKey, 3600, JSON.stringify(sharedData));
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
    const parser = new UAParser(userAgent);
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
