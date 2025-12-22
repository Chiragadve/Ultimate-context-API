
import axios from 'axios';

export interface CurrencyData {
    amount: number;
    base: string;
    date: string;
    rates: Record<string, number>;
}

export interface MarketContext {
    currencyCode: string;
    rateUsd: number | null;
}

const FRANKFURTER_URL = 'https://api.frankfurter.app/latest';

export const fetchCurrency = async (currencyCode: string): Promise<MarketContext | null> => {
    if (!currencyCode || currencyCode === 'USD') {
        if (currencyCode === 'USD') {
            return { currencyCode: 'USD', rateUsd: 1.0 };
        }
    }

    try {
        // API: ?from=USD&to=EUR
        const response = await axios.get<CurrencyData>(FRANKFURTER_URL, {
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
    } catch (error) {
        // Frankfurter might 404 for unsupported currencies (like PKR sometimes if not in ECB list)
        // We will return null and handle fallback or just return code without rate
        return null;
    }
};
