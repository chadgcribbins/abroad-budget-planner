/**
 * @file Defines TypeScript types for Housing module state.
 */

// Represents the state shape needed for calculations,
// mirrors the state managed in AppBudgetContext or page.tsx initially.
export interface HousingState {
  isBuying: boolean;
  monthlyRent?: number | '';
  propertyPrice?: number | '';
  downPaymentPercentage?: number | '';
  mortgageTermYears?: number | '';
  mortgageInterestRate?: number | '';
  annualMaintenance?: number | '';
  annualInsurance?: number | '';
  annualPropertyTax?: number | '';
  futureUpgradeCost?: number | ''; // Included for completeness, not used in fixed cost calc
}

export type HousingType = 'Rent' | 'Buy';

export interface MortgageDetails {
  propertyPrice: number;
  downPaymentAmount?: number; // Fixed amount
  downPaymentPercentage?: number; // Percentage of price
  mortgageTermYears: number;
  interestRatePercent: number;
}

export interface Housing {
  type: HousingType;
  monthlyRent?: number; // If type is 'Rent'
  mortgageDetails?: MortgageDetails; // If type is 'Buy'
  annualPropertyTax?: number;
  annualHomeInsurance?: number;
  annualMaintenance?: number; // General upkeep or condo fees if applicable
  // Consider adding fields for potential upgrades later if needed
} 