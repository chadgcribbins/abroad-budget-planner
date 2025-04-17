'use client'; // Indicate this can run client-side if needed

/**
 * Formats a number as a currency string.
 * Uses Intl.NumberFormat for locale-aware formatting.
 * Defaults to USD if no currency code is provided.
 * Handles null/undefined/NaN inputs gracefully.
 *
 * @param value The number to format.
 * @param currencyCode Optional ISO 4217 currency code (e.g., 'USD', 'EUR', 'GBP').
 * @returns A formatted currency string (e.g., '$1,234.56') or an empty string for invalid input.
 */
export function formatCurrency(
  value: number | null | undefined | '',
  currencyCode: string | null | undefined = 'USD' // Default to USD
): string {
  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    // Handle non-numeric input, maybe return a placeholder or empty string
    return ''; // Or perhaps 'N/A', '$0.00'? Returning empty for now.
  }

  const validCurrencyCode = currencyCode && currencyCode.length === 3 ? currencyCode : 'USD';

  try {
    // Use Intl.NumberFormat for proper formatting
    return new Intl.NumberFormat(undefined, { // Use user's default locale
      style: 'currency',
      currency: validCurrencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch (error) {
    console.error(`Error formatting currency (code: ${currencyCode}):`, error);
    // Fallback for invalid currency code or other errors
    return `${validCurrencyCode === 'USD' ? '$' : validCurrencyCode + ' '}${numericValue.toFixed(2)}`;
  }
} 