import { Housing, MortgageDetails } from '@/types/housing.types';

/**
 * Calculates the estimated monthly mortgage payment using the standard formula.
 * M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
 * Where:
 * P = Principal loan amount (Property Price - Down Payment)
 * i = Monthly interest rate (Annual Rate / 12 / 100)
 * n = Total number of payments (Term in years * 12)
 */
export const calculateMonthlyMortgagePayment = (details: MortgageDetails): number => {
  const { propertyPrice, downPaymentAmount = 0, downPaymentPercentage = 0, mortgageTermYears, interestRatePercent } = details;

  const downPayment = downPaymentAmount > 0 ? downPaymentAmount : propertyPrice * (downPaymentPercentage / 100);
  const principal = propertyPrice - downPayment;

  if (principal <= 0 || interestRatePercent <= 0 || mortgageTermYears <= 0) {
    return 0; // Invalid input or fully paid
  }

  const monthlyInterestRate = interestRatePercent / 12 / 100;
  const numberOfPayments = mortgageTermYears * 12;

  // Handle edge case for 0% interest rate separately
  if (monthlyInterestRate === 0) {
      return principal / numberOfPayments;
  }

  const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const monthlyPayment = principal * (monthlyInterestRate * factor) / (factor - 1);

  return monthlyPayment;
};

// Placeholder for total monthly housing cost calculation
export const calculateTotalMonthlyHousingCost = (housing: Housing): number => {
    let totalCost = 0;

    if (housing.type === 'Rent') {
        totalCost += housing.monthlyRent ?? 0;
    } else if (housing.type === 'Buy' && housing.mortgageDetails) {
        totalCost += calculateMonthlyMortgagePayment(housing.mortgageDetails);
    }

    totalCost += (housing.annualPropertyTax ?? 0) / 12;
    totalCost += (housing.annualHomeInsurance ?? 0) / 12;
    totalCost += (housing.annualMaintenance ?? 0) / 12;

    return totalCost;
}; 