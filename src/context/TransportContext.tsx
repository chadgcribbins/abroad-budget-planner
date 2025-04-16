'use client';

import React, { createContext, useReducer, useContext, ReactNode, Dispatch } from 'react';
import { Transport, CarOwnershipDetails, PublicTransportDetails } from '../types/transport.types';

// --- State Interface ---
// Using the imported Transport type

// --- Action Types ---
type TransportAction =
  | { type: 'SET_TRANSPORT_STATE'; payload: Transport }
  | { type: 'TOGGLE_HAS_CAR'; payload: boolean }
  | { type: 'UPDATE_CAR_DETAILS'; payload: Partial<CarOwnershipDetails> }
  | { type: 'UPDATE_PUBLIC_TRANSPORT_DETAILS'; payload: Partial<PublicTransportDetails> };
  // Add more specific actions if needed, e.g., UPDATE_CAR_TYPE

// --- Initial State ---
const initialTransportState: Transport = {
  hasCar: false,
  carDetails: undefined, // Initially undefined
  publicTransportDetails: {
    monthlyPassCost: 0,
    monthlyRideShareCost: 0,
  },
};

// --- Reducer ---
const transportReducer = (state: Transport, action: TransportAction): Transport => {
  switch (action.type) {
    case 'SET_TRANSPORT_STATE':
      return action.payload;
    case 'TOGGLE_HAS_CAR':
      return {
        ...state,
        hasCar: action.payload,
        // Reset car details if toggling off, or initialize if toggling on
        carDetails: action.payload ? state.carDetails ?? { type: 'Gas', purchaseType: 'Purchase' } : undefined,
      };
    case 'UPDATE_CAR_DETAILS':
      if (!state.hasCar) return state; // Cannot update if no car
      return {
        ...state,
        carDetails: { 
          ...(state.carDetails ?? { type: 'Gas', purchaseType: 'Purchase' }), // Ensure carDetails exists
          ...action.payload 
        },
      };
    case 'UPDATE_PUBLIC_TRANSPORT_DETAILS':
      return {
        ...state,
        publicTransportDetails: { 
          ...state.publicTransportDetails,
           ...action.payload 
          },
      };
    default:
      return state;
  }
};

// --- Context ---
interface TransportContextType {
  state: Transport;
  dispatch: Dispatch<TransportAction>;
}

const TransportContext = createContext<TransportContextType | undefined>(undefined);

// --- Provider ---
interface TransportProviderProps {
  children: ReactNode;
  initialStateOverride?: Transport;
}

export const TransportProvider: React.FC<TransportProviderProps> = ({
  children,
  initialStateOverride,
}) => {
  const [state, dispatch] = useReducer(
    transportReducer,
    initialStateOverride || initialTransportState
  );

  return (
    <TransportContext.Provider value={{ state, dispatch }}>
      {children}
    </TransportContext.Provider>
  );
};

// --- Hook ---
export const useTransport = (): TransportContextType => {
  const context = useContext(TransportContext);
  if (context === undefined) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
}; 