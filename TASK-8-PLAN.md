# Task #8 Implementation Plan - User Profile & Household Setup Module

## Overview
Implement a comprehensive profile setup module that collects household information including family composition, origin country, and member details. This data serves as the foundation for all financial calculations throughout the application.

## Objectives
1. Create multi-step profile setup wizard
2. Collect household member information
3. Set origin country for currency calculations
4. Store profile data persistently
5. Integrate with existing scenario system
6. Add profile editing capabilities

## Implementation Steps

### 1. Profile Pages & Routing
- [ ] Create `/profile/setup` - Initial setup wizard
- [ ] Create `/profile/edit` - Edit existing profile
- [ ] Create `/profile` - View profile summary
- [ ] Add route guards for profile requirement

### 2. Multi-Step Setup Wizard
- [ ] Step 1: Household basics (name, origin country)
- [ ] Step 2: Add family members
- [ ] Step 3: Review and confirm
- [ ] Progress indicator component
- [ ] Step navigation with validation

### 3. Family Member Management
- [ ] Add member form with validation
- [ ] Member cards with edit/delete
- [ ] Role selection (Adult, Child, Parent, Grandparent)
- [ ] Age group selection for appropriate roles
- [ ] Drag-and-drop reordering

### 4. Store Enhancement
- [ ] Extend profile store with full CRUD operations
- [ ] Add validation methods
- [ ] Implement member management actions
- [ ] Add computed properties (member counts, etc.)

### 5. UI Components
- [ ] ProfileSetupWizard component
- [ ] MemberCard component
- [ ] AddMemberModal component
- [ ] CountrySelector with flags
- [ ] ProfileSummary component

### 6. Integration Points
- [ ] Update scenario creation to require profile
- [ ] Show origin currency in relevant places
- [ ] Enable household-based calculations
- [ ] Update navigation to show profile status

## Technical Specifications

### Profile Data Structure
```typescript
interface Profile {
  id: string;
  household: {
    name: string;
    originCountry: string;
    members: FamilyMember[];
  };
  createdAt: string;
  updatedAt: string;
}

interface FamilyMember {
  id: string;
  name: string;
  role: 'Adult' | 'Child' | 'Parent' | 'Grandparent';
  ageGroup?: 'Baby' | 'Primary' | 'Secondary' | 'College' | 'Adult' | 'Senior';
  isPrimary?: boolean; // Primary income earner
}
```

### Validation Rules
- Household name: Required, 2-50 characters
- Origin country: Required, from supported list
- At least one adult member required
- Child members must have age group
- Unique member names recommended

### Age Group Mapping
- Baby: 0-3 years (no education costs)
- Primary: 4-11 years (primary school)
- Secondary: 12-17 years (secondary school)
- College: 18-22 years (higher education)
- Adult: 23-64 years (working age)
- Senior: 65+ years (retirement)

## File Structure
```
src/
├── app/(authenticated)/profile/
│   ├── page.tsx              # Profile summary
│   ├── setup/page.tsx        # Setup wizard
│   └── edit/page.tsx         # Edit profile
├── components/profile/
│   ├── ProfileSetupWizard.tsx
│   ├── HouseholdStep.tsx
│   ├── MembersStep.tsx
│   ├── ReviewStep.tsx
│   ├── MemberCard.tsx
│   ├── AddMemberModal.tsx
│   └── ProfileSummary.tsx
├── hooks/
│   └── useProfileSetup.ts    # Setup wizard logic
└── utils/
    └── profileValidation.ts  # Validation helpers
```

## User Experience Flow

### First-Time Setup
1. User lands on app → Redirect to profile setup
2. Step 1: Enter household name and origin country
3. Step 2: Add family members one by one
4. Step 3: Review and confirm details
5. Complete → Redirect to scenarios

### Editing Profile
1. Access from header menu or profile page
2. Edit household basics or members
3. Changes auto-save with confirmation
4. Updates reflected across all scenarios

### Member Management
1. Click "Add Member" button
2. Fill in name, role, age group (if applicable)
3. Save → Member added to list
4. Edit/Delete available on each card
5. Reorder by drag-and-drop

## Success Criteria
- [ ] Complete profile setup in under 2 minutes
- [ ] Clear validation messages
- [ ] Smooth multi-step navigation
- [ ] Profile persists across sessions
- [ ] All scenarios use profile data
- [ ] Mobile-responsive design
- [ ] Accessible form controls

## Integration Requirements
- Profile completion required before scenario creation
- Origin country determines base currency
- Member count affects various calculations
- Age groups influence education/healthcare modules
- Profile changes update all linked scenarios