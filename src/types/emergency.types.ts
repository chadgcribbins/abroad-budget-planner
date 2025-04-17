export interface EmergencyBuffer {
  targetMonthsOfCoverage: number; // e.g., 3, 6, 12 months
  currentReserveAmount: number;
  calculatedFixedMonthlyExpenses: number; // Sum of all essential fixed monthly costs
  // Calculated runway (in months) will be derived, not stored here
} 