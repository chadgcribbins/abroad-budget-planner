/**
 * @file Utility functions for budget-related calculations.
 */

/**
 * Calculates the fixed monthly mortgage payment.
 * M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
 * M = Monthly payment
 * P = Principal loan amount (property price - down payment)
 * i = Monthly interest rate (annual rate / 100 / 12)
 * n = Total number of payments (loan term in years * 12)
 * @returns The calculated monthly payment, or 0 if inputs are invalid.
 */
export function calculateMonthlyMortgage(
  propertyPrice: number | '' | null | undefined,
  downPaymentPercentage: number | '' | null | undefined,
  mortgageTermYears: number | '' | null | undefined,
  mortgageInterestRate: number | '' | null | undefined
): number {
  const price = Number(propertyPrice ?? 0);
  const downPercent = Number(downPaymentPercentage ?? 0);
  const termYears = Number(mortgageTermYears ?? 0);
  const annualRatePercent = Number(mortgageInterestRate ?? 0);

  if (price <= 0 || termYears <= 0 || annualRatePercent <= 0) {
    return 0; // Invalid input for calculation
  }

  const downPaymentAmount = price * (downPercent / 100);
  const principal = price - downPaymentAmount;

  if (principal <= 0) {
      return 0; // Nothing to finance
  }

  const monthlyInterestRate = annualRatePercent / 100 / 12;
  const numberOfPayments = termYears * 12;

  // Handle zero interest rate separately to avoid division by zero
  if (monthlyInterestRate === 0) {
    return principal / numberOfPayments;
  }

  const factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
  const monthlyPayment = principal * (monthlyInterestRate * factor) / (factor - 1);

  return monthlyPayment > 0 ? monthlyPayment : 0;
}


/**
 * Calculates the average monthly cost for a utility that might have seasonal variations.
 * If seasonal is false, returns the base monthly cost.
 * If seasonal is true, returns the average of the four seasonal monthly costs.
 * Treats empty/null/undefined inputs as 0.
 */
export function calculateAverageSeasonalUtility(
  baseMonthlyCost: number | '' | null | undefined,
  isSeasonal: boolean | null | undefined,
  winterMonthlyCost: number | '' | null | undefined,
  springMonthlyCost: number | '' | null | undefined,
  summerMonthlyCost: number | '' | null | undefined,
  fallMonthlyCost: number | '' | null | undefined
): number {
  const base = Number(baseMonthlyCost ?? 0);
  const winter = Number(winterMonthlyCost ?? 0);
  const spring = Number(springMonthlyCost ?? 0);
  const summer = Number(summerMonthlyCost ?? 0);
  const fall = Number(fallMonthlyCost ?? 0);

  if (isSeasonal) {
    // Ensure all seasonal values are non-negative
    const validWinter = Math.max(0, winter);
    const validSpring = Math.max(0, spring);
    const validSummer = Math.max(0, summer);
    const validFall = Math.max(0, fall);
    // Only average if at least one seasonal value is provided, otherwise it's 0
    const totalSeasonal = validWinter + validSpring + validSummer + validFall;
    return totalSeasonal > 0 ? totalSeasonal / 4 : 0;
  } else {
    // Ensure base value is non-negative
    return Math.max(0, base);
  }
}

// Import other necessary types
import { Transport } from '../types/transport.types';
import type { EducationState } from '../types/education.types';
import type { LifestyleState } from '../context/LifestyleContext'; 
import type { HousingState } from '../types/housing.types';
import type { UtilitiesState } from '../types/utilities.types';
import type { HealthcareState } from '../types/healthcare.types';

/**
 * Calculates the total *annual* education cost based on the EducationState.
 * Sums up annual tuition and extra costs for all children marked as 'private'.
 * @param education The education state object.
 * @returns The total calculated annual education cost.
 */
