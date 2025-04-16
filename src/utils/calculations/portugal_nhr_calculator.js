import {
  NHRIncomeTypes,
  NHR_EMPLOYMENT_TAX_RATE,
  NHR_FOREIGN_PENSION_TAX_RATE,
  NHR_FOREIGN_INCOME_DEFAULT_TAX_RATE,
  SOCIAL_SECURITY_EMPLOYEE_RATE,
} from '../../config/portugal_nhr_tax_config.js';

/**
 * @file Core calculation functions for Portugal's NHR tax regime (Simplified MVP).
 */

/**
 * Calculates the estimated Social Security contributions for Portuguese-sourced
 * employment income under simplified assumptions.
 *
 * MVP Simplification: Assumes the standard employee rate applies directly to gross income
 * without considering caps, minimums, or specific self-employment rules.
 *
 * @param {number} grossEmploymentIncome - Gross annual income from Portuguese employment.
 * @returns {number} Estimated annual Social Security contributions.
 */
export function calculateSocialSecurityContributions(grossEmploymentIncome) {
  if (grossEmploymentIncome <= 0) {
    return 0;
  }
  // Basic calculation for MVP
  return grossEmploymentIncome * SOCIAL_SECURITY_EMPLOYEE_RATE;
}

/**
 * Calculates the estimated income tax and net income for Portuguese-sourced
 * employment income under the NHR flat rate.
 *
 * MVP Simplification: Assumes the 20% flat rate applies directly to gross income.
 * Calculates SS separately and subtracts both from gross to get net.
 * Does not account for specific deductions beyond SS (simplified).
 *
 * @param {number} grossEmploymentIncome - Gross annual income from Portuguese employment.
 * @returns {{tax: number, socialSecurity: number, netIncome: number}} Object containing calculated tax, social security, and net income.
 */
export function calculateNHREmploymentIncome(grossEmploymentIncome) {
  if (grossEmploymentIncome <= 0) {
    return { tax: 0, socialSecurity: 0, netIncome: 0 };
  }

  const socialSecurity = calculateSocialSecurityContributions(grossEmploymentIncome);
  const tax = grossEmploymentIncome * NHR_EMPLOYMENT_TAX_RATE;
  const netIncome = grossEmploymentIncome - tax - socialSecurity;

  return { tax, socialSecurity, netIncome };
}

/**
 * Calculates the estimated income tax and net income for various types of foreign-sourced
 * passive income under the NHR regime.
 *
 * MVP Simplification: Applies 10% to foreign pensions and 0% (exemption) to most other
 * common foreign income types (dividends, interest, rent, etc.), assuming NHR conditions are met.
 * Does not calculate or consider social security on foreign income.
 *
 * @param {number} grossPassiveIncome - Gross annual income from the foreign passive source.
 * @param {string} incomeType - The type of income, matching a value from NHRIncomeTypes enum (e.g., NHRIncomeTypes.PENSION_FOREIGN).
 * @returns {{tax: number, netIncome: number}} Object containing calculated tax and net income.
 */
export function calculateNHRPassiveIncome(grossPassiveIncome, incomeType) {
  if (grossPassiveIncome <= 0) {
    return { tax: 0, netIncome: 0 };
  }

  let taxRate = NHR_FOREIGN_INCOME_DEFAULT_TAX_RATE; // Default to 0%

  switch (incomeType) {
    case NHRIncomeTypes.PENSION_FOREIGN:
      taxRate = NHR_FOREIGN_PENSION_TAX_RATE;
      break;
    // Add cases for other specific foreign income types if they have non-default rates
    // For MVP, most foreign income falls under the default exemption (0%)
    case NHRIncomeTypes.DIVIDENDS_FOREIGN:
    case NHRIncomeTypes.INTEREST_FOREIGN:
    case NHRIncomeTypes.RENTAL_FOREIGN:
    case NHRIncomeTypes.CAPITAL_GAINS_FOREIGN:
    case NHRIncomeTypes.ROYALTIES_FOREIGN:
    case NHRIncomeTypes.EMPLOYMENT_FOREIGN: // Assuming foreign employment income is exempt in MVP
    case NHRIncomeTypes.SELF_EMPLOYMENT_FOREIGN: // Assuming foreign self-employment income is exempt in MVP
    case NHRIncomeTypes.OTHER_FOREIGN:
      taxRate = NHR_FOREIGN_INCOME_DEFAULT_TAX_RATE;
      break;
    // Note: Portuguese-sourced passive income would need different handling (outside NHR specific rules)
    default:
      console.warn(`Unhandled income type for NHR passive calculation: ${incomeType}. Applying default rate.`);
      taxRate = NHR_FOREIGN_INCOME_DEFAULT_TAX_RATE;
      break;
  }

  const tax = grossPassiveIncome * taxRate;
  const netIncome = grossPassiveIncome - tax;

  return { tax, netIncome };
}

// Placeholder for future helper functions (e.g., deductions, specific income type handling)

// --- Income Classification and Routing ---

/**
 * Maps an application income stream to an NHR Income Type category.
 *
 * MVP Simplification: Makes broad assumptions based on source and type.
 * Does not handle detailed NHR qualification criteria (e.g., high-value activity,
 * DTA specifics, tax haven checks).
 *
 * Assumed incomeStream structure:
 * {
 *   type: 'salary' | 'passive' | 'one-off',
 *   sourceCountry: string, // e.g., 'PT', 'UK', 'US'
 *   passiveType?: string // e.g., 'rental', 'dividend', 'pension' (if type is 'passive')
 * }
 *
 * @param {object} incomeStream - The income stream object from the application.
 * @returns {string | null} The corresponding NHRIncomeTypes value, or null if unclassifiable.
 */
function classifyIncomeStream(incomeStream) {
  const { type, sourceCountry, passiveType } = incomeStream;
  const isPortugueseSource = sourceCountry === 'PT';

  switch (type) {
    case 'salary':
      // MVP assumes all PT salary is NHR-eligible employment income
      // and all foreign salary is exempt.
      return isPortugueseSource
        ? NHRIncomeTypes.EMPLOYMENT_PT
        : NHRIncomeTypes.EMPLOYMENT_FOREIGN;

    case 'passive':
      if (isPortugueseSource) {
        // MVP Limitation: Handling PT-sourced passive income is complex and outside
        // the simplified NHR calc scope. Might be taxed at standard PT rates.
        console.warn(`Portuguese-sourced passive income (${passiveType}) classification not handled in NHR MVP.`);
        return null; // Indicate it needs standard handling, not NHR specific calc
      }
      // Foreign-sourced passive income
      switch (passiveType) {
        case 'pension':
          return NHRIncomeTypes.PENSION_FOREIGN;
        case 'dividend':
          return NHRIncomeTypes.DIVIDENDS_FOREIGN;
        case 'interest':
          return NHRIncomeTypes.INTEREST_FOREIGN;
        case 'rental':
          return NHRIncomeTypes.RENTAL_FOREIGN;
        // Add other specific passive types if needed
        default:
          console.warn(`Unknown foreign passive income type: ${passiveType}. Applying default exemption.`);
          return NHRIncomeTypes.OTHER_FOREIGN; // Default to exempt
      }

    case 'one-off':
      // MVP Simplification: Treat foreign one-offs as exempt (like capital gains/other)
      // and PT-sourced one-offs potentially like employment income (needs refinement).
      // This is a rough assumption for now.
      console.warn(`'one-off' income classification is highly simplified in NHR MVP.`);
      return isPortugueseSource
        ? NHRIncomeTypes.EMPLOYMENT_PT // Tentative: needs proper rule
        : NHRIncomeTypes.OTHER_FOREIGN; // Assume exempt if foreign

    default:
      console.error(`Unknown income stream type: ${type}`);
      return null;
  }
}

/**
 * Takes an income stream, classifies it, and routes it to the appropriate
 * NHR tax calculation function.
 *
 * @param {object} incomeStream - The income stream object from the application, including an `amount` field.
 * @returns {object | null} The result from the corresponding calculation function ({ tax, netIncome, socialSecurity? }), or null if classification fails or NHR doesn't apply.
 */
export function calculateTaxForIncomeStream(incomeStream) {
  const nhrType = classifyIncomeStream(incomeStream);

  if (!nhrType) {
    // Income stream couldn't be classified for NHR or NHR doesn't apply (e.g., PT passive)
    // It might need handling by a standard Portugal tax calculator.
    return null;
  }

  const { amount } = incomeStream;
  if (amount == null || amount <= 0) {
    return { tax: 0, netIncome: 0, socialSecurity: 0 };
  }

  switch (nhrType) {
    case NHRIncomeTypes.EMPLOYMENT_PT:
      // Assuming one-offs classified as EMPLOYMENT_PT also use this calc for MVP
      return calculateNHREmploymentIncome(amount);

    case NHRIncomeTypes.PENSION_FOREIGN:
    case NHRIncomeTypes.DIVIDENDS_FOREIGN:
    case NHRIncomeTypes.INTEREST_FOREIGN:
    case NHRIncomeTypes.RENTAL_FOREIGN:
    case NHRIncomeTypes.CAPITAL_GAINS_FOREIGN: // Assuming implicitly handled by OTHER_FOREIGN default
    case NHRIncomeTypes.ROYALTIES_FOREIGN: // Assuming implicitly handled by OTHER_FOREIGN default
    case NHRIncomeTypes.EMPLOYMENT_FOREIGN:
    case NHRIncomeTypes.SELF_EMPLOYMENT_FOREIGN: // Assuming implicitly handled by OTHER_FOREIGN default
    case NHRIncomeTypes.OTHER_FOREIGN:
      // All these use the passive calculation function in MVP
      const passiveResult = calculateNHRPassiveIncome(amount, nhrType);
      return { ...passiveResult, socialSecurity: 0 }; // Add SS field for consistent return shape

    // NHRIncomeTypes.SELF_EMPLOYMENT_PT needs its own handling (outside MVP scope)

    default:
      console.error(`No calculation route found for NHR type: ${nhrType}`);
      return null;
  }
}

// --- Aggregate Calculator ---

/**
 * Processes an array of income streams, applies NHR tax calculations where applicable,
 * and returns aggregated totals and a breakdown.
 *
 * @param {Array<object>} incomeStreams - An array of income stream objects.
 *        Each object should match the structure expected by `classifyIncomeStream`,
 *        including an `amount` field.
 * @returns {{totalGrossIncome: number, totalTaxPayable: number, totalSocialSecurity: number, totalNetIncome: number, breakdown: Array<object>, unprocessedStreams: Array<object>}}
 *          An object containing aggregated tax figures, net income, a detailed breakdown
 *          per processed stream, and a list of streams not processed by this NHR calculator.
 */
export function calculatePortugalNHRTax(incomeStreams) {
  let totalGrossIncome = 0;
  let totalTaxPayable = 0;
  let totalSocialSecurity = 0;
  const breakdown = [];
  const unprocessedStreams = [];

  if (!Array.isArray(incomeStreams)) {
    console.error('calculatePortugalNHRTax expects an array of income streams.');
    // Return default zero values in a shape consistent with the expected output
    return {
      totalGrossIncome: 0,
      totalTaxPayable: 0,
      totalSocialSecurity: 0,
      totalNetIncome: 0,
      breakdown: [],
      unprocessedStreams: [],
    };
  }

  for (const stream of incomeStreams) {
    const calculationResult = calculateTaxForIncomeStream(stream);

    if (calculationResult) {
      // NHR calculation was successful for this stream
      const grossAmount = stream.amount || 0;
      totalGrossIncome += grossAmount;
      totalTaxPayable += calculationResult.tax || 0;
      totalSocialSecurity += calculationResult.socialSecurity || 0;

      breakdown.push({
        ...stream, // Include original stream details
        calculatedTax: calculationResult.tax || 0,
        calculatedSocialSecurity: calculationResult.socialSecurity || 0,
        calculatedNetIncome: calculationResult.netIncome || 0,
        nhrClassification: classifyIncomeStream(stream), // Re-classify to store it
      });
    } else {
      // NHR calculation did not apply or failed for this stream
      unprocessedStreams.push(stream);
      // Optionally, add the gross amount to a separate total if needed
      // for standard tax calculations later.
    }
  }

  // Calculate final total net income based on aggregated figures
  const totalNetIncome = totalGrossIncome - totalTaxPayable - totalSocialSecurity;

  return {
    totalGrossIncome,
    totalTaxPayable,
    totalSocialSecurity,
    totalNetIncome,
    breakdown, // Detailed results per processed stream
    unprocessedStreams, // Streams needing standard PT tax handling
  };
} 