// Placeholder for financial concept calculations like "Felt Cost"

/**
 * Calculates the "felt cost" of an expense, meaning the gross income 
 * required to cover that expense after considering taxes.
 * This helps understand the true earning requirement for a specific spending item.
 * @param expenseAmount The net amount of the expense (post-tax spending).
 * @param effectiveTaxRatePercent The estimated overall tax rate affecting the income used to pay this expense (e.g., 20 for 20%).
 * @returns The estimated gross income needed to cover the expense.
 */
export const calculateFeltCost = (
  expenseAmount: number,
  effectiveTaxRatePercent: number
): number => {
  // This uses the same logic as calculateRequiredMonthlyGrossIncome but applied to a single expense amount.
  // TODO: Refine this with more sophisticated tax logic later, potentially considering marginal rates.
  console.warn('calculateFeltCost uses simplified tax logic.');
  
  if (expenseAmount <= 0) {
    return 0;
  }

  if (effectiveTaxRatePercent < 0 || effectiveTaxRatePercent >= 100) {
    // Invalid tax rate, assume 0% tax for calculation.
    return expenseAmount;
  }
  if (effectiveTaxRatePercent === 0) {
      return expenseAmount;
  }
  // Gross = Net / (1 - TaxRate)
  return expenseAmount / (1 - effectiveTaxRatePercent / 100);
}; 

/**
 * Formats a number or an empty string for display in an input field, adding commas.
 * Handles potentially empty strings or null/undefined values gracefully.
 * @param value The number or string to format.
 * @returns A formatted string (e.g., "1,234.56") or an empty string.
 */
export const formatNumberInput = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const num = Number(value);
  if (isNaN(num)) {
    return ''; // Handle cases where conversion to number fails
  }
  // Use Intl.NumberFormat for locale-aware formatting
  return new Intl.NumberFormat().format(num);
};

/**
 * Parses a formatted number string (e.g., "1,234.56") back into a number.
 * Removes commas before parsing.
 * @param value The formatted string.
 * @returns The parsed number, or NaN if parsing fails.
 */
export const parseFormattedNumber = (value: string): number => {
  if (value === null || value === undefined || typeof value !== 'string') {
    return NaN;
  }
  const cleanedValue = value.replace(/,/g, '');
  if (cleanedValue === '') {
    return NaN; // Or potentially 0, depending on desired behavior for empty input
  }
  return Number(cleanedValue);
}; 