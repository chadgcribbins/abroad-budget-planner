// Enhanced Profile Types

export interface FamilyMember {
  id: string;
  name: string;
  role: 'Adult' | 'Child' | 'Parent' | 'Grandparent';
  ageGroup?: 'Baby' | 'Primary' | 'Secondary' | 'College' | 'Adult' | 'Senior';
  isPrimary?: boolean; // Primary income earner
}

export interface Household {
  name: string;
  originCountry: string;
  members: FamilyMember[];
}

export interface Profile {
  id: string;
  household: Household;
  createdAt: string;
  updatedAt: string;
}

// Role configurations
export const ROLE_CONFIG = {
  Adult: {
    label: 'Adult',
    description: 'Working age adult',
    requiresAgeGroup: false,
    defaultAgeGroup: 'Adult' as const,
  },
  Child: {
    label: 'Child',
    description: 'Dependent child',
    requiresAgeGroup: true,
    ageGroups: ['Baby', 'Primary', 'Secondary', 'College'] as const,
  },
  Parent: {
    label: 'Parent',
    description: 'Elderly parent',
    requiresAgeGroup: false,
    defaultAgeGroup: 'Senior' as const,
  },
  Grandparent: {
    label: 'Grandparent',
    description: 'Elderly grandparent',
    requiresAgeGroup: false,
    defaultAgeGroup: 'Senior' as const,
  },
} as const;

// Age group configurations
export const AGE_GROUP_CONFIG = {
  Baby: {
    label: 'Baby (0-3)',
    minAge: 0,
    maxAge: 3,
    description: 'Pre-school age',
  },
  Primary: {
    label: 'Primary School (4-11)',
    minAge: 4,
    maxAge: 11,
    description: 'Primary education age',
  },
  Secondary: {
    label: 'Secondary School (12-17)',
    minAge: 12,
    maxAge: 17,
    description: 'Secondary education age',
  },
  College: {
    label: 'College (18-22)',
    minAge: 18,
    maxAge: 22,
    description: 'Higher education age',
  },
  Adult: {
    label: 'Adult (23-64)',
    minAge: 23,
    maxAge: 64,
    description: 'Working age',
  },
  Senior: {
    label: 'Senior (65+)',
    minAge: 65,
    maxAge: null,
    description: 'Retirement age',
  },
} as const;

// Validation types
export interface ProfileValidationError {
  field: string;
  message: string;
}

export interface ProfileSetupStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
}

// Form types for setup wizard
export interface HouseholdFormData {
  name: string;
  originCountry: string;
}

export interface MemberFormData {
  name: string;
  role: FamilyMember['role'];
  ageGroup?: FamilyMember['ageGroup'];
  isPrimary?: boolean;
}