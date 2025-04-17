/**
 * Fetches the latest exchange rate between two currencies.
 * 
 * @param baseCurrency The base currency code (e.g., 'GBP').
 * @param targetCurrency The target currency code (e.g., 'EUR').
 * @returns The exchange rate, or null if an error occurs.
 */
// TODO: Replace CurrencyAPI with a reliable free tier FX service.
// Consider exchangerate.host (potential base currency limitations) or other alternatives.
// ************ HUGE TODO: REPLACE THIS HARDCODED STUB WITH A REAL API ************
// This function currently returns fixed placeholder rates for testing.
// We need to integrate a reliable exchange rate API (e.g., OpenExchangeRates,
// exchangeratesapi.io, etc.) to get live data. See web search history and PRD.
// The current placeholder rates (approx. Apr 2025) are:
// GBP/EUR: 1.16, EUR/GBP: 0.86
// GBP/USD: 1.32, USD/GBP: 0.76
// EUR/USD: 1.14, USD/EUR: 0.88
// *******************************************************************************
// Implementation uses Open Exchange Rates API (https://openexchangerates.org/)
// Requires NEXT_PUBLIC_OPENEXCHANGERATES_APP_ID in .env file.
// *******************************************************************************
export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number | null> {
  // Open Exchange Rates Free plan requires USD as the base currency.
  // If the desired base isn't USD, we need to fetch rates relative to USD
  // and calculate the desired rate indirectly (e.g., GBP to EUR = (USD to EUR) / (USD to GBP))
  const baseIsUSD = baseCurrency === 'USD';
  const targetIsUSD = targetCurrency === 'USD';

  // If base and target are the same, rate is 1
  if (baseCurrency === targetCurrency) {
    return 1.0;
  }

  const appId = process.env.NEXT_PUBLIC_OPENEXCHANGERATES_APP_ID;

  if (!appId) {
    console.error("Open Exchange Rates App ID (NEXT_PUBLIC_OPENEXCHANGERATES_APP_ID) is not set in environment variables.");
    return null; // Cannot proceed without App ID
  }

  const apiUrl = `https://openexchangerates.org/api/latest.json?app_id=${appId}`;

  console.log(`Fetching latest rates from Open Exchange Rates (Base: USD)...`);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {
        // Ignore error if body cannot be read
      }
      throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}, body: ${errorBody}`);
    }

    const data = await response.json();
    
    if (!data || !data.rates) {
        console.error("Invalid response structure from Open Exchange Rates API.", data);
        return null;
    }

    const rates = data.rates; // Rates are relative to USD

    // Direct fetch if base is USD
    if (baseIsUSD) {
        const rate = rates[targetCurrency];
        if (typeof rate === 'number') {
            console.log(`Successfully fetched rate USD to ${targetCurrency}: ${rate}`);
            return rate;
        } else {
            console.error(`Target currency ${targetCurrency} not found in OXR rates.`);
            return null;
        }
    }
    
    // Direct fetch if target is USD (inverse of USD to base)
    if (targetIsUSD) {
        const rateUSDToBase = rates[baseCurrency];
        if (typeof rateUSDToBase === 'number' && rateUSDToBase !== 0) {
             const rateBaseToUSD = 1 / rateUSDToBase;
             console.log(`Successfully calculated rate ${baseCurrency} to USD: ${rateBaseToUSD}`);
             return rateBaseToUSD;
        } else {
            console.error(`Base currency ${baseCurrency} not found in OXR rates or was zero.`);
            return null;
        }
    }

    // Indirect calculation: (USD to Target) / (USD to Base)
    const rateUSDToTarget = rates[targetCurrency];
    const rateUSDToBase = rates[baseCurrency];

    if (typeof rateUSDToTarget === 'number' && typeof rateUSDToBase === 'number' && rateUSDToBase !== 0) {
        const calculatedRate = rateUSDToTarget / rateUSDToBase;
        console.log(`Successfully calculated rate ${baseCurrency} to ${targetCurrency}: ${calculatedRate}`);
        return calculatedRate;
    } else {
      console.error(`Could not find rates for ${baseCurrency} or ${targetCurrency} in OXR response, or base rate was zero.`);
      return null;
    }

  } catch (error) {
    console.error("Failed to fetch or parse exchange rate from Open Exchange Rates API:", error);
    return null;
  }
} 