import axios from 'axios';

export interface IpApiData {
    query: string;
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
    currency: string;
}

const IP_API_URL = 'http://ip-api.com/json/';

export const fetchLocation = async (ip: string): Promise<IpApiData | null> => {
    try {
        // Using explicit fields to include currency
        // status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency
        const fields = 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency';

        // If ip is empty, it defaults to caller. If ip is provided, append it.
        const url = ip ? `${IP_API_URL}${ip}?fields=${fields}` : `${IP_API_URL}?fields=${fields}`;

        const response = await axios.get<IpApiData>(url, {
            timeout: 2000,
        });

        if (response.data.status !== 'success') {
            console.warn('IP-API returned fail status:', response.data);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('IP-API Fetch Error:', error);
        return null;
    }
};
