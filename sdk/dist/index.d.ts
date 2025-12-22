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
export declare class UltimateContext {
    private client;
    private apiKey;
    constructor(config?: UltimateContextConfig);
    /**
     * Enrich an IP address with full context data.
     *
     * @param params - Parameters for enrichment (ip, fields, etc.)
     * @returns Promise resolving to the enriched context data
     */
    enrich(params?: EnrichParams): Promise<EnrichResponse>;
}
export default UltimateContext;
