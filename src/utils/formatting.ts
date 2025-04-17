/**
 * Formats a monetary amount into the dual currency display format.
 * Example: formatDualCurrency(1180, 'EUR', 'GBP', 1.18) => "€1,180.00 / £1,000.00"
 *
 * @param amountInDestinationCurrency The amount in the primary (destination) currency.
 * @param destinationCurrencyCode The ISO code for the destination currency (e.g., 'EUR').
 * @param originCurrencyCode The ISO code for the origin currency (e.g., 'GBP').
 * @param destinationPerOriginRate The exchange rate (how many destination units per 1 origin unit, e.g., 1.18 for EUR/GBP).
 * @param destinationOptions Intl.NumberFormat options for the destination currency.
 * @param originOptions Intl.NumberFormat options for the origin currency.
 * @returns An object containing formatted destination and origin strings, or placeholder strings on error.
 */
export function formatDualCurrency(
  amountInDestinationCurrency: number | null | undefined,
  destinationCurrencyCode: string,
  originCurrencyCode: string,
  destinationPerOriginRate: number | null | undefined,
  destinationOptions: Intl.NumberFormatOptions = { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  originOptions: Intl.NumberFormatOptions = { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 }
): { destination: string; origin: string } {

  const errorResult = { destination: 'N/A', origin: 'N/A' };
  const invalidCodesResult = { destination: 'Invalid Codes', origin: 'Invalid Codes' };

  if (amountInDestinationCurrency === null || amountInDestinationCurrency === undefined || isNaN(amountInDestinationCurrency)) {
    return errorResult;
  }

  if (!destinationCurrencyCode || !originCurrencyCode) {
    return invalidCodesResult;
  }

  let formattedDestination: string;
  try {
    formattedDestination = new Intl.NumberFormat(undefined, {
      ...destinationOptions,
      currency: destinationCurrencyCode,
      currencyDisplay: 'symbol' // Use symbol like € or £
    }).format(amountInDestinationCurrency);
  } catch (error) {
    console.error(`Error formatting destination currency ${destinationCurrencyCode}:`, error);
    return { destination: `Error (${destinationCurrencyCode})`, origin: '---' };
  }

  // Calculate the equivalent amount in the origin currency
  let formattedOrigin = '---';
  if (destinationPerOriginRate !== null && destinationPerOriginRate !== undefined && destinationPerOriginRate !== 0) {
    try {
      const amountInOriginCurrency = amountInDestinationCurrency / destinationPerOriginRate;
      formattedOrigin = new Intl.NumberFormat(undefined, {
        ...originOptions,
        currency: originCurrencyCode,
        currencyDisplay: 'symbol'
      }).format(amountInOriginCurrency);
    } catch (error) {
      console.error(`Error formatting origin currency ${originCurrencyCode}:`, error);
      formattedOrigin = `Error (${originCurrencyCode})`;
    }
  } else {
    console.warn(`Cannot calculate origin currency value: Invalid rate (${destinationPerOriginRate}) for ${originCurrencyCode}/${destinationCurrencyCode}`);
    formattedOrigin = '(Rate N/A)'; // Indicate rate issue
  }

  return { destination: formattedDestination, origin: formattedOrigin };
}

/**
 * Formats a single currency amount using Intl.NumberFormat.
 *
 * @param amount The numeric amount.
 * @param currencyCode The ISO currency code.
 * @param options Formatting options.
 * @returns Formatted string or 'N/A'.
 */
export function formatSingleCurrency(
    amount: number | null | undefined,
    currencyCode: string,
    options: Intl.NumberFormatOptions = { style: 'currency', minimumFractionDigits: 2, maximumFractionDigits: 2 }
): string {
     if (amount === null || amount === undefined || isNaN(amount) || !currencyCode) {
        return 'N/A';
    }
     try {
        return new Intl.NumberFormat(undefined, { 
            ...options,
            currency: currencyCode,
            currencyDisplay: 'symbol' 
        }).format(amount);
    } catch (error) {
        console.error(`Error formatting currency ${currencyCode}:`, error);
        return `Error (${currencyCode})`;
    }
} 