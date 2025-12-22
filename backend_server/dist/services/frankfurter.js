"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCurrency = void 0;
const axios_1 = __importDefault(require("axios"));
const FRANKFURTER_URL = 'https://api.frankfurter.app/latest';
const fetchCurrency = async (currencyCode) => {
    if (!currencyCode || currencyCode === 'USD') {
        if (currencyCode === 'USD') {
            return { currencyCode: 'USD', rateUsd: 1.0 };
        }
    }
    try {
        // API: ?from=USD&to=EUR
        const response = await axios_1.default.get(FRANKFURTER_URL, {
            params: {
                from: 'USD',
                to: currencyCode,
            },
            timeout: 2000,
        });
        if (!response.data || !response.data.rates) {
            return null;
        }
        const rate = response.data.rates[currencyCode];
        return {
            currencyCode,
            rateUsd: rate || null,
        };
    }
    catch (error) {
        // Frankfurter might 404 for unsupported currencies (like PKR sometimes if not in ECB list)
        // We will return null and handle fallback or just return code without rate
        return null;
    }
};
exports.fetchCurrency = fetchCurrency;
