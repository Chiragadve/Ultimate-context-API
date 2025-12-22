"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIPSafety = checkIPSafety;
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("./redis");
const API_KEY = process.env.ABUSEIPDB_API_KEY || 'f109ab0d197a95b27fd95a94f933b15e7a82f11244508b6ba6d0f7a6dc17fef844af3210d2a689cb';
async function checkIPSafety(ip) {
    const cacheKey = `abuseipdb:${ip}`;
    try {
        const cached = await redis_1.redis.get(cacheKey);
        if (cached) {
            console.log(`[AbuseIPDB] Cache HIT for ${ip}`);
            return JSON.parse(cached);
        }
        const response = await axios_1.default.get('https://api.abuseipdb.com/api/v2/check', {
            params: {
                ipAddress: ip,
                maxAgeInDays: 90
            },
            headers: {
                'Key': API_KEY,
                'Accept': 'application/json'
            },
            timeout: 2000 // 2s timeout
        });
        const data = response.data;
        // Cache for 24 hours (86400 seconds)
        redis_1.redis.setex(cacheKey, 86400, JSON.stringify(data));
        return data;
    }
    catch (error) {
        console.error(`[AbuseIPDB] Error checking IP ${ip}:`, error.message);
        return null;
    }
}
