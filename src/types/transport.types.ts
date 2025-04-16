/**
 * @file Defines TypeScript interfaces for the Transportation module state.
 */

/**
 * Represents the details when owning a car.
 */
export interface CarOwnershipDetails {
  type: 'Electric' | 'Gas';
  purchaseType: 'Purchase' | 'Lease';
  carCost?: number; // Purchase price or total lease cost (if applicable)
  monthlyPayment?: number; // Loan/Lease payment
  monthlyFuelChargingCost?: number;
  monthlyInsuranceCost?: number;
  monthlyMaintenanceCost?: number;
}

/**
 * Represents the costs associated with public transport and alternatives.
 */
export interface PublicTransportDetails {
  monthlyPassCost?: number;
  monthlyRideShareCost?: number;
  // Removed 'travel card costs' as potentially redundant with monthlyPassCost
}

/**
 * Represents the overall state of the Transportation module.
 */
export interface Transport {
  hasCar: boolean; // Main toggle for car ownership
  carDetails?: CarOwnershipDetails;
  publicTransportDetails: PublicTransportDetails;
} 