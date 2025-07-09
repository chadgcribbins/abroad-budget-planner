import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { openExchangeRatesService } from '@/src/services/openExchangeRates';

interface ExchangeRates {
  [key: string]: number; // e.g., { "EUR": 0.85, "GBP": 0.73 }
}

interface FXState {
  baseCurrency: string;
  exchangeRates: ExchangeRates;
  lastUpdated: string | null;
  isLoading: boolean;
  error: string | null;
  rateOverrides: ExchangeRates;
  
  // Actions
  setBaseCurrency: (currency: string) => void;
  updateExchangeRates: (rates: ExchangeRates) => void;
  fetchLatestRates: () => Promise<void>;
  setRateOverride: (from: string, to: string, rate: number) => void;
  clearRateOverride: (from: string, to: string) => void;
  getExchangeRate: (from: string, to: string) => number;
  convertAmount: (amount: number, from: string, to: string) => number;
}

export const useFXStore = create<FXState>()(
  persist(
    (set, get) => ({
      baseCurrency: 'USD',
      exchangeRates: {},
      lastUpdated: null,
      isLoading: false,
      error: null,
      rateOverrides: {},

      setBaseCurrency: (currency) => {
        set({ baseCurrency: currency });
      },

      updateExchangeRates: (rates) => {
        set({
          exchangeRates: rates,
          lastUpdated: new Date().toISOString(),
          error: null,
        });
      },

      fetchLatestRates: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await openExchangeRatesService.getRates(get().baseCurrency);
          set({
            exchangeRates: response.rates,
            lastUpdated: new Date().toISOString(),
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch rates',
          });
        }
      },

      setRateOverride: (from, to, rate) => {
        const key = `${from}-${to}`;
        set((state) => ({
          rateOverrides: {
            ...state.rateOverrides,
            [key]: rate,
          },
        }));
      },

      clearRateOverride: (from, to) => {
        const key = `${from}-${to}`;
        set((state) => {
          const { [key]: removed, ...rest } = state.rateOverrides;
          return { rateOverrides: rest };
        });
      },

      getExchangeRate: (from, to) => {
        const state = get();
        if (from === to) return 1;

        // Check for manual override first
        const overrideKey = `${from}-${to}`;
        if (state.rateOverrides[overrideKey]) {
          return state.rateOverrides[overrideKey];
        }
        
        // Direct conversion if available
        if (from === state.baseCurrency && state.exchangeRates[to]) {
          return state.exchangeRates[to];
        }
        
        // Inverse conversion
        if (to === state.baseCurrency && state.exchangeRates[from]) {
          return 1 / state.exchangeRates[from];
        }
        
        // Cross rate calculation
        if (state.exchangeRates[from] && state.exchangeRates[to]) {
          return state.exchangeRates[to] / state.exchangeRates[from];
        }
        
        return 1; // Fallback
      },

      convertAmount: (amount, from, to) => {
        const rate = get().getExchangeRate(from, to);
        return amount * rate;
      },
    }),
    {
      name: 'fx-storage',
    }
  )
);