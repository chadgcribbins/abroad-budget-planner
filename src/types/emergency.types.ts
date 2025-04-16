export interface EmergencyBuffer {
  targetMonthsOfCoverage: number; // e.g., 3, 6, 12 months
  currentReserveAmount: number;
  // Calculated runway (in months) will be derived, not stored here
} 