import { z } from 'zod';
import { Profile, FamilyMember, ROLE_CONFIG, ProfileValidationError } from '@/src/types/profile';
import { getCountryCurrencies } from '@/src/utils/currency';

// Supported countries (based on currency data)
const COUNTRIES = [
  'Portugal', 'Spain', 'France', 'Italy', 'Germany', 'Netherlands',
  'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Switzerland',
  'Sweden', 'Norway', 'Denmark', 'Poland', 'Czech Republic',
  'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Russia',
  'Turkey', 'Brazil', 'China', 'Indonesia', 'India',
  'South Korea', 'Mexico', 'Malaysia', 'New Zealand',
  'Philippines', 'Singapore', 'Thailand', 'South Africa'
];

// Zod schemas for validation
export const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  role: z.enum(['Adult', 'Child', 'Parent', 'Grandparent']),
  ageGroup: z.enum(['Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Senior']).optional(),
  isPrimary: z.boolean().optional(),
}).refine((data) => {
  // Validate age group requirements based on role
  const roleConfig = ROLE_CONFIG[data.role];
  if (roleConfig.requiresAgeGroup && !data.ageGroup) {
    return false;
  }
  if (data.role === 'Child' && data.ageGroup && 'ageGroups' in roleConfig) {
    if (!roleConfig.ageGroups.includes(data.ageGroup as any)) {
      return false;
    }
  }
  return true;
}, {
  message: 'Invalid age group for selected role',
});

export const householdSchema = z.object({
  name: z.string().min(2, 'Household name must be at least 2 characters').max(50, 'Household name is too long'),
  originCountry: z.string().refine((country) => COUNTRIES.includes(country), {
    message: 'Please select a valid country',
  }),
});

export const profileSchema = z.object({
  household: z.object({
    name: z.string().min(2).max(50),
    originCountry: z.string(),
    members: z.array(familyMemberSchema).min(1, 'At least one family member is required'),
  }),
});

// Validation functions
export function validateProfile(profile: Partial<Profile>): ProfileValidationError[] {
  const errors: ProfileValidationError[] = [];

  try {
    profileSchema.parse(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors.push({
          field: err.path.join('.'),
          message: err.message,
        });
      });
    }
  }

  // Additional business rules
  if (profile.household?.members) {
    const hasAdult = profile.household.members.some(m => m.role === 'Adult');
    if (!hasAdult) {
      errors.push({
        field: 'household.members',
        message: 'At least one adult member is required',
      });
    }

    // Check for duplicate names (warning, not error)
    const names = profile.household.members.map(m => m.name.toLowerCase());
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
      errors.push({
        field: 'household.members',
        message: 'Warning: Duplicate member names detected',
      });
    }
  }

  return errors;
}

// Helper functions
export function getDefaultAgeGroup(role: FamilyMember['role']): FamilyMember['ageGroup'] | undefined {
  const config = ROLE_CONFIG[role];
  return 'defaultAgeGroup' in config ? config.defaultAgeGroup : undefined;
}

export function requiresAgeGroup(role: FamilyMember['role']): boolean {
  return ROLE_CONFIG[role].requiresAgeGroup;
}

export function getAgeGroupsForRole(role: FamilyMember['role']): readonly FamilyMember['ageGroup'][] | null {
  const config = ROLE_CONFIG[role];
  if (config.requiresAgeGroup && 'ageGroups' in config) {
    return config.ageGroups;
  }
  return null;
}

export function getMemberCountByRole(members: FamilyMember[]): Record<string, number> {
  return members.reduce((acc, member) => {
    acc[member.role] = (acc[member.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getMemberCountByAgeGroup(members: FamilyMember[]): Record<string, number> {
  return members.reduce((acc, member) => {
    if (member.ageGroup) {
      acc[member.ageGroup] = (acc[member.ageGroup] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
}

export function getSchoolAgeChildren(members: FamilyMember[]): FamilyMember[] {
  return members.filter(m => 
    m.role === 'Child' && 
    m.ageGroup && 
    ['Primary', 'Secondary', 'College'].includes(m.ageGroup)
  );
}

export function getWorkingAdults(members: FamilyMember[]): FamilyMember[] {
  return members.filter(m => 
    m.role === 'Adult' || 
    (m.ageGroup === 'Adult' && ['Parent', 'Grandparent'].includes(m.role))
  );
}