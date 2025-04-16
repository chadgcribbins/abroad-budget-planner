import { EmergencyBuffer } from '@/types/emergency.types';

// --- PLACEHOLDERS / Basic Calculations ---

export const calculateMonthlyDisposableIncome = (monthlyNetIncome: number, monthlyExpenses: number): number => {
  return monthlyNetIncome - monthlyExpenses;
};

export const calculateAnnualDisposableIncome = (annualNetIncome: number, annualExpenses: number): number => {
    return annualNetIncome - annualExpenses;
};

/**
 * Calculates the estimated gross monthly income needed to cover expenses after tax.
 * This is a simplified calculation assuming a flat effective tax rate.
 * Real-world calculations involve tax brackets, deductions, credits, etc.
 * @param monthlyExpenses The total monthly expenses to cover.
 * @param effectiveTaxRatePercent The estimated overall tax rate (e.g., 20 for 20%).
 * @returns Estimated gross monthly income required.
 */
export const calculateRequiredMonthlyGrossIncome = (monthlyExpenses: number, effectiveTaxRatePercent: number): number => {
  // TODO: Refine this with more sophisticated tax logic later.
  // Consider edge cases like 0% tax rate or different tax treatments for income types.
  console.warn('calculateRequiredMonthlyGrossIncome is a simplified placeholder.');
  if (effectiveTaxRatePercent < 0 || effectiveTaxRatePercent >= 100) {
      // If tax rate is invalid, assume 0% tax for calculation purposes.
      // Or potentially return an error/NaN if that's more appropriate.
      return monthlyExpenses;
  }
  if (effectiveTaxRatePercent === 0) {
      return monthlyExpenses;
  }
  // Gross = Net / (1 - TaxRate)
  return monthlyExpenses / (1 - effectiveTaxRatePercent / 100);
};

/**
 * Calculates how many months the current emergency reserve can cover monthly expenses.
 * @param currentReserve The total amount saved in the emergency buffer.
 * @param monthlyExpenses The calculated total essential monthly expenses.
 * @returns The number of months the buffer covers, or Infinity if expenses are zero.
 */
export const calculateEmergencyBufferRunwayMonths = (currentReserve: number, monthlyExpenses: number): number => {
  if (monthlyExpenses <= 0) {
    return Infinity; // Cannot divide by zero or negative expenses; buffer lasts indefinitely.
  }
  return currentReserve / monthlyExpenses;
};

// Interface for the derived summary data
export interface BudgetSummary {
    totalMonthlyExpenses: number;
    totalAnnualExpenses: number;
    totalMonthlyNetIncome: number;
    totalAnnualNetIncome: number;
    monthlyDisposableIncome: number;
    annualDisposableIncome: number;
    requiredMonthlyGrossIncomeEst?: number; // Estimated based on simplified tax
    emergencyBufferRunwayMonths?: number; // Calculated runway
    // Add more derived metrics as needed, e.g., category breakdowns (housing%, transport% etc.)
    // expenseBreakdown?: { [category: string]: number };
    // netIncomeSources?: { [source: string]: number };
} 