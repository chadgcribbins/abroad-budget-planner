export type IncomeFrequency = 'Annual' | 'Monthly' | 'Quarterly' | 'Yearly';

export interface SalaryDetails {
  amount: number;
  frequency: 'Annual' | 'Monthly';
  currency: string; // ISO 4217 code, e.g., 'GBP', 'EUR'
  taxStatus?: string; // Optional: relates to specific tax rules for this income
}

export interface PassiveIncome {
  id: string;
  type: string; // e.g., 'Rental', 'Investment', 'Freelance Side-Gig'
  amount: number;
  frequency: IncomeFrequency;
  currency: string;
  sourceCountry?: string; // Added: e.g., 'PT', 'UK', 'US'
}

export interface OneOffInflow {
  id: string;
  description: string; // e.g., 'Annual Bonus', 'Asset Sale', 'Relocation Allowance'
  amount: number;
  currency: string;
  year?: number; // Optional: Year the inflow is expected/received
  sourceCountry?: string; // Added: e.g., 'PT', 'UK', 'US'
}

export interface Income {
  partner1Salary?: SalaryDetails;
  partner2Salary?: SalaryDetails;
  passiveIncomes: PassiveIncome[];
  oneOffInflows: OneOffInflow[];
} 