# Living Abroad Budgeting Tool – Product Requirements Document (PRD-v7)

## Overview

The Living Abroad Budgeting Tool is an interactive web application designed to help families relocating internationally model and plan their financial lives with confidence. This tool allows users to create multiple budget scenarios, comparing different lifestyle choices and destinations while accounting for currency fluctuations and local tax regimes.

## Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **State Management**: Zustand with persistence
- **Charts**: Recharts for data visualization
- **Forms**: React Hook Form with Zod validation

### Infrastructure
- **Hosting**: Vercel
- **Storage**: LocalStorage (MVP), with future cloud sync
- **API**: OpenExchangeRates for currency data
- **Build Tools**: Task Master AI for development workflow

## Core Features & Implementation Strategy

### Phase 1: Foundation (Tasks 1-5) ✅ COMPLETE
1. **Project Setup**: Next.js, TypeScript, TailwindCSS, DaisyUI
2. **Store Architecture**: Zustand stores for profile, scenarios, fx, and ui state
3. **Component Library**: Base UI components and layout structure
4. **Routing**: App router setup with authenticated layout
5. **Storage**: LocalStorage persistence for scenarios

### Phase 2: Scenario Management (Task 6) 🎯 CURRENT
6. **Landing Page & Scenario Management**:
   - Scenario grid/list view with cards
   - Create, edit, delete, duplicate scenarios
   - Scenario metadata and completion tracking
   - Search and filter capabilities

### Phase 3: Core Modules (Tasks 7-15)
7. **Currency Exchange Integration**: OpenExchangeRates API
8. **Profile & Household Setup**: Family composition and origin country
9. **Income Module**: Salaries, passive income, one-off inflows
10. **Housing Module**: Rent vs. buy calculations
11. **Education Module**: Public vs. private school costs
12. **Healthcare Module**: Insurance and out-of-pocket expenses
13. **Transportation Module**: Car ownership vs. public transport
14. **Lifestyle Module**: Shopping, travel, services
15. **Utilities Module**: Monthly utilities and subscriptions

### Phase 4: Advanced Features (Tasks 16-24)
16. **Guided Wizard Flow**: Step-by-step scenario creation
17. **Tax Calculations**: NHR and other regime support
18. **Emergency Buffer**: Financial runway calculations
19. **FX Sensitivity Analysis**: Currency fluctuation impacts
20. **Dashboard Summary**: Comprehensive financial overview
21. **Scenario Comparison**: Side-by-side analysis
22. **Export Features**: PDF and CSV generation
23. **Sharing Capabilities**: Shareable scenario links
24. **AI Suggestions**: Smart defaults and recommendations

## Data Models

### Profile
```typescript
interface Profile {
  id: string;
  household: {
    name: string;
    originCountry: string;
    members: Array<{
      id: string;
      name: string;
      role: 'Adult' | 'Child' | 'Parent' | 'Grandparent';
      ageGroup?: 'Baby' | 'Primary' | 'Secondary' | 'College' | 'Adult' | 'Senior';
    }>;
  };
}
```

### Scenario
```typescript
interface Scenario {
  id: string;
  name: string;
  profileId: string;
  destinationCountry: string;
  residencyRegime?: string;
  duration: number; // years
  createdAt: string;
  updatedAt: string;
  completionStatus: {
    overall: number; // 0-100
    modules: Record<string, boolean>;
  };
  data: {
    income?: IncomeData;
    housing?: HousingData;
    education?: EducationData;
    // ... other modules
  };
}
```

## User Experience Design

### Design Principles
- **Card-based layouts** for clear information hierarchy
- **Progressive disclosure** to avoid overwhelming users
- **Financial planning aesthetic** with appropriate data density
- **Mobile-responsive** but desktop-optimized
- **Dark mode support** via DaisyUI theming

### Key User Flows
1. **First-time user**: Welcome → Create Profile → Create First Scenario
2. **Returning user**: Scenario List → Select/Create Scenario → Edit Modules
3. **Comparison flow**: Select Scenarios → View Side-by-side → Export Results

## Implementation Guidelines

### Code Organization
```
src/
├── app/                    # Next.js app router
│   ├── (authenticated)/    # Protected routes
│   │   ├── scenarios/      # Scenario management
│   │   └── wizard/         # Guided creation flow
│   └── page.tsx           # Landing page
├── components/
│   ├── scenarios/         # Scenario-specific components
│   ├── modules/           # Income, housing, etc.
│   ├── ui/                # Shared UI components
│   └── layout/            # Layout components
├── store/
│   ├── slices/            # Zustand slices
│   └── index.ts           # Store configuration
├── utils/
│   ├── scenarioStorage.ts # LocalStorage utilities
│   └── calculations.ts    # Financial calculations
└── types/                 # TypeScript types
```

### State Management Strategy
- **Profile Store**: Single user profile and household data
- **Scenario Store**: Active scenario and scenario list management
- **FX Store**: Currency rates and calculations
- **UI Store**: Application UI state (modals, filters, etc.)

### Development Workflow
1. Use Task Master for task management and tracking
2. Implement features module by module
3. Maintain clean, typed code with proper error handling
4. Test scenarios with realistic data
5. Ensure responsive design on all screen sizes

## Success Metrics
- Clean, intuitive scenario management interface
- Sub-second scenario switching and updates
- 100% TypeScript coverage with no any types
- Lighthouse score > 90 for performance
- Zero runtime errors in production

## Future Enhancements
- Cloud sync with user accounts
- Mobile native apps
- Multi-language support
- Integration with financial institutions
- Community scenario templates
- Advanced tax optimization suggestions