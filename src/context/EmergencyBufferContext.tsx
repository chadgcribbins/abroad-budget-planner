'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect, useMemo } from 'react';
import { EmergencyBuffer } from '../types/emergency.types';
// Import hooks for dependent contexts
import { useAppBudget } from './AppBudgetContext';
import { useTransport } from './TransportContext';
import { useLifestyle } from './LifestyleContext';
// Import the calculation function
import { calculateTotalFixedMonthlyExpenses } from '../utils/budgetCalculations';
// Import necessary state types for calculation function
import type { HousingState } from '../types/housing.types';
import type { UtilitiesState } from '../types/utilities.types';
import type { Transport } from '../types/transport.types';
import type { HealthcareState } from '../types/healthcare.types';
import type { EducationState } from '../types/education.types';
import type { LifestyleState } from './LifestyleContext'; 

// --- State Interface ---
// We use the imported EmergencyBuffer type directly

// --- Action Types ---
type EmergencyBufferAction =
  | { type: 'SET_EMERGENCY_BUFFER_STATE'; payload: EmergencyBuffer }
  | { type: 'SET_TARGET_MONTHS'; payload: number }
  | { type: 'SET_CURRENT_RESERVE'; payload: number }
  | { type: 'UPDATE_CALCULATED_EXPENSES'; payload: number }; // Internal action

// --- Initial State ---
const initialEmergencyBufferState: EmergencyBuffer = {
  targetMonthsOfCoverage: 3, // Default to 3 months
  currentReserveAmount: 0,
  calculatedFixedMonthlyExpenses: 0, // Calculated dynamically
};

// --- Reducer ---
const emergencyBufferReducer = (
  state: EmergencyBuffer,
  action: EmergencyBufferAction
): EmergencyBuffer => {
  switch (action.type) {
    case 'SET_EMERGENCY_BUFFER_STATE':
      return action.payload;
    case 'SET_TARGET_MONTHS':
      // Add validation if needed (e.g., ensure positive number)
      return { ...state, targetMonthsOfCoverage: Math.max(0, action.payload) };
    case 'SET_CURRENT_RESERVE':
      // Add validation if needed
      return { ...state, currentReserveAmount: Math.max(0, action.payload) };
    case 'UPDATE_CALCULATED_EXPENSES':
      return { ...state, calculatedFixedMonthlyExpenses: Math.max(0, action.payload) };
    default:
      return state;
  }
};

// --- Context ---
interface EmergencyBufferContextType {
  state: EmergencyBuffer;
  dispatch: Dispatch<EmergencyBufferAction>;
  // Add derived values if needed (e.g., calculated runway in months)
}

const EmergencyBufferContext = createContext<EmergencyBufferContextType | undefined>(undefined);

// --- Provider ---
interface EmergencyBufferProviderProps {
  children: ReactNode;
  // TODO: Accept necessary state slices from page.tsx as props?
  // housingState: HousingState;
  // utilitiesState: UtilitiesState;
  // healthcareState: HealthcareState;
  // educationState: EducationState;
}

export const EmergencyBufferProvider: React.FC<EmergencyBufferProviderProps> = ({
  children,
  // housingState, // Example prop
  // utilitiesState,
  // healthcareState,
  // educationState,
}) => {
  const [state, dispatch] = useReducer(emergencyBufferReducer, initialEmergencyBufferState);

  // Get state from other contexts
  const { state: appBudgetState } = useAppBudget();
  const { state: transportState } = useTransport();
  const { state: lifestyleState } = useLifestyle();

  // Implement useEffect to recalculate expenses when dependencies change
  useEffect(() => {
    // Extract relevant slices from appBudgetState for the calculation function
    // Use the imported types directly
    const housingState: HousingState = {
        isBuying: appBudgetState.isBuying,
        monthlyRent: appBudgetState.monthlyRent,
        propertyPrice: appBudgetState.propertyPrice,
        downPaymentPercentage: appBudgetState.downPaymentPercentage,
        mortgageTermYears: appBudgetState.mortgageTermYears,
        mortgageInterestRate: appBudgetState.mortgageInterestRate,
        annualMaintenance: appBudgetState.annualMaintenance,
        annualInsurance: appBudgetState.annualInsurance,
        annualPropertyTax: appBudgetState.annualPropertyTax,
        futureUpgradeCost: appBudgetState.futureUpgradeCost, 
    };
    const utilitiesState: UtilitiesState = {
        electricity: appBudgetState.electricity,
        isSeasonalElectricity: appBudgetState.isSeasonalElectricity,
        electricityWinter: appBudgetState.electricityWinter,
        electricitySpring: appBudgetState.electricitySpring,
        electricitySummer: appBudgetState.electricitySummer,
        electricityFall: appBudgetState.electricityFall,
        water: appBudgetState.water,
        gasHeating: appBudgetState.gasHeating,
        isSeasonalGasHeating: appBudgetState.isSeasonalGasHeating,
        gasHeatingWinter: appBudgetState.gasHeatingWinter,
        gasHeatingSpring: appBudgetState.gasHeatingSpring,
        gasHeatingSummer: appBudgetState.gasHeatingSummer,
        gasHeatingFall: appBudgetState.gasHeatingFall,
        internet: appBudgetState.internet,
        mobile: appBudgetState.mobile,
    };
    // Pass the specific states directly from the consumed context state
    const healthcareState: HealthcareState = appBudgetState.healthcareState;
    const educationState: EducationState = appBudgetState.educationState;
    
    const calculatedExpenses = calculateTotalFixedMonthlyExpenses(
      housingState, 
      utilitiesState,
      transportState, // Pass the whole transport state object
      healthcareState,
      educationState,
      lifestyleState // Pass the whole lifestyle state object
    );
    
    // Only dispatch if the value has actually changed to prevent infinite loops if calculation is unstable
    if (calculatedExpenses !== state.calculatedFixedMonthlyExpenses) {
        dispatch({ type: 'UPDATE_CALCULATED_EXPENSES', payload: calculatedExpenses });
    }

  // Ensure all states consumed from contexts are in the dependency array
  }, [appBudgetState, transportState, lifestyleState, state.calculatedFixedMonthlyExpenses, dispatch]); 

  // TODO: Calculate derived values like runway
  // const runwayInMonths = useMemo(() => { ... }, [state]);

  const contextValue = useMemo(() => ({
    state,
    dispatch,
    // runwayInMonths, // Add derived values
  }), [state /*, runwayInMonths */]);

  return (
    <EmergencyBufferContext.Provider value={contextValue}>
      {children}
    </EmergencyBufferContext.Provider>
  );
};

// --- Hook ---
export const useEmergencyBuffer = (): EmergencyBufferContextType => {
  const context = useContext(EmergencyBufferContext);
  if (context === undefined) {
    throw new Error('useEmergencyBuffer must be used within an EmergencyBufferProvider');
  }
  return context;
}; 