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
        // If currency is already USD, or missing, we can return default logic or separate response
        // Or fetch USD to EUR/etc if needed?
        // User request: "User is in FR, expect payments in EUR, exchange rate is 0.94."
        // So we want USD -> LocalCurrency rate.
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
            console.warn('Frankfurter API returned unexpected structure:', response.data);
            return null;
        }

        const rate = response.data.rates[currencyCode];
        return {
            currencyCode,
            rateUsd: rate || null,
        };
    } catch (error) {
        console.warn('Frankfurter Fetch Error (likely invalid currency or timeout):', error);
        // Fallback: If currency code is valid but API failed, return null
        return null;
    }
};
