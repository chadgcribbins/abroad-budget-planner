import { LRUCache } from 'lru-cache';

const API_KEY = process.env.CURRENCY_API_KEY;
const BASE_URL = 'https://api.currencyapi.com/v3';

// Define the structure of the API response data
interface CurrencyApiResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currencyCode: string]: {
      code: string;
      value: number;
    };
  };
}

// Define the structure for our cached rates
interface ExchangeRates {
  [currencyCode: string]: number;
}

// Configure LRU Cache
const cache = new LRUCache<string, ExchangeRates>({
  max: 10, // Cache up to 10 base currencies
  ttl: 1000 * 60 * 60 * 4, // Cache for 4 hours
});

// Fallback rates in case API fails
const fallbackRates: ExchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.51,
  // Add more common currencies as needed
};

/**
 * Fetches exchange rates for a given base currency.
 * Uses caching to minimize API calls.
 * Returns fallback rates if API call fails.
 * @param baseCurrency The base currency code (e.g., 'USD'). Defaults to 'USD'.
 * @returns An object containing currency codes and their rates relative to the base currency.
 */
export const getExchangeRates = async (
  baseCurrency: string = 'USD'
): Promise<ExchangeRates> => {
  if (!API_KEY) {
    console.warn(
      'CURRENCY_API_KEY not found. Returning fallback exchange rates.'
    );
    return fallbackRates;
  }

  const cacheKey = `rates_${baseCurrency}`;
  const cachedRates = cache.get(cacheKey);

  if (cachedRates) {
    console.log(`Returning cached rates for ${baseCurrency}`);
    return cachedRates;
  }

  console.log(`Fetching fresh rates for ${baseCurrency} from CurrencyAPI...`);
  try {
    const response = await fetch(
      `${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}`
    );

    if (!response.ok) {
      throw new Error(
        `CurrencyAPI request failed with status ${response.status}`
      );
    }

    const data: CurrencyApiResponse = await response.json();

    const rates: ExchangeRates = {};
    for (const code in data.data) {
      rates[code] = data.data[code].value;
    }

    if (Object.keys(rates).length > 0) {
        cache.set(cacheKey, rates);
        return rates;
    } else {
        console.warn('Received empty rates data from CurrencyAPI. Returning fallback rates.');
        return fallbackRates;
    }

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    console.warn('Returning fallback exchange rates due to API error.');
    return fallbackRates;
  }
}; 