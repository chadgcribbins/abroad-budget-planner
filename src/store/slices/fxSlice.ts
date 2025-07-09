import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ExchangeRates {
  [key: string]: number; // e.g., { "EUR": 0.85, "GBP": 0.73 }
}

interface FXState {
  baseCurrency: string;
  exchangeRates: ExchangeRates;
  lastUpdated: string | null;
  
  // Actions
  setBaseCurrency: (currency: string) => void;
  updateExchangeRates: (rates: ExchangeRates) => void;
  getExchangeRate: (from: string, to: string) => number;
  convertAmount: (amount: number, from: string, to: string) => number;
}

export const useFXStore = create<FXState>()(
  persist(
    (set, get) => ({
      baseCurrency: 'USD',
      exchangeRates: {},
      lastUpdated: null,

      setBaseCurrency: (currency) => {
        set({ baseCurrency: currency });
      },

      updateExchangeRates: (rates) => {
        set({
          exchangeRates: rates,
          lastUpdated: new Date().toISOString(),
        });
      },

      getExchangeRate: (from, to) => {
        const state = get();
        if (from === to) return 1;
        
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