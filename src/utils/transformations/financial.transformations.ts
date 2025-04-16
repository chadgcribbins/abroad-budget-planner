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