import axios from 'axios';

export interface AbuseIpDbData {
    ipAddress: string;
    isPublic: boolean;
    ipVersion: number;
    isWhitelisted: boolean;
    abuseConfidenceScore: number;
    countryCode: string;
    usageType: string;
    isp: string;
    domain: string;
    hostnames: string[];
    isTor: boolean;
    totalReports: number;
    numDistinctUsers: number;
    lastReportedAt: string;
}

const ABUSE_IPDB_URL = 'https://api.abuseipdb.com/api/v2/check';

export const fetchSecurity = async (ip: string): Promise<AbuseIpDbData | null> => {
    // Hardcoded for reliable verification
    const apiKey = 'f109ab0d197a95b27fd95a94f933b15e7a82f11244508b6ba6d0f7a6dc17fef844af3210d2a689cb';

    if (!apiKey) {
        console.warn('ABUSEIPDB_KEY missing.');
        return null;
    }
    console.log(`Fetching security for IP: ${ip} with key length ${apiKey.length}`);

    try {
        const response = await axios.get(ABUSE_IPDB_URL, {
            params: {
                ipAddress: ip,
                maxAgeInDays: 90,
            },
            headers: {
                Key: apiKey,
                Accept: 'application/json',
            },
            timeout: 2000,
        });

        return response.data?.data || null;
    } catch (error) {
        console.error('AbuseIPDB Fetch Error:', error);
        return null;
    }
};
