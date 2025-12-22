import axios from 'axios';

export interface DeviceData {
    client: {
        name: string;
        version: string;
        engine: string;
    };
    os: {
        name: string;
        version: string;
        platform: string;
    };
    device: {
        type: string;
        brand: string;
        model: string;
    };
}

const APIC_AGENT_URL = 'https://api.apicagent.com/';

export const fetchDevice = async (userAgent: string): Promise<DeviceData | null> => {
    if (!userAgent) return null;

    try {
        // "Sanitization: Ensure the user-agent string is URL-encoded" (axios params does this, but being explicit doesn't hurt)
        // The user instruction: "Sanitization: Ensure the user-agent string is URL-encoded before being sent to ApicAgent."
        // Actually, passing it as param 'ua' in axios handles encoding.

        const response = await axios.get(APIC_AGENT_URL, {
            params: {
                ua: userAgent,
            },
            timeout: 2000,
        });

        return response.data;
    } catch (error) {
        console.error('ApicAgent Fetch Error:', error);
        return null;
    }
};
