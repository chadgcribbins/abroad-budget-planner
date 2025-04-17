/**
 * @file Defines TypeScript types for Utilities module state.
 */

// Represents the state shape needed for calculations,
// mirrors the state managed in AppBudgetContext or page.tsx initially.
export interface UtilitiesState {
  electricity?: number | '';
  isSeasonalElectricity?: boolean;
  electricityWinter?: number | '';
  electricitySpring?: number | '';
  electricitySummer?: number | '';
  electricityFall?: number | '';
  water?: number | '';
  gasHeating?: number | '';
  isSeasonalGasHeating?: boolean;
  gasHeatingWinter?: number | '';
  gasHeatingSpring?: number | '';
  gasHeatingSummer?: number | '';
  gasHeatingFall?: number | '';
  internet?: number | '';
  mobile?: number | '';
}

export interface Utilities {
  monthlyElectricity?: number;
  monthlyWater?: number;
  monthlyGasHeating?: number; // Or other heating fuel
  monthlyInternet?: number;
  monthlyMobilePhone?: number;
  monthlyGroceriesHousehold?: number; // Moved from Lifestyle for clarity
  monthlyWasteDisposal?: number; // If applicable and not included elsewhere
} 