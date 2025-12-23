import axios, { AxiosInstance } from 'axios';

export interface UltimateContextConfig {
    apiKey?: string;
    baseURL?: string;
}

export interface EnrichParams {
    ip?: string;
    fields?: string[];
    debug?: boolean;
}

export interface LocationData {
    city?: string;
    country?: string;
    timezone?: string;
    isp?: string;
    [key: string]: any;
}

export interface ContextData {
    weather?: any;
    currency?: any;
    security?: any;
    holidays?: any;
    device?: any;
    [key: string]: any;
}

export interface EnrichResponse {
    ip: string;
    location: LocationData;
    context: ContextData;
}

export class UltimateContext {
    private client: AxiosInstance;
    private apiKey: string;

    constructor(config: UltimateContextConfig = {}) {
        this.apiKey = config.apiKey || process.env['ULTIMATE_CONTEXT_API_KEY'] || '';

        if (!this.apiKey) {
            console.warn('UltimateContext: No API key provided. Requests may be limited.');
        }

        this.client = axios.create({
            baseURL: config.baseURL || 'https://ultimate-context-api.vercel.app/v1', // Default to production
            headers: {
                'x-api-key': this.apiKey,
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Enrich an IP address with full context data.
     * 
     * @param params - Parameters for enrichment (ip, fields, etc.)
     * @returns Promise resolving to the enriched context data
     */
    async enrich(params: EnrichParams = {}): Promise<EnrichResponse> {
        try {
            const queryParams: any = {};
            if (params.ip) queryParams.ip = params.ip;
            if (params.fields) queryParams.fields = params.fields.join(',');
            if (params.debug) queryParams.debug = 'true';

            const response = await this.client.get('/enrich', {
                params: queryParams
            });

            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw new Error(`UltimateContext API Error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
}

export default UltimateContext;