export function calculateTotalAnnualEducationCost(
  education: EducationState | null | undefined
): number {
  let annualCost = 0;
  if (education) {
    for (const childKey in education) {
      // Ensure we are iterating over own properties if necessary, although for..in on objects is usually fine
      if (Object.prototype.hasOwnProperty.call(education, childKey)) { 
        const details = education[childKey];
        if (details.choice === 'private') {
          annualCost += Number(details.annualTuition ?? 0);
          annualCost += Number(details.extraCosts ?? 0); // Assuming extra costs are annual
        }
      }
    }
  }
  return Math.max(0, annualCost);
}

/**
 * Aggregates fixed monthly expenses from various state slices.
 * Handles rent vs. mortgage, seasonal utilities, transport options, healthcare, private education, and fixed lifestyle services.
 * @returns The total calculated fixed monthly expenses.
 */
export function calculateTotalFixedMonthlyExpenses(
  housing: HousingState | null | undefined,
  utilities: UtilitiesState | null | undefined,
  transport: Transport | null | undefined,
  healthcare: HealthcareState | null | undefined,
  education: EducationState | null | undefined,
  lifestyle: LifestyleState | null | undefined
): number {
  let total = 0;

  // Housing
  if (housing) {
    if (housing.isBuying) {
      const monthlyMortgage = calculateMonthlyMortgage(
        housing.propertyPrice,
        housing.downPaymentPercentage,
        housing.mortgageTermYears,
        housing.mortgageInterestRate
      );
      total += monthlyMortgage;
      total += (Number(housing.annualMaintenance ?? 0) / 12);
      total += (Number(housing.annualInsurance ?? 0) / 12);
      total += (Number(housing.annualPropertyTax ?? 0) / 12);
    } else {
      total += Number(housing.monthlyRent ?? 0);
    }
  }

  // Utilities
  if (utilities) {
    total += calculateAverageSeasonalUtility(
      utilities.electricity, utilities.isSeasonalElectricity,
      utilities.electricityWinter, utilities.electricitySpring, utilities.electricitySummer, utilities.electricityFall
    );
    total += calculateAverageSeasonalUtility(
      utilities.gasHeating, utilities.isSeasonalGasHeating,
      utilities.gasHeatingWinter, utilities.gasHeatingSpring, utilities.gasHeatingSummer, utilities.gasHeatingFall
    );
    total += Number(utilities.water ?? 0);
    total += Number(utilities.internet ?? 0);
    total += Number(utilities.mobile ?? 0);
  }

  // Transport
  if (transport) {
    if (transport.hasCar && transport.carDetails) {
      total += Number(transport.carDetails.monthlyPayment ?? 0);
      total += Number(transport.carDetails.monthlyInsuranceCost ?? 0);
      total += Number(transport.carDetails.monthlyMaintenanceCost ?? 0); // Assuming maintenance is a fixed estimate
    }
    // Add public transport pass cost regardless of car ownership? Or only if !hasCar? Assuming it's separate for now.
    total += Number(transport.publicTransportDetails?.monthlyPassCost ?? 0);
  }

  // Healthcare
  if (healthcare) {
    for (const memberKey in healthcare) {
      const details = healthcare[memberKey];
      total += Number(details.monthlyPremium ?? 0);
      total += Number(details.recurringMedical ?? 0);
    }
  }

  // Education (uses the new annual calculation)
  if (education) {
    total += (calculateTotalAnnualEducationCost(education) / 12);
  }

  // Lifestyle (Home Services)
  if (lifestyle && lifestyle.homeServices) {
    for (const serviceName in lifestyle.homeServices) {
      // Type assertion needed here if serviceName is not strictly typed keyof
      const service = lifestyle.homeServices[serviceName as keyof typeof lifestyle.homeServices];
      const amount = Number(service.amount ?? 0);
      if (amount > 0) {
        total += (service.frequency === 'annual' ? amount / 12 : amount);
      }
    }
  }

  return Math.max(0, total); // Ensure non-negative total
} 