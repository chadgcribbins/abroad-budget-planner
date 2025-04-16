export type AgeGroup =
  | 'Baby' // 0-2
  | 'Primary' // 3-11
  | 'Secondary' // 12-17
  | 'College' // 18-22
  | 'Adult' // 23-64
  | 'Parent' // Specific role, usually Adult age
  | 'Grandparent'; // Usually 65+

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