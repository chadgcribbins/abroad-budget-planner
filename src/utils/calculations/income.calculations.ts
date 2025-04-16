import { Income, SalaryDetails, PassiveIncome, OneOffInflow } from '@/types/income.types';
import { calculatePortugalNHRTax } from './portugal_nhr_calculator.js';
// TODO: Import currency conversion utility

// --- Constants ---
const MONTHS_PER_YEAR = 12;

// --- Adapter Function ---

/**
 * Represents a normalized income stream for tax calculation purposes.
 */
interface NormalizedIncomeStream {
  id: string;
  type: 'salary' | 'passive' | 'one-off';
  sourceCountry: string; // e.g., 'PT', 'UK', 'US' - Crucial for NHR
  amount: number; // Annual amount in base currency (e.g., EUR)
  passiveType?: string; // e.g., 'rental', 'dividend', 'pension'
  originalCurrency?: string;
  originalAmount?: number;
}

/**
 * Adapts the application's Income state into a normalized array of
 * annual income streams suitable for tax calculators.
 *
 * @param {Income} incomeState - The income state object from IncomeContext.
 * @param {{ [currencyCode: string]: number }} exchangeRates - Exchange rates relative to the base currency.
 * @param {string} baseCurrency - The target currency for all amounts (e.g., 'EUR').
 * @param {string} originCountryCode - The user's origin country code (e.g., 'GB').
 * @param {string} destinationCountryCode - The user's destination country code (e.g., 'PT').
 * @returns {NormalizedIncomeStream[]} An array of normalized income streams.
 */
function adaptIncomeStateToStreams(
  incomeState: Income,
  exchangeRates: { [currencyCode: string]: number } | null | undefined,
  baseCurrency: string,
  originCountryCode: string,
  destinationCountryCode: string
): NormalizedIncomeStream[] {
  const streams: NormalizedIncomeStream[] = [];
  // const { exchangeRates } = incomeState; // Removed: Rates are passed in

  // TODO: Implement robust currency conversion using exchangeRates
  const convertToBaseCurrency = (amount: number, currency: string): number => {
      if (currency === baseCurrency) {
          return amount;
      }
      const rate = exchangeRates?.[currency];
      if (rate && rate !== 0) {
          // Assuming rates are FROM base currency TO foreign currency
          // So, foreign amount / rate = base amount
          return amount / rate;
      }
      console.warn(`Missing or invalid exchange rate for ${currency} to ${baseCurrency}. Cannot convert.`);
      return 0; // Or handle error appropriately
  };

  // --- Partner 1 Salary ---
  if (incomeState.partner1Salary) {
      const { amount, frequency, currency } = incomeState.partner1Salary;
      const annualAmount = frequency === 'Annual' ? amount : amount * MONTHS_PER_YEAR;
      const baseAmount = convertToBaseCurrency(annualAmount, currency);
      streams.push({
          id: 'partner1Salary',
          type: 'salary',
          // MVP Assumption: Partner 1 income source is Origin Country
          sourceCountry: originCountryCode,
          amount: baseAmount,
          originalAmount: annualAmount,
          originalCurrency: currency,
      });
  }

  // --- Partner 2 Salary ---
    if (incomeState.partner2Salary) {
      const { amount, frequency, currency } = incomeState.partner2Salary;
      const annualAmount = frequency === 'Annual' ? amount : amount * MONTHS_PER_YEAR;
      const baseAmount = convertToBaseCurrency(annualAmount, currency);
      streams.push({
          id: 'partner2Salary',
          type: 'salary',
          // MVP Assumption: Partner 2 income source is Destination Country
          sourceCountry: destinationCountryCode,
          amount: baseAmount,
          originalAmount: annualAmount,
          originalCurrency: currency,
      });
  }

  // --- Passive Income Streams ---
  incomeState.passiveIncomes?.forEach((pIncome) => {
      const { id, type: passiveType, amount, frequency, currency, sourceCountry } = pIncome;
      let annualAmount = 0;
      switch (frequency) {
          case 'Annual': annualAmount = amount; break;
          case 'Monthly': annualAmount = amount * MONTHS_PER_YEAR; break;
          case 'Quarterly': annualAmount = amount * 4; break;
          // Add other frequencies if necessary
          default: annualAmount = 0;
      }
      const baseAmount = convertToBaseCurrency(annualAmount, currency);
      streams.push({
          id,
          type: 'passive',
          // Use provided sourceCountry, default to origin if missing (Needs review)
          sourceCountry: sourceCountry || originCountryCode,
          amount: baseAmount,
          passiveType: passiveType || 'unknown',
          originalAmount: annualAmount,
          originalCurrency: currency,
      });
  });

  // --- One-Off Inflows ---
  incomeState.oneOffInflows?.forEach((oIncome) => {
      const { id, amount, currency, sourceCountry } = oIncome;
      // Assuming one-offs are annual amounts for the relevant year
      const baseAmount = convertToBaseCurrency(amount, currency);
      streams.push({
          id,
          type: 'one-off',
          // Use provided sourceCountry, default to origin if missing (Needs review)
          sourceCountry: sourceCountry || originCountryCode,
          amount: baseAmount,
          originalAmount: amount,
          originalCurrency: currency,
      });
  });

  return streams;
}


// --- PLACEHOLDERS ---
// Full implementation requires tax logic and currency conversion logic

/**
 * Calculates the total estimated annual net income, applying NHR logic if applicable.
 *
 * @param {Income} incomeState - The income state object.
 * @param {object} profileSettings - Object containing user profile settings.
 * @param {string} profileSettings.destinationCountry - e.g., 'PT'
 * @param {string} profileSettings.originCountry - e.g., 'GB'
 * @param {boolean} profileSettings.isNHRActive - Flag indicating if NHR regime is selected.
 * @param {{ [currencyCode: string]: number } | null | undefined} exchangeRates - Exchange rates object.
 * @param {string} baseCurrency - The base currency for calculations (e.g., 'EUR').
 * @returns {number} Total estimated annual net income in the base currency.
 */
export const calculateTotalAnnualNetIncome = (
    incomeState: Income,
    profileSettings: { destinationCountry: string; originCountry: string; isNHRActive: boolean },
    exchangeRates: { [currencyCode: string]: number } | null | undefined,
    baseCurrency: string
): number => {
    const { destinationCountry, originCountry, isNHRActive } = profileSettings;

    // Adapt income state to normalized streams
    const incomeStreams = adaptIncomeStateToStreams(
        incomeState,
        exchangeRates,
        baseCurrency,
        originCountry,
        destinationCountry
    );

    let totalAnnualNet = 0;

    // Check if NHR logic should be applied
    if (destinationCountry === 'PT' && isNHRActive) {
        console.log("Applying NHR Tax Logic...");
        const nhrResult = calculatePortugalNHRTax(incomeStreams);

        // Use the calculated net income from NHR logic
        totalAnnualNet = nhrResult.totalNetIncome;

        // Handle unprocessed streams (e.g., PT-sourced passive income)
        if (nhrResult.unprocessedStreams.length > 0) {
            console.warn("Some income streams were not processed by NHR calculator and need standard PT tax handling (MVP limitation):", nhrResult.unprocessedStreams);
            // TODO: Implement standard PT tax calculation for unprocessed streams
            // and add their net income to totalAnnualNet.
            // For now, their contribution to net income is ignored in this path.
        }
    } else {
        console.log("Applying Standard Tax Logic (Placeholder)...", { destinationCountry, isNHRActive });
        // TODO: Implement standard tax calculation logic for the destination country.
        // This requires fetching standard tax brackets, rules etc. for the destination country.
        // Placeholder: Sum gross amounts and apply a flat 30% tax rate for non-NHR.
        let totalGross = 0;
        incomeStreams.forEach(stream => totalGross += stream.amount);
        totalAnnualNet = totalGross * (1 - 0.30); // Example 30% flat tax
        console.warn('Standard tax calculation is a rough placeholder.');
    }

    return totalAnnualNet;
};

/**
 * Calculates the total estimated monthly net income.
 * Derives from the annual calculation.
 *
 * @param {Income} incomeState
 * @param {object} profileSettings
 * @param {{ [currencyCode: string]: number } | null | undefined} exchangeRates
 * @param {string} baseCurrency
 * @returns {number} Total estimated monthly net income in the base currency.
 */
export const calculateTotalMonthlyNetIncome = (
    incomeState: Income,
    profileSettings: { destinationCountry: string; originCountry: string; isNHRActive: boolean },
    exchangeRates: { [currencyCode: string]: number } | null | undefined,
    baseCurrency: string
): number => {
    const annualNet = calculateTotalAnnualNetIncome(incomeState, profileSettings, exchangeRates, baseCurrency);
    return annualNet / MONTHS_PER_YEAR;
};

// --- Keep other calculation functions like calculateTotalAnnualGrossIncome if needed ---
// Or refactor Gross Income calculation to use the adapter result as well
export const calculateTotalAnnualGrossIncome = (
    incomeState: Income,
    exchangeRates: { [currencyCode: string]: number } | null | undefined,
    baseCurrency: string
): number => {
    // Adapt income state to normalized streams just to sum amounts easily
    // (Ignoring origin/destination for gross calc)
    const incomeStreams = adaptIncomeStateToStreams(incomeState, exchangeRates, baseCurrency, '', '');
    let totalGross = 0;
    incomeStreams.forEach(stream => totalGross += stream.amount);
     console.warn('calculateTotalAnnualGrossIncome sums adapted streams, check consistency.');
    return totalGross;
}; 