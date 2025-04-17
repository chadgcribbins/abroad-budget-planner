'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';
import { getExchangeRate } from '../services/fxService';

// Helper to get currency code from country code (simplified)
// TODO: Replace with a more robust library or data source
const getCurrencyCodeForCountry = (countryCode: string | null): string => {
  if (!countryCode) return 'USD'; // Default fallback
  const codeMap: { [key: string]: string } = {
    GB: 'GBP',
    PT: 'EUR',
    US: 'USD',
    ES: 'EUR',
    FR: 'EUR',
    IT: 'EUR',
    // Add more mappings as needed
  };
  return codeMap[countryCode.toUpperCase()] || 'USD';
};

interface CurrencyContextType {
  isLoading: boolean;
  error: Error | null;
  originCurrency: string;
  targetCurrency: string;
  fetchedRate: number | null;
  manualRate: number | string;
  isManualOverrideEnabled: boolean;
  fxSimulationPercentage: number;
  effectiveRate: number | null;
  setOriginCountry: (countryCode: string | null) => void;
  setDestinationCountry: (countryCode: string | null) => void;
  setManualRate: (rate: string) => void;
  setIsManualOverrideEnabled: (enabled: boolean) => void;
  setFxSimulationPercentage: (percentage: number) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

interface CurrencyProviderProps {
  children: ReactNode;
  initialOriginCountry?: string | null;
  initialDestinationCountry?: string | null;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ 
    children, 
    initialOriginCountry = null, 
    initialDestinationCountry = null
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [originCountry, setOriginCountryState] = useState<string | null>(initialOriginCountry);
  const [destinationCountry, setDestinationCountryState] = useState<string | null>(initialDestinationCountry);

  const originCurrency = useMemo(() => getCurrencyCodeForCountry(originCountry), [originCountry]);
  const targetCurrency = useMemo(() => getCurrencyCodeForCountry(destinationCountry), [destinationCountry]);

  const [fetchedRate, setFetchedRate] = useState<number | null>(null);
  const [manualRate, setManualRateState] = useState<number | string>('');
  const [isManualOverrideEnabled, setIsManualOverrideEnabledState] = useState(false);
  const [fxSimulationPercentage, setFxSimulationPercentageState] = useState<number>(0);

  useEffect(() => {
    console.log('[FX Context] useEffect triggered. Origin:', originCurrency, 'Target:', targetCurrency);
    setFetchedRate(null);
    setError(null);
    setManualRateState('');

    if (originCurrency && targetCurrency && originCurrency !== targetCurrency) {
      console.log('[FX Context] Currencies are valid and different. Fetching rate...');
      setIsLoading(true);
      
      // Add logs around the API call
      console.log(`[FX Context] Calling getExchangeRate(${originCurrency}, ${targetCurrency})`);
      getExchangeRate(originCurrency, targetCurrency)
        .then(rate => {
          console.log('[FX Context] getExchangeRate responded with rate:', rate);
          if (rate !== null) {
            console.log('[FX Context] Setting fetchedRate:', rate);
            setFetchedRate(rate);
            if (!isManualOverrideEnabled) {
              const formattedRate = rate.toFixed(4);
              console.log('[FX Context] Setting manualRate (as override disabled):', formattedRate);
              setManualRateState(formattedRate); 
            }
          } else {
            const errorMsg = `Failed to fetch rate for ${originCurrency} to ${targetCurrency}`;
            console.error('[FX Context] getExchangeRate returned null. Error:', errorMsg);
            setError(new Error(errorMsg));
          }
        })
        .catch(err => {
           console.error('[FX Context] getExchangeRate caught an error:', err);
           setError(err instanceof Error ? err : new Error('Unknown error fetching exchange rate'));
        })
        .finally(() => {
           console.log('[FX Context] Fetch process finished. Setting isLoading to false.');
           setIsLoading(false);
        });
    } else if (originCurrency && targetCurrency && originCurrency === targetCurrency) {
      console.log('[FX Context] Currencies are the same. Setting rate to 1.');
      setFetchedRate(1);
      setManualRateState('1.0000');
      setIsLoading(false);
    } else {
       console.log('[FX Context] Currencies not ready or invalid. Not fetching.');
       setIsLoading(false);
    }
  }, [originCurrency, targetCurrency, isManualOverrideEnabled]);

  const effectiveRate = useMemo(() => {
    const baseRateForCalc = isManualOverrideEnabled ? Number(manualRate) : fetchedRate;
    if (baseRateForCalc === null || isNaN(baseRateForCalc)) {
      return null;
    }
    const simPercentage = Number.isFinite(fxSimulationPercentage) ? fxSimulationPercentage : 0;
    return baseRateForCalc * (1 + simPercentage / 100);
  }, [fetchedRate, manualRate, isManualOverrideEnabled, fxSimulationPercentage]);

  const setOriginCountry = useCallback((countryCode: string | null) => {
    setOriginCountryState(countryCode);
  }, []);

  const setDestinationCountry = useCallback((countryCode: string | null) => {
    setDestinationCountryState(countryCode);
  }, []);
  
  const setManualRate = useCallback((rate: string) => {
    setManualRateState(rate);
  }, []);

  const setIsManualOverrideEnabled = useCallback((enabled: boolean) => {
    setIsManualOverrideEnabledState(enabled);
    if (!enabled && fetchedRate !== null) {
      setManualRateState(fetchedRate.toFixed(4));
    }
  }, [fetchedRate]);

  const setFxSimulationPercentage = useCallback((percentage: number) => {
    setFxSimulationPercentageState(percentage);
  }, []);

  const contextValue = useMemo(() => ({
    isLoading,
    error,
    originCurrency,
    targetCurrency,
    fetchedRate,
    manualRate,
    isManualOverrideEnabled,
    fxSimulationPercentage,
    effectiveRate,
    setOriginCountry,
    setDestinationCountry,
    setManualRate,
    setIsManualOverrideEnabled,
    setFxSimulationPercentage,
  }), [
    isLoading, error, originCurrency, targetCurrency, fetchedRate, manualRate, 
    isManualOverrideEnabled, fxSimulationPercentage, effectiveRate,
    setOriginCountry, setDestinationCountry, setManualRate, 
    setIsManualOverrideEnabled, setFxSimulationPercentage
  ]);

  return (
    <CurrencyContext.Provider value={contextValue}>
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