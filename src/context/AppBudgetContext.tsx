'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useCallback, useMemo } from 'react';
import type { HouseholdComposition, AgeGroup } from '../types/household.types'; // Path is correct now
import type { EducationState, EducationDetails } from '../types/education.types';
import type { HealthcareState, HealthcareDetails } from '../types/healthcare.types'; // Path is correct now

// --- State Interface ---
// Combines all the state previously in AppContent
export interface AppBudgetState {
  household: HouseholdComposition;
  durationOfStayYears: number;
  // Housing
  isBuying: boolean;
  monthlyRent: number | '';
  propertyPrice: number | '';
  downPaymentPercentage: number | '';
  mortgageTermYears: number | '';
  mortgageInterestRate: number | '';
  annualMaintenance: number | '';
  annualInsurance: number | '';
  annualPropertyTax: number | '';
  futureUpgradeCost: number | '';
  // Utilities
  electricity: number | '';
  isSeasonalElectricity: boolean;
  electricityWinter: number | '';
  electricitySpring: number | '';
  electricitySummer: number | '';
  electricityFall: number | '';
  water: number | '';
  gasHeating: number | '';
  isSeasonalGasHeating: boolean;
  gasHeatingWinter: number | '';
  gasHeatingSpring: number | '';
  gasHeatingSummer: number | '';
  gasHeatingFall: number | '';
  internet: number | '';
  mobile: number | '';
  // Education & Healthcare
  educationState: EducationState;
  healthcareState: HealthcareState;
}

// --- Action Types ---
// Use specific actions for clarity instead of generic update
type AppBudgetAction =
  | { type: 'SET_HOUSEHOLD_COMPOSITION'; payload: HouseholdComposition }
  | { type: 'SET_DURATION_OF_STAY'; payload: number }
  | { type: 'SET_HOUSING_FIELD'; payload: { key: keyof AppBudgetState; value: any } } // For individual housing fields
  | { type: 'SET_UTILITIES_FIELD'; payload: { key: keyof AppBudgetState; value: any } } // For individual utility fields
  | { type: 'SET_EDUCATION_DETAILS'; payload: { childKey: string; details: Partial<EducationDetails> } }
  | { type: 'SET_HEALTHCARE_DETAILS'; payload: { memberKey: string; details: Partial<HealthcareDetails> } }
  | { type: 'SET_IS_BUYING'; payload: boolean }
  | { type: 'SET_IS_SEASONAL_ELECTRICITY'; payload: boolean }
  | { type: 'SET_IS_SEASONAL_GAS'; payload: boolean };

// --- Initial State ---
const initialAppBudgetState: AppBudgetState = {
  household: { Baby: 0, Primary: 0, Secondary: 0, College: 0, Adult: 0, Parent: 2, Grandparent: 0 },
  durationOfStayYears: 5,
  isBuying: false,
  monthlyRent: 1000,
  propertyPrice: 300000,
  downPaymentPercentage: 20,
  mortgageTermYears: 30,
  mortgageInterestRate: 3.5,
  annualMaintenance: 1500,
  annualInsurance: 500,
  annualPropertyTax: 800,
  futureUpgradeCost: 0,
  electricity: 80,
  isSeasonalElectricity: false,
  electricityWinter: 120,
  electricitySpring: 70,
  electricitySummer: 60,
  electricityFall: 90,
  water: 40,
  gasHeating: 100,
  isSeasonalGasHeating: false,
  gasHeatingWinter: 150,
  gasHeatingSpring: 80,
  gasHeatingSummer: 50,
  gasHeatingFall: 100,
  internet: 50,
  mobile: 30,
  educationState: {},
  healthcareState: {},
};

// --- Reducer ---
const appBudgetReducer = (state: AppBudgetState, action: AppBudgetAction): AppBudgetState => {
  switch (action.type) {
    case 'SET_HOUSEHOLD_COMPOSITION':
      return { ...state, household: action.payload };
    case 'SET_DURATION_OF_STAY':
      return { ...state, durationOfStayYears: action.payload };
    case 'SET_IS_BUYING':
         return { ...state, isBuying: action.payload };
    case 'SET_IS_SEASONAL_ELECTRICITY':
         return { ...state, isSeasonalElectricity: action.payload };
    case 'SET_IS_SEASONAL_GAS':
         return { ...state, isSeasonalGasHeating: action.payload };
    case 'SET_HOUSING_FIELD':
    case 'SET_UTILITIES_FIELD':
       // Ensure value is number or empty string for relevant fields
       const keysRequiringNumberOrEmpty: (keyof AppBudgetState)[] = [
           'monthlyRent', 'propertyPrice', 'downPaymentPercentage', 'mortgageTermYears', 'mortgageInterestRate',
           'annualMaintenance', 'annualInsurance', 'annualPropertyTax', 'futureUpgradeCost',
           'electricity', 'electricityWinter', 'electricitySpring', 'electricitySummer', 'electricityFall',
           'water', 'gasHeating', 'gasHeatingWinter', 'gasHeatingSpring', 'gasHeatingSummer', 'gasHeatingFall',
           'internet', 'mobile'
       ];
       const value = keysRequiringNumberOrEmpty.includes(action.payload.key)
           ? (action.payload.value === '' ? '' : Number(action.payload.value))
           : action.payload.value;
      return { ...state, [action.payload.key]: value };
    case 'SET_EDUCATION_DETAILS':
      return {
        ...state,
        educationState: {
          ...state.educationState,
          [action.payload.childKey]: {
            ...(state.educationState[action.payload.childKey] || { choice: 'public' }),
            ...action.payload.details,
          },
        },
      };
    case 'SET_HEALTHCARE_DETAILS':
      return {
        ...state,
        healthcareState: {
          ...state.healthcareState,
          [action.payload.memberKey]: {
            ...(state.healthcareState[action.payload.memberKey] || { type: 'Public' }),
            ...action.payload.details,
          },
        },
      };
    default:
      return state;
  }
};

// --- Context ---
interface AppBudgetContextType {
  state: AppBudgetState;
  dispatch: Dispatch<AppBudgetAction>;
  // Include handler functions for easier use in components
  handleHouseholdChange: (key: AgeGroup | 'durationOfStayYears', value: number) => void;
  handleHousingChange: (key: string, value: any) => void;
  handleUtilitiesChange: (key: string, value: any) => void;
  handleEducationChange: (childKey: string, detailsUpdate: Partial<EducationDetails>) => void;
  handleHealthcareChange: (memberKey: string, detailsUpdate: Partial<HealthcareDetails>) => void;
}

const AppBudgetContext = createContext<AppBudgetContextType | undefined>(undefined);

// --- Provider ---
interface AppBudgetProviderProps {
  children: ReactNode;
}

export const AppBudgetProvider: React.FC<AppBudgetProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appBudgetReducer, initialAppBudgetState);

  // Recreate handlers using dispatch
  const handleHouseholdChange = useCallback((key: AgeGroup | 'durationOfStayYears', value: number) => {
    if (key === 'durationOfStayYears') {
      dispatch({ type: 'SET_DURATION_OF_STAY', payload: value });
    } else {
        // Need to reconstruct the household object
        const newHousehold = { ...state.household, [key]: value };
        dispatch({ type: 'SET_HOUSEHOLD_COMPOSITION', payload: newHousehold });
    }
  }, [state.household, dispatch]);

  const handleHousingChange = useCallback((key: string, value: any) => {
      if (key === 'isBuying') {
          dispatch({ type: 'SET_IS_BUYING', payload: value as boolean });
      } else {
          dispatch({ type: 'SET_HOUSING_FIELD', payload: { key: key as keyof AppBudgetState, value } });
      }
  }, [dispatch]);

  const handleUtilitiesChange = useCallback((key: string, value: any) => {
      if (key === 'isSeasonalElectricity') {
          dispatch({ type: 'SET_IS_SEASONAL_ELECTRICITY', payload: value as boolean });
      } else if (key === 'isSeasonalGasHeating') {
          dispatch({ type: 'SET_IS_SEASONAL_GAS', payload: value as boolean });
      } else {
        dispatch({ type: 'SET_UTILITIES_FIELD', payload: { key: key as keyof AppBudgetState, value } });
      }
  }, [dispatch]);

  const handleEducationChange = useCallback((childKey: string, detailsUpdate: Partial<EducationDetails>) => {
    dispatch({ type: 'SET_EDUCATION_DETAILS', payload: { childKey, details: detailsUpdate } });
  }, [dispatch]);

  const handleHealthcareChange = useCallback((memberKey: string, detailsUpdate: Partial<HealthcareDetails>) => {
    dispatch({ type: 'SET_HEALTHCARE_DETAILS', payload: { memberKey, details: detailsUpdate } });
  }, [dispatch]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    handleHouseholdChange,
    handleHousingChange,
    handleUtilitiesChange,
    handleEducationChange,
    handleHealthcareChange,
  }), [
      state,
      dispatch,
      handleHouseholdChange,
      handleHousingChange,
      handleUtilitiesChange,
      handleEducationChange,
      handleHealthcareChange
  ]);

  return (
    <AppBudgetContext.Provider value={contextValue}>
      {children}
    </AppBudgetContext.Provider>
  );
};

// --- Hook ---
export const useAppBudget = (): AppBudgetContextType => {
  const context = useContext(AppBudgetContext);
  if (context === undefined) {
    throw new Error('useAppBudget must be used within an AppBudgetProvider');
  }
  return context;
}; 