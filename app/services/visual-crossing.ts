import axios from 'axios';

export interface WeatherData {
    temperature: number;
    conditionCode: number; // Mapping VC icon/code to number if needed, or just keeping legacy
    isDay: boolean;
    conditionText: string;
}

const API_KEY = 'HRRH4UAAU8GX7HZF855WC43RP';
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
    try {
        // Visual Crossing accepts lat,lon as the location
        const url = `${BASE_URL}/${lat},${lon}`;

        const response = await axios.get(url, {
            params: {
                unitGroup: 'metric',
                key: API_KEY,
                include: 'current', // Only get current conditions to save bandwidth/processing
            },
            timeout: 5000, // Give it a bit more time than 2s just in case
        });

        const current = response.data?.currentConditions;
        if (!current) return null;

        // Visual Crossing returns 'icon' as string (e.g. 'partly-cloudy-day')
        // We can map this to a code if we strictly need numbers, but for now let's just use 0 as placeholder
        // or try to map roughly to WMO codes if the existing client expects it.
        // The existing orchestrator uses the text mostly.

        // Check if datetime is roughly within sunlight hours for isDay if strictly needed,
        // or check icon string for 'night'.
        const isDay = !current.icon?.includes('night');

        return {
            temperature: current.temp,
            conditionCode: 0, // Placeholder, as VC uses string icons
            isDay: isDay,
            conditionText: current.conditions || current.icon,
        };
    } catch (error) {
        console.error('Visual Crossing Fetch Error:', error);
        return null;
    }
};
