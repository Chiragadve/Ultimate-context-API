import axios from 'axios';

export interface HolidayContext {
    is_holiday: boolean;
    holiday_name: string | null;
}

export async function fetchHolidays(countryCode: string): Promise<HolidayContext> {
    try {
        const year = new Date().getFullYear();
        const response = await axios.get(`https://date.nager.at/api/v3/publicholidays/${year}/${countryCode}`, {
            timeout: 1500
        });

        const holidays = response.data;
        const today = new Date().toISOString().split('T')[0];
        const match = holidays.find((h: any) => h.date === today);

        return {
            is_holiday: !!match,
            holiday_name: match ? match.name : null
        };
    } catch (error) {
        // Nager is often flaky, return default
        return { is_holiday: false, holiday_name: null };
    }
}
