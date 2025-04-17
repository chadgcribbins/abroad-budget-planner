import { AgeGroup } from './household.types'; // Assuming household types are in a separate file

export type SchoolType = 'Public' | 'Private' | 'Homeschool'; // Added Homeschool option

export interface SchoolingDetails {
  childAgeGroup: AgeGroup; // To link cost to the child's stage
  schoolType: SchoolType;
  annualTuition?: number; // If Private
  annualBooksSupplies?: number;
  annualExtracurriculars?: number; // Uniforms, activities etc.
  // Consider adding childId if linking directly to HouseholdMember becomes necessary
}

export interface ChildcareDetails {
  childAgeGroup: AgeGroup; // Typically 'Baby' or 'Primary'
  monthlyCost: number;
  type: string; // e.g., 'Nursery', 'Daycare', 'Nanny'
}

export interface Education {
  schooling: SchoolingDetails[]; // Array to cover multiple children
  childcare: ChildcareDetails[]; // Array for pre-school children
}

/**
 * @file Defines TypeScript types for the Education module state.
 */

export type EducationChoice = 'public' | 'private';

export type EducationDetails = {
  choice: EducationChoice;
  annualTuition?: number | '';
  extraCosts?: number | '';
};

export type EducationState = { [childKey: string]: EducationDetails }; 