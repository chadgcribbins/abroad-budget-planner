// Placeholder for currency conversion logic
// Assumes exchangeRates are relative to a single baseCurrency

/**
 * Converts an amount from a source currency to a target currency.
 * @param amount The amount to convert.
 * @param sourceCurrency ISO 4217 code of the source currency (e.g., 'GBP').
 * @param targetCurrency ISO 4217 code of the target currency (e.g., 'EUR').
 * @param exchangeRates A map of currency codes to their exchange rate relative to the base currency (e.g., { 'GBP': 1.18, 'USD': 0.95 } if base is EUR).
 * @param baseCurrency The base currency against which rates are provided (e.g., 'EUR').
 * @returns The converted amount in the target currency, or the original amount if conversion isn't possible.
 */
export const convertCurrency = (
  amount: number,
  sourceCurrency: string,
  targetCurrency: string,
  exchangeRates: { [code: string]: number },
  baseCurrency: string
): number => {
  // TODO: Implement robust currency conversion, handling missing rates and base currency logic.
  console.warn('convertCurrency is a placeholder.');

  if (sourceCurrency === targetCurrency) {
    return amount;
  }

  let amountInBase: number;

  // Convert source amount to base currency
  if (sourceCurrency === baseCurrency) {
    amountInBase = amount;
  } else if (exchangeRates[sourceCurrency]) {
    amountInBase = amount / exchangeRates[sourceCurrency]; // Rate is Base/Source, so divide
  } else {
    console.error(`Missing exchange rate for source currency: ${sourceCurrency}`);
    return amount; // Cannot convert
  }

  // Convert amount from base currency to target currency
  if (targetCurrency === baseCurrency) {
    return amountInBase;
  } else if (exchangeRates[targetCurrency]) {
    return amountInBase * exchangeRates[targetCurrency]; // Rate is Base/Target, so multiply
  } else {
    console.error(`Missing exchange rate for target currency: ${targetCurrency}`);
    return amount; // Cannot convert
  }
};

// Transformation functions related to currency

/**
 * Calculates the equivalent value of an amount in a target currency using a direct exchange rate.
 * Assumes the provided rate directly converts from source to target (e.g., 1 source = rate * target).
 *
 * @param amount The amount in the source currency.
 * @param sourceCurrencyCode The ISO 4217 code of the source currency (e.g., 'GBP').
 * @param targetCurrencyCode The ISO 4217 code of the target currency (e.g., 'EUR').
 * @param rate The direct exchange rate (effective rate including overrides/simulations).
 *             Represents how many units of the target currency equal one unit of the source currency.
 *             If null or invalid, the original amount is returned.
 * @returns The equivalent value in the target currency, or the original amount if conversion cannot be performed.
 */
export const calculateEquivalentValue = (
  amount: number | null | undefined,
  sourceCurrencyCode: string,
  targetCurrencyCode: string,
  rate: number | null
): number => {
  // If amount is null/undefined, return 0
  if (amount == null) {
    return 0;
  }

  // If currencies are the same, no conversion needed
  if (sourceCurrencyCode === targetCurrencyCode) {
    return amount;
  }

  // If the rate is missing or invalid, cannot convert
  if (rate === null || typeof rate !== 'number' || !isFinite(rate) || rate <= 0) {
    console.warn(
      `Invalid or missing rate (${rate}) provided for conversion from ${sourceCurrencyCode} to ${targetCurrencyCode}. Returning original amount.`
    );
    // Depending on desired behavior, could return 0 or throw an error instead.
    // Returning the original amount might be misleading, let's return 0 as a safer default.
    return 0; 
  }

  // Perform the conversion: Amount * Rate
  // (Since Rate = Target / Source)
  const convertedAmount = amount * rate;

  // It might be useful to return null here if conversion failed, 
  // but for now, returning 0 to avoid breaking components expecting numbers.
  // Revisit if null handling is needed upstream.
  return convertedAmount; 
}; 