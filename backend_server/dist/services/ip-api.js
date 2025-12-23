"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveIP = resolveIP;
const axios_1 = __importDefault(require("axios"));
async function resolveIP(ip) {
    try {
        // Using http://ip-api.com/json/{query}?fields=...
        // We request: status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency
        const fields = 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query,currency';
        const response = await axios_1.default.get(`http://ip-api.com/json/${ip}?fields=${fields}`, {
            timeout: 1500
        });
        if (response.data.status !== 'success') {
            return null;
        }
        return response.data;
    }
    catch (error) {
        console.error(`[IP-API] Error resolving ${ip}:`, error.message);
        return null;
    }
}
