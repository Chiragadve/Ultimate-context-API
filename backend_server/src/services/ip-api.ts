import axios from 'axios';

export interface IPGeoData {
    status: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    as: string;
    query: string;
    mobile?: boolean;
    proxy?: boolean;
    hosting?: boolean;
    currency: string;
}

export async function resolveIP(ip: string): Promise<IPGeoData | null> {
    try {
        // Using http://ip-api.com/json/{query}?fields=...
        // We request: status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency
        const fields = 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency';
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=${fields}`, {
            timeout: 1500
        });

        if (response.data.status !== 'success') {
            return null;
        }

        return response.data;
    } catch (error: any) {
        console.error(`[IP-API] Error resolving ${ip}:`, error.message);
        return null;
    }
}
