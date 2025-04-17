/**
 * @file Defines TypeScript types for the Healthcare module state.
 */

import { HouseholdMember } from './household.types';

export type CoverageType = 'Public' | 'Private' | 'Hybrid';

export type HealthcareDetails = {
  type: CoverageType;
  monthlyPremium?: number | '';
  oopEstimate?: number | ''; // Out-of-pocket estimate (GP, Dental, Prescriptions combined for now)
  recurringMedical?: number | ''; // Known recurring costs
};

export type HealthcareState = { [memberKey: string]: HealthcareDetails };

export interface HealthcareMemberDetails {
  memberId: string; // Link to HouseholdMember
  coverageType: CoverageType;
  monthlyPremium?: number; // Especially if Private/Hybrid
  estimatedMonthlyOOP?: number; // Out-of-pocket for visits, prescriptions
  knownRecurringMonthlyCost?: number; // Specific ongoing treatments
}

export interface Healthcare {
  membersCoverage: HealthcareMemberDetails[];
} 