"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const redis_1 = require("./redis");
const supabase_1 = require("./supabase");
const crypto_1 = __importDefault(require("crypto"));
class RateLimiter {
    static async check(ip, apiKey) {
        let limit = this.ANON_LIMIT_RPM;
        let identifier = `ip:${ip}`;
        let tier = 'anonymous';
        const now = Math.floor(Date.now() / 1000);
        if (apiKey) {
            // 1. Hash the incoming key to match DB storage
            const hashedKey = crypto_1.default.createHash('sha256').update(apiKey).digest('hex');
            // 2. Verify API Key (Cache First using HASH as key to look up validity)
            // We cache the result of the HASH validation.
            // Helper key: apikey:<hash> -> '1' (valid) | '0' (invalid)
            const cacheKey = `apikey:${hashedKey}`;
            const cachedValid = await redis_1.redis.get(cacheKey);
            let isValid = false;
            if (cachedValid === '1') {
                isValid = true;
            }
            else if (cachedValid === '0') {
                isValid = false;
            }
            else {
                // Check Database using the HASH
                const { data, error } = await supabase_1.supabase
                    .from('api_keys')
                    .select('id')
                    .eq('key_hash', hashedKey) // Compare against stored hash
                    .eq('is_active', true)
                    .single();
                if (data) {
                    isValid = true;
                    // Cache Valid Result for 5 mins
                    redis_1.redis.setex(cacheKey, 300, '1');
                }
                else {
                    // Cache Invalid Result for 5 mins
                    redis_1.redis.setex(cacheKey, 300, '0');
                }
            }
            if (isValid) {
                limit = this.AUTH_LIMIT_RPM;
                identifier = `key:${hashedKey}`; // Use hash for rate limit bucket identifier logic too
                tier = 'authenticated';
            }
            else {
                // Invalid Key Logic - Fail Explicitly
                return {
                    success: false,
                    limit: 0,
                    remaining: 0,
                    reset: (Math.floor(now / this.WINDOW_SECONDS) + 1) * this.WINDOW_SECONDS,
                    tier: 'anonymous',
                    error: 'Invalid API Key'
                };
            }
        }
        const windowKey = `ratelimit:${identifier}:${Math.floor(now / this.WINDOW_SECONDS)}`;
        const multi = redis_1.redis.multi();
        multi.incr(windowKey);
        multi.expire(windowKey, this.WINDOW_SECONDS); // Auto-cleanup
        const results = await multi.exec();
        const currentCount = results ? results[0][1] : 1;
        const remaining = Math.max(0, limit - currentCount);
        const reset = (Math.floor(now / this.WINDOW_SECONDS) + 1) * this.WINDOW_SECONDS;
        return {
            success: currentCount <= limit,
            limit,
            remaining,
            reset,
            tier
        };
    }
}
exports.RateLimiter = RateLimiter;
RateLimiter.AUTH_LIMIT_RPM = 100;
RateLimiter.ANON_LIMIT_RPM = 20;
RateLimiter.WINDOW_SECONDS = 60;
