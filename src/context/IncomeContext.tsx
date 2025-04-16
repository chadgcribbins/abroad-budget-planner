'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import {
  Income,
  SalaryDetails,
  PassiveIncome,
  OneOffInflow,
} from '../types/income.types';

// --- State Interface ---
// We use the imported Income type directly as our state shape

// --- Action Types ---
type IncomeAction =
  | { type: 'SET_INCOME_STATE'; payload: Income }
  | { type: 'UPDATE_PARTNER1_SALARY'; payload: SalaryDetails | undefined }
  | { type: 'UPDATE_PARTNER2_SALARY'; payload: SalaryDetails | undefined }
  | { type: 'ADD_PASSIVE_INCOME'; payload: Omit<PassiveIncome, 'id'> }
  | { type: 'UPDATE_PASSIVE_INCOME'; payload: PassiveIncome }
  | { type: 'REMOVE_PASSIVE_INCOME'; payload: { id: string } }
  | { type: 'ADD_ONE_OFF_INFLOW'; payload: Omit<OneOffInflow, 'id'> }
  | { type: 'UPDATE_ONE_OFF_INFLOW'; payload: OneOffInflow }
  | { type: 'REMOVE_ONE_OFF_INFLOW'; payload: { id: string } };

// --- Initial State ---
const initialIncomeState: Income = {
  partner1Salary: undefined,
  partner2Salary: undefined,
  passiveIncomes: [],
  oneOffInflows: [],
};

// --- Reducer ---
const incomeReducer = (state: Income, action: IncomeAction): Income => {
  switch (action.type) {
    case 'SET_INCOME_STATE':
      return action.payload;
    case 'UPDATE_PARTNER1_SALARY':
      return { ...state, partner1Salary: action.payload };
    case 'UPDATE_PARTNER2_SALARY':
      return { ...state, partner2Salary: action.payload };
    case 'ADD_PASSIVE_INCOME':
      // Simple ID generation for demo purposes
      const newPassiveIncome: PassiveIncome = {
        ...action.payload,
        id: `passive-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };
      return {
        ...state,
        passiveIncomes: [...state.passiveIncomes, newPassiveIncome],
      };
    case 'UPDATE_PASSIVE_INCOME':
      return {
        ...state,
        passiveIncomes: state.passiveIncomes.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_PASSIVE_INCOME':
      return {
        ...state,
        passiveIncomes: state.passiveIncomes.filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case 'ADD_ONE_OFF_INFLOW':
       // Simple ID generation for demo purposes
      const newOneOffInflow: OneOffInflow = {
        ...action.payload,
        id: `oneoff-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };
      return {
        ...state,
        oneOffInflows: [...state.oneOffInflows, newOneOffInflow],
      };
    case 'UPDATE_ONE_OFF_INFLOW':
      return {
        ...state,
        oneOffInflows: state.oneOffInflows.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_ONE_OFF_INFLOW':
      return {
        ...state,
        oneOffInflows: state.oneOffInflows.filter(
          (item) => item.id !== action.payload.id
        ),
      };
    default:
      // Add exhaustive check utility if needed
      // const _exhaustiveCheck: never = action;
      // return state;
      // For now, just return state
       return state;
  }
};

// --- Context ---
interface IncomeContextType {
  state: Income;
  dispatch: Dispatch<IncomeAction>;
}

const IncomeContext = createContext<IncomeContextType | undefined>(undefined);

// --- Provider ---
interface IncomeProviderProps {
  children: ReactNode;
  // Optionally accept initial state from props for testing or SSR
  initialStateOverride?: Income;
}

export const IncomeProvider: React.FC<IncomeProviderProps> = ({
  children,
  initialStateOverride,
}) => {
  const [state, dispatch] = useReducer(
    incomeReducer,
    initialStateOverride || initialIncomeState
  );

  return (
    <IncomeContext.Provider value={{ state, dispatch }}>
      {children}
    </IncomeContext.Provider>
  );
};

// --- Hook ---
export const useIncome = (): IncomeContextType => {
  const context = useContext(IncomeContext);
  if (context === undefined) {
    throw new Error('useIncome must be used within an IncomeProvider');
  }
  return context;
}; 