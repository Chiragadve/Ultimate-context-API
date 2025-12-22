import axios from 'axios';
import { redis } from './redis';

const API_KEY = process.env.ABUSEIPDB_API_KEY || 'f109ab0d197a95b27fd95a94f933b15e7a82f11244508b6ba6d0f7a6dc17fef844af3210d2a689cb';

export interface AbuseIPDBResponse {
    data: {
        ipAddress: string;
        isPublic: boolean;
        ipVersion: number;
        isWhitelisted: boolean;
        usageType: string;
        isp: string;
        domain: string;
        hostnames: string[];
        isTor: boolean;
        totalReports: number;
        numDistinctUsers: number;
        lastReportedAt: string;
        abuseConfidenceScore: number;
        countryCode: string;
    }
}

export async function checkIPSafety(ip: string): Promise<AbuseIPDBResponse | null> {
    const cacheKey = `abuseipdb:${ip}`;

    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log(`[AbuseIPDB] Cache HIT for ${ip}`);
            return JSON.parse(cached);
        }

        const response = await axios.get('https://api.abuseipdb.com/api/v2/check', {
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
        redis.setex(cacheKey, 86400, JSON.stringify(data));

        return data;
    } catch (error: any) {
        console.error(`[AbuseIPDB] Error checking IP ${ip}:`, error.message);
        return null;
    }
}
