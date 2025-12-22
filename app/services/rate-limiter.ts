import redis from '../lib/redis';
import { supabase } from '../lib/supabase';

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetIn: number; // Seconds until reset
}

export class RateLimiter {
    /**
     * Verifies if an API key is valid.
     * Caches the result in Redis for 5 minutes (300 seconds) to reduce DB hits.
     */
    static async isValidKey(apiKey: string): Promise<boolean> {
        if (!redis) return false; // Fail safe if Redis is down

        const cacheKey = `apikey:${apiKey}`;

        try {
            // 1. Check Cache
            const cachedParams = await redis.get(cacheKey);
            if (cachedParams === 'valid') return true;
            if (cachedParams === 'invalid') return false;

            // 2. Check Database (Supabase)
            // assuming table 'api_keys' with column 'key' and 'is_active'
            const { data, error } = await supabase
                .from('api_keys')
                .select('id')
                .eq('key', apiKey)
                .eq('is_active', true)
                .single();

            const isValid = !!data && !error;

            // 3. Cache Result (300s / 5m)
            await redis.setex(cacheKey, 300, isValid ? 'valid' : 'invalid');

            return isValid;
        } catch (error) {
            console.error('API Key Verification Error:', error);
            return false; // Fail closed
        }
    }

    /**
     * Checks if the identifier has exceeded the limit.
     * Uses a Fixed Window Counter strategy.
     */
    static async checkLimit(identifier: string, limit: number): Promise<RateLimitResult> {
        if (!redis) {
            // Fail open if Redis is down (allow traffic)
            return { success: true, remaining: 1, resetIn: 0 };
        }

        const key = `ratelimit:${identifier}`;

        try {
            const multi = redis.multi();
            multi.incr(key);
            multi.ttl(key);

            const results = await multi.exec();

            // Result 0: [error, newValue]
            // Result 1: [error, ttl]

            const count = results?.[0]?.[1] as number;
            let ttl = results?.[1]?.[1] as number;

            // If key didn't exist, count is 1 and ttl is -1. Set expiry.
            if (count === 1 && ttl === -1) {
                await redis.expire(key, 60);
                ttl = 60;
            }

            const remaining = Math.max(0, limit - count);

            return {
                success: count <= limit,
                remaining,
                resetIn: ttl > 0 ? ttl : 60
            };

        } catch (error) {
            console.error('Rate Limiter Error:', error);
            // Fail open logic: allow if system errors
            return { success: true, remaining: 1, resetIn: 0 };
        }
    }
}
