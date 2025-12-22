import axios from 'axios';

const API_KEY = process.env.VISUAL_CROSSING_API_KEY || 'HRRH4UAAU8GX7HZF855WC43RP';

export interface WeatherData {
    temperature: number;
    conditionCode: number; // Mapped code for compatibility
    isDay: boolean; // Not directly provided, inferred
    conditionText: string;
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
    try {
        const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${API_KEY}&contentType=json&include=current`;

        const response = await axios.get(url, { timeout: 2000 });
        const current = response.data.currentConditions;

        // Map condition text to a simple code (0-99) for compatibility
        // Map condition text to a simple code (0-99) for compatibility
        // This is a simplified mapping
        let code = 0;
        const cond = current.conditions.toLowerCase();

        if (cond.includes('rain')) code = 61;
        else if (cond.includes('cloud')) code = 3;
        else if (cond.includes('clear')) code = 0;
        else if (cond.includes('snow')) code = 71;

        // Visual Crossing doesn't give explicit isDay in currentConditions, 
        // but we can infer or default to true for now or use sunrise/sunset from daily data if needed.
        // For speed, defaulting to true or checking hour.
        const hour = new Date(current.datetimeEpoch * 1000).getHours();
        const isDay = hour > 6 && hour < 20;

        return {
            temperature: current.temp,
            conditionCode: code,
            isDay: isDay,
            conditionText: current.conditions
        };
    } catch (error: any) {
        console.error('[VisualCrossing] Error fetching weather:', error.message);
        return null;
    }
}
