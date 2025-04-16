import { IncomeFrequency } from '../../types/income.types';

/**
 * Converts an amount to its equivalent monthly value based on its frequency.
 * @param amount The amount to convert.
 * @param frequency The frequency of the amount (Annual, Monthly, Quarterly, Yearly).
 * @returns The equivalent monthly amount.
 */
export const convertToMonthlyAmount = (
  amount: number,
  frequency: IncomeFrequency
): number => {
  switch (frequency) {
    case 'Annual':
    case 'Yearly': // Treat Yearly same as Annual
      return amount / 12;
    case 'Quarterly':
      return amount / 3;
    case 'Monthly':
      return amount;
    default:
      // Handle unexpected frequency type - maybe return 0 or throw error
      console.warn(`Unsupported frequency for monthly conversion: ${frequency}`);
      return 0;
  }
};

/**
 * Converts an amount to its equivalent annual value based on its frequency.
 * @param amount The amount to convert.
 * @param frequency The frequency of the amount (Annual, Monthly, Quarterly, Yearly).
 * @returns The equivalent annual amount.
 */
export const convertToAnnualAmount = (
    amount: number,
    frequency: IncomeFrequency
  ): number => {
    switch (frequency) {
      case 'Annual':
      case 'Yearly': // Treat Yearly same as Annual
        return amount;
      case 'Quarterly':
        return amount * 4;
      case 'Monthly':
        return amount * 12;
      default:
        // Handle unexpected frequency type
        console.warn(`Unsupported frequency for annual conversion: ${frequency}`);
        return 0;
    }
  }; 