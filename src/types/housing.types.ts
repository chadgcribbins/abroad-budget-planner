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