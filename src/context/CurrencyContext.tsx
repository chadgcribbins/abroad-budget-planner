'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { getExchangeRates } from '../utils/currencyApi';

interface ExchangeRates {
  [currencyCode: string]: number;
}

interface CurrencyContextType {
  rates: ExchangeRates | null;
  isLoading: boolean;
  error: Error | null;
  baseCurrency: string;
  setBaseCurrency: (currency: string) => void;
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
  initialBaseCurrency?: string;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ 
    children, 
    initialBaseCurrency = 'USD' 
}) => {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [baseCurrency, setBaseCurrencyState] = useState<string>(initialBaseCurrency);

  useEffect(() => {
    const fetchRates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedRates = await getExchangeRates(baseCurrency);
        setRates(fetchedRates);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch exchange rates'));
        setRates(null); // Clear rates on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, [baseCurrency]);

  const setBaseCurrency = (currency: string) => {
    setBaseCurrencyState(currency);
    // Rates will refetch due to useEffect dependency
  };

  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number | null => {
    if (!rates) return null;

    // Assuming rates are relative to baseCurrency
    const rateFrom = rates[fromCurrency];
    const rateTo = rates[toCurrency];

    if (rateFrom === undefined || rateTo === undefined) {
        console.warn(`Cannot convert: Missing rate for ${fromCurrency} or ${toCurrency}`);
        return null; // Or handle missing rates differently
    }

    // Convert amount to base currency first, then to target currency
    const amountInBase = amount / rateFrom;
    const amountInTarget = amountInBase * rateTo;

    return amountInTarget;
  };

  return (
    <CurrencyContext.Provider value={{ 
        rates, 
        isLoading, 
        error, 
        baseCurrency, 
        setBaseCurrency,
        convertCurrency 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}; 