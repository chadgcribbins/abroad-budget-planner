// OpenExchangeRates API Service
// Handles fetching and caching of exchange rates

interface OpenExchangeRatesResponse {
  disclaimer: string;
  license: string;
  timestamp: number;
  base: string;
  rates: Record<string, number>;
}

interface CachedRates {
  data: OpenExchangeRatesResponse;
  cachedAt: number;
}

// Fallback rates for offline mode or API failures
const FALLBACK_RATES: Record<string, number> = {
  EUR: 0.92,
  GBP: 0.79,
  USD: 1.0,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 149.50,
  CHF: 0.88,
  SEK: 10.89,
  NOK: 10.68,
  DKK: 6.88,
  PLN: 4.01,
  CZK: 23.25,
  HUF: 355.00,
  RON: 4.58,
  BGN: 1.80,
  HRK: 6.94,
  RUB: 92.50,
  TRY: 32.10,
  BRL: 4.98,
  CNY: 7.24,
  IDR: 15750,
  INR: 83.20,
  KRW: 1330,
  MXN: 17.15,
  MYR: 4.72,
  NZD: 1.63,
  PHP: 56.50,
  SGD: 1.34,
  THB: 35.70,
  ZAR: 18.95,
};

class OpenExchangeRatesService {
  private apiKey: string;
  private baseUrl = 'https://openexchangerates.org/api';
  private cache: CachedRates | null = null;
  private cacheTimeout = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENEXCHANGERATES_API_KEY || 'demo-api-key';
  }

  /**
   * Check if the cached data is still valid
   */
  private isCacheValid(): boolean {
    if (!this.cache) return false;
    const now = Date.now();
    return now - this.cache.cachedAt < this.cacheTimeout;
  }

  /**
   * Get exchange rates from cache if valid, otherwise fetch fresh data
   */
  async getRates(base: string = 'USD'): Promise<OpenExchangeRatesResponse> {
    // Return cached data if still valid
    if (this.isCacheValid() && this.cache) {
      return this.cache.data;
    }

    try {
      // Fetch fresh rates from API
      const response = await this.fetchRates(base);
      
      // Update cache
      this.cache = {
        data: response,
        cachedAt: Date.now(),
      };

      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('fx-rates-cache', JSON.stringify(this.cache));
      }

      return response;
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      
      // Try to load from localStorage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('fx-rates-cache');
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as CachedRates;
            this.cache = parsed;
            console.log('Using cached rates from localStorage');
            return parsed.data;
          } catch (e) {
            console.error('Failed to parse cached rates:', e);
          }
        }
      }

      // Return fallback rates as last resort
      console.log('Using fallback exchange rates');
      return this.createFallbackResponse(base);
    }
  }

  /**
   * Fetch rates from OpenExchangeRates API
   */
  private async fetchRates(base: string): Promise<OpenExchangeRatesResponse> {
    const url = `${this.baseUrl}/latest.json?app_id=${this.apiKey}&base=${base}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as OpenExchangeRatesResponse;
  }

  /**
   * Create a fallback response using hardcoded rates
   */
  private createFallbackResponse(base: string): OpenExchangeRatesResponse {
    // Convert fallback rates to the requested base currency
    let rates = { ...FALLBACK_RATES };
    
    if (base !== 'USD') {
      const baseRate = FALLBACK_RATES[base] || 1;
      rates = Object.entries(FALLBACK_RATES).reduce((acc, [currency, rate]) => {
        acc[currency] = rate / baseRate;
        return acc;
      }, {} as Record<string, number>);
    }

    return {
      disclaimer: 'Using fallback rates - API unavailable',
      license: 'Fallback data',
      timestamp: Math.floor(Date.now() / 1000),
      base,
      rates,
    };
  }

  /**
   * Convert an amount from one currency to another
   */
  async convert(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount;

    const rates = await this.getRates('USD');
    
    // Get rates relative to USD
    const fromRate = from === 'USD' ? 1 : (rates.rates[from] || 1);
    const toRate = to === 'USD' ? 1 : (rates.rates[to] || 1);
    
    // Convert through USD
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;
    
    return convertedAmount;
  }

  /**
   * Get a specific exchange rate
   */
  async getRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;

    const rates = await this.getRates('USD');
    
    const fromRate = from === 'USD' ? 1 : (rates.rates[from] || 1);
    const toRate = to === 'USD' ? 1 : (rates.rates[to] || 1);
    
    return toRate / fromRate;
  }

  /**
   * Clear the cache to force fresh API call
   */
  clearCache(): void {
    this.cache = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fx-rates-cache');
    }
  }

  /**
   * Get supported currencies
   */
  getSupportedCurrencies(): string[] {
    return Object.keys(FALLBACK_RATES);
  }
}

// Export singleton instance
export const openExchangeRatesService = new OpenExchangeRatesService();

// Export types
export type { OpenExchangeRatesResponse, CachedRates };