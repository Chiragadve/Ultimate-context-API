"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UltimateContext = void 0;
const axios_1 = __importDefault(require("axios"));
class UltimateContext {
    constructor(config = {}) {
        this.apiKey = config.apiKey || process.env['ULTIMATE_CONTEXT_API_KEY'] || '';
        if (!this.apiKey) {
            console.warn('UltimateContext: No API key provided. Requests may be limited.');
        }
        this.client = axios_1.default.create({
            baseURL: config.baseURL || 'http://localhost:4000/v1', // Default to local for now, strictly per project state
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
    async enrich(params = {}) {
        try {
            const queryParams = {};
            if (params.ip)
                queryParams.ip = params.ip;
            if (params.fields)
                queryParams.fields = params.fields.join(',');
            if (params.debug)
                queryParams.debug = 'true';
            const response = await this.client.get('/enrich', {
                params: queryParams
            });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new Error(`UltimateContext API Error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
}
exports.UltimateContext = UltimateContext;
exports.default = UltimateContext;
