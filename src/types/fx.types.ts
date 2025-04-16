export interface FXSettings {
  source: 'API' | 'Manual';
  manualRates?: { [currencyCode: string]: number }; // User-defined rates relative to base currency
  // Sensitivity settings might be UI state rather than core data model
  // sensitivityShockPercentage?: number;
}

// Note: The actual exchange rates used in calculations are stored within the Income interface
// in this model definition (Income.exchangeRates). FXSettings controls how those rates are determined. 