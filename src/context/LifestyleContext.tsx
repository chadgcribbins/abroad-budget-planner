'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { v4 as uuidv4 } from 'uuid';

// --- State Type ---
interface OneOffPurchase {
  id: string;
  name: string;
  amount: number | string; // Allow string for empty input
  // Consider adding frequency (e.g., 'annual') or target year later
}

// Added type for individual service state
export type HomeServiceFrequency = 'monthly' | 'annual'; // Add others like 'weekly' if needed
interface HomeServiceState {
  amount: number | string;
  frequency: HomeServiceFrequency;
}

// Define and export keys for type safety
export type HomeServiceName = 'cleaner' | 'babysitter' | 'gardening' | 'petCare';

interface LifestyleState {
  generalShoppingSpend: {
    amount: number | string; 
    frequency: 'monthly' | 'annual';
  };
  oneOffPurchases: OneOffPurchase[];
  travelHolidaysBudget: {
    amount: number | string;
    frequency: 'monthly' | 'annual';
  };
  homeServices: Record<HomeServiceName, HomeServiceState>;
  contingency: {
    type: 'fixed' | 'percentage';
    value: number | string; // Allow string for empty/percentage
  };
  // Add other lifestyle fields here later (contingency)
}

// --- Action Types ---
type LifestyleAction =
  | { type: 'UPDATE_GENERAL_SHOPPING_SPEND'; payload: { amount: number | string; frequency: 'monthly' | 'annual' } }
  | { type: 'ADD_ONE_OFF_PURCHASE'; payload: Omit<OneOffPurchase, 'id'> }
  | { type: 'REMOVE_ONE_OFF_PURCHASE'; payload: { id: string } }
  | { type: 'UPDATE_ONE_OFF_PURCHASE'; payload: { id: string; updates: Partial<Omit<OneOffPurchase, 'id'>> } }
  | { type: 'UPDATE_TRAVEL_HOLIDAYS_BUDGET'; payload: { amount: number | string; frequency: 'monthly' | 'annual' } }
  | { type: 'UPDATE_HOME_SERVICE'; payload: { serviceName: HomeServiceName; data: Partial<HomeServiceState> } }
  | { type: 'UPDATE_CONTINGENCY'; payload: Partial<LifestyleState['contingency']> };

// --- Initial State ---
const initialState: LifestyleState = {
  generalShoppingSpend: {
    amount: '',
    frequency: 'monthly',
  },
  oneOffPurchases: [],
  travelHolidaysBudget: {
    amount: '',
    frequency: 'annual',
  },
  homeServices: {
    cleaner: { amount: '', frequency: 'monthly' },
    babysitter: { amount: '', frequency: 'monthly' },
    gardening: { amount: '', frequency: 'monthly' },
    petCare: { amount: '', frequency: 'monthly' },
  },
  contingency: {
    type: 'percentage',
    value: 10,
  }
};

// --- Reducer ---
const lifestyleReducer = (state: LifestyleState, action: LifestyleAction): LifestyleState => {
  switch (action.type) {
    case 'UPDATE_GENERAL_SHOPPING_SPEND':
      return {
        ...state,
        generalShoppingSpend: action.payload,
      };
    case 'ADD_ONE_OFF_PURCHASE':
      return {
        ...state,
        oneOffPurchases: [
          ...state.oneOffPurchases,
          { id: uuidv4(), ...action.payload },
        ],
      };
    case 'REMOVE_ONE_OFF_PURCHASE':
      return {
        ...state,
        oneOffPurchases: state.oneOffPurchases.filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case 'UPDATE_ONE_OFF_PURCHASE':
      return {
        ...state,
        oneOffPurchases: state.oneOffPurchases.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };
    case 'UPDATE_TRAVEL_HOLIDAYS_BUDGET':
      return {
        ...state,
        travelHolidaysBudget: action.payload,
      };
    case 'UPDATE_HOME_SERVICE':
      return {
        ...state,
        homeServices: {
          ...state.homeServices,
          [action.payload.serviceName]: {
            ...state.homeServices[action.payload.serviceName],
            ...action.payload.data,
          },
        },
      };
    case 'UPDATE_CONTINGENCY':
      return {
        ...state,
        contingency: {
          ...state.contingency,
          ...action.payload,
        },
      };
    default:
      const exhaustiveCheck: never = action;
      return state;
  }
};

// --- Context ---
interface LifestyleContextType {
  state: LifestyleState;
  dispatch: Dispatch<LifestyleAction>;
}

const LifestyleContext = createContext<LifestyleContextType | undefined>(undefined);

// --- Provider ---
interface LifestyleProviderProps {
  children: ReactNode;
}

export const LifestyleProvider: React.FC<LifestyleProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(lifestyleReducer, initialState);

  return (
    <LifestyleContext.Provider value={{ state, dispatch }}>
      {children}
    </LifestyleContext.Provider>
  );
};

// --- Hook ---
export const useLifestyle = (): LifestyleContextType => {
  const context = useContext(LifestyleContext);
  if (context === undefined) {
    throw new Error('useLifestyle must be used within a LifestyleProvider');
  }
  return context;
}; 