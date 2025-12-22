import { WeatherData } from './open-meteo';
import { HolidayContext } from './nager-date';
import { AbuseIpDbData } from './abuse-ipdb';
import { MarketContext } from './frankfurter';

// 1. Shopping Vibe
export const calculateShoppingVibe = (
    weather: WeatherData | null,
    holidays: HolidayContext | null
): string => {
    if (holidays?.isHoliday) return 'Holiday Sale Frenzy!';

    // Check for upcoming holiday in near future (simple string check or logic if we parsed date)
    if (holidays?.upcomingHoliday && holidays.upcomingHoliday.includes('Christmas')) {
        return 'Pre-Christmas Shopping Rush';
    }

    if (!weather) return 'Standard Shopping';

    const { temperature, conditionCode } = weather;
    const isBadWeather = conditionCode >= 50;

    if (isBadWeather) {
        if (temperature < 5) return 'Cozy Indoor Shopping';
        return 'Mall Day (Rainy)';
    }

    const isWeekend = new Date().getDay() % 6 === 0;
    if (isWeekend) return 'City Walk & Browse';

    return 'Online Browsing';
};

// 2. Trust Index
export const calculateTrustIndex = (
    security: AbuseIpDbData | null,
    isp: string
): string => {
    if (!security) return 'Unknown Trust';

    console.log(`Trust Analysis: Score=${security.abuseConfidenceScore}, Usage=${security.usageType}, Reports=${security.totalReports}`);

    if (security.abuseConfidenceScore > 50) return 'High Risk';
    if (security.abuseConfidenceScore > 10) return 'Moderate Risk';

    // Usage Type Analysis
    const isDataCenter = security.usageType?.toLowerCase().includes('data center');
    const isMobile = security.usageType?.toLowerCase().includes('mobile');

    if (isDataCenter && security.abuseConfidenceScore < 10) {
        return 'Suspicious but Verified (VPN?)';
    }

    if (isMobile) return 'Verified Mobile User';
    if (security.totalReports > 0) return `Low Risk (${security.totalReports} reports)`;

    return 'Safe Request';
};

// 3. Market Context
export const calculateMarketContext = (
    countryCode: string,
    market: MarketContext | null
): string => {
    if (!market) return `User in ${countryCode}, Market Unknown`;

    const { currencyCode, rateUsd } = market;
    return `User in ${countryCode}, paying in ${currencyCode} (1 USD = ${rateUsd} ${currencyCode})`;
};
