import redis from '../lib/redis';
import { logRequest } from '../lib/supabase';
import * as IpApi from './ip-api';
import * as AbuseIpDb from './abuse-ipdb';
import * as VisualCrossing from './visual-crossing';
import * as NagerDate from './nager-date';
import * as Frankfurter from './frankfurter';
import * as UserAgent from './user-agent';
import * as Logic from './logic';

export const enrichContext = async (ip: string, userAgent: string) => {
    const start = Date.now();
    const timings: Record<string, number> = {};

    // Helper to time promises
    const timeCall = async <T>(name: string, promise: Promise<T>): Promise<T> => {
        const t0 = Date.now();
        try {
            const res = await promise;
            timings[name] = Date.now() - t0;
            return res;
        } catch (e) {
            timings[name] = Date.now() - t0; // Still record time on failure
            throw e;
        }
    };

    // 1. Check Cache - REMOVED (User requested City-based only)
    // We no longer check for `context:${ip}` here.

    // 2. Wave 1: Anchor (Location)
    let location;
    try {
        location = await timeCall('ip_api', IpApi.fetchLocation(ip));
    } catch (e) {
        // handle error if needed, for now just let it throw or handle below
    }

    if (!location) {
        throw new Error('Failed to resolve location (Wave 1)');
    }

    // 3. Shared Context (Location-Based)
    const sharedKey = `shared:context:${location.countryCode}:${location.city}`;
    let sharedContext: any = null;

    if (redis) {
        try {
            const cachedShared = await redis.get(sharedKey);
            if (cachedShared) {
                sharedContext = JSON.parse(cachedShared);
                console.log(`Shared Cache HIT for Key: ${sharedKey}`);
            } else {
                console.log(`Shared Cache MISS for Key: ${sharedKey}`);
            }
        } catch (err) {
            console.error('Redis Shared Get Error:', err);
        }
    }

    // 4. Wave 2: Fan-Out
    // We launch all unrelated requests in parallel
    // If shared context exists, we use it directly instead of calling API

    const pSecurity = timeCall('abuse_ipdb', AbuseIpDb.fetchSecurity(ip));
    const pDevice = timeCall('user_agent', UserAgent.fetchDevice(userAgent));

    const pWeather = sharedContext?.weather
        ? Promise.resolve(sharedContext.weather)
        : timeCall('visual_crossing', VisualCrossing.fetchWeather(location.lat, location.lon));

    const pHolidays = sharedContext?.holidays
        ? Promise.resolve(sharedContext.holidays)
        : timeCall('nager_date', NagerDate.fetchHolidays(location.countryCode));

    const pCurrency = sharedContext?.currency
        ? Promise.resolve(sharedContext.currency)
        : timeCall('frankfurter', Frankfurter.fetchCurrency(location.currency));

    const [securityResult, weatherResult, holidayResult, currencyResult, deviceResult] = await Promise.allSettled([
        pSecurity,
        pWeather,
        pHolidays,
        pCurrency,
        pDevice
    ]);

    // Extract results (helper to get value or null)
    const getVal = <T>(res: PromiseSettledResult<T>): T | null =>
        res.status === 'fulfilled' ? res.value : null;

    const security = getVal(securityResult);
    const weather = getVal(weatherResult);
    const holidays = getVal(holidayResult);
    const currency = getVal(currencyResult);
    const device = getVal(deviceResult);

    // 5. Cache Shared Context (If it was a MISS)
    if (!sharedContext && redis && weather && holidays && currency) {
        const toCache = { weather, holidays, currency };
        // Fire and forget - do not await
        redis.setex(sharedKey, 3600, JSON.stringify(toCache)).catch(err => {
            console.error('Redis Shared Set Error:', err);
        });
    }

    // 6. Smart Logic (Trust Only)
    const trustIndex = Logic.calculateTrustIndex(security, location.isp);
    // Removed: Shopping Vibe & Market Context as per request

    // 7. Construct Response
    const response = {
        ip,
        location: {
            city: location.city,
            country: location.country,
            country_code: location.countryCode,
            timezone: location.timezone,
            coordinates: { lat: location.lat, lon: location.lon },
            isp: location.isp,
        },
        context: {
            weather: weather ? {
                temp_c: weather.temperature,
                condition: weather.conditionText,
                is_day: weather.isDay
            } : null,
            currency: currency ? {
                code: currency.currencyCode,
                rate_usd: currency.rateUsd,
            } : null,
            holidays: holidays ? {
                is_holiday: holidays.isHoliday,
                upcoming: holidays.upcomingHoliday
            } : null,
            security: security ? {
                vpn_detected: security.usageType === 'Data Center',
                abuse_score: security.abuseConfidenceScore,
                isp: security.isp,
                usage_type: security.usageType,
                trust_rating: trustIndex // Moved here
            } : null,
            device: device ? {
                browser: device.client?.name,
                os: device.os?.name,
                type: device.device?.type
            } : null
        },
        // Removed: smart_insights object
        // meta: { ... } - REMOVED (Production Ready)
    };

    // 8. Cache Result (1 Hour) - REMOVED
    // We no longer set `context:${ip}`.

    // 9. Async Logging (Fire and Forget)
    logRequest({
        ip,
        country: location.country,
        city: location.city,
        lat: location.lat,
        lon: location.lon,
        user_agent: userAgent,
        // Removed: shopping_vibe
        trust_index: trustIndex,
        latency_ms: Date.now() - start,
        status: 'success',
        source_count: 6 // simplified
    });

    return response;
};
