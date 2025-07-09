export interface Profile {
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

export interface IncomeData {
  // To be implemented in Task 9
  salaries?: any[];
  passiveIncome?: any[];
  oneOffInflows?: any[];
}

export interface HousingData {
  // To be implemented in Task 10
  type?: 'rent' | 'buy';
  monthlyAmount?: number;
}

export interface EducationData {
  // To be implemented in Task 11
  type?: 'public' | 'private';
  annualCost?: number;
}

export interface Scenario {
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
    // ... other modules to be added
  };
}

export type ScenarioMap = Record<string, Scenario>;