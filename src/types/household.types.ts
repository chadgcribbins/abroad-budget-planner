/**
 * @file Defines TypeScript types for household composition.
 */

export const ageGroups = [
  'Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Parent', 'Grandparent'
] as const;

export type AgeGroup = typeof ageGroups[number];

export type HouseholdComposition = { [K in AgeGroup]: number };

export interface HouseholdMember {
  id: string; // Unique ID for list mapping or future identification
  ageGroup: AgeGroup;
  // Add other relevant member details if needed later, e.g., name (optional)
}

export interface Household {
  originCountry: string; // e.g., 'GB'
  destinationCountry: string; // e.g., 'PT'
  taxRegime?: string; // e.g., 'NHR', 'Standard', TBD specific values
  members: HouseholdMember[];
  durationOfStayYears: number;
} 