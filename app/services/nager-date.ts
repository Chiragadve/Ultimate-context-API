import axios from 'axios';
import { getYear } from 'date-fns';

export interface PublicHoliday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
}

export interface HolidayContext {
    isHoliday: boolean;
    upcomingHoliday: string | null;
}

const NAGER_DATE_URL = 'https://date.nager.at/api/v3/PublicHolidays';

export const fetchHolidays = async (countryCode: string): Promise<HolidayContext | null> => {
    console.log(`Fetching holidays for Country: ${countryCode}`);
    if (!countryCode) return null;
    const year = getYear(new Date());

    try {
        const url = `${NAGER_DATE_URL}/${year}/${countryCode}`;
        const response = await axios.get<PublicHoliday[]>(url, {
            timeout: 2000,
        });

        const holidays = response.data;

        if (!Array.isArray(holidays)) {
            console.warn('Nager.Date API returned non-array:', holidays);
            return null;
        }
        const today = new Date().toISOString().split('T')[0];

        // Check if today is a holiday
        const isHoliday = holidays.some(h => h.date === today);

        // Find first upcoming holiday
        const upcoming = holidays.find(h => h.date > today);

        return {
            isHoliday,
            upcomingHoliday: upcoming ? `${upcoming.name} (${upcoming.date})` : null
        };

    } catch (error) {
        // 404 means no holidays found for country or invalid country
        console.error('Nager.Date Fetch Error:', error);
        return null;
    }
};
