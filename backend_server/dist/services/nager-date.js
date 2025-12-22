"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHolidays = fetchHolidays;
const axios_1 = __importDefault(require("axios"));
async function fetchHolidays(countryCode) {
    try {
        const year = new Date().getFullYear();
        const response = await axios_1.default.get(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`, {
            timeout: 1500
        });
        const holidays = response.data;
        const today = new Date().toISOString().split('T')[0];
        const match = holidays.find((h) => h.date === today);
        return {
            is_holiday: !!match,
            holiday_name: match ? match.name : null
        };
    }
    catch (error) {
        // Nager is often flaky, return default
        return { is_holiday: false, holiday_name: null };
    }
}
