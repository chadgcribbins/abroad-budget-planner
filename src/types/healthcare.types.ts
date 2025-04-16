import { HouseholdMember } from './household.types';

export type HealthcareType = 'Public' | 'Private' | 'Hybrid';

export interface HealthcareMemberDetails {
  memberId: string; // Link to HouseholdMember
  coverageType: HealthcareType;
  monthlyPremium?: number; // Especially if Private/Hybrid
  estimatedMonthlyOOP?: number; // Out-of-pocket for visits, prescriptions
  knownRecurringMonthlyCost?: number; // Specific ongoing treatments
}

export interface Healthcare {
  membersCoverage: HealthcareMemberDetails[];
} 