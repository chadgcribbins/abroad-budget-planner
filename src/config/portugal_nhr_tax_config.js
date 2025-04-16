/**
 * @file Configuration constants for Portugal's Non-Habitual Resident (NHR) tax regime.
 *
 * Note: These represent simplified assumptions for the MVP.
 * Real-world NHR application involves more complex rules regarding
 * Double Taxation Agreements (DTAs), source country taxation, and specific
 * income type classifications. Consult official documentation or a tax advisor
 * for precise calculations.
 */

/**
 * Enum-like object defining common income categories relevant to NHR.
 * Used to apply specific NHR tax rules based on income type and source.
 */
export const NHRIncomeTypes = Object.freeze({
  EMPLOYMENT_PT: 'EMPLOYMENT_PT', // Portuguese-sourced employment income
  SELF_EMPLOYMENT_PT: 'SELF_EMPLOYMENT_PT', // Portuguese-sourced self-employment income
  PENSION_FOREIGN: 'PENSION_FOREIGN', // Foreign-sourced pension income
  DIVIDENDS_FOREIGN: 'DIVIDENDS_FOREIGN', // Foreign-sourced dividends
  INTEREST_FOREIGN: 'INTEREST_FOREIGN', // Foreign-sourced interest
  RENTAL_FOREIGN: 'RENTAL_FOREIGN', // Foreign-sourced rental income
  CAPITAL_GAINS_FOREIGN: 'CAPITAL_GAINS_FOREIGN', // Foreign-sourced capital gains
  ROYALTIES_FOREIGN: 'ROYALTIES_FOREIGN', // Foreign-sourced royalties
  EMPLOYMENT_FOREIGN: 'EMPLOYMENT_FOREIGN', // Foreign-sourced employment income
  SELF_EMPLOYMENT_FOREIGN: 'SELF_EMPLOYMENT_FOREIGN', // Foreign-sourced self-employment income
  OTHER_FOREIGN: 'OTHER_FOREIGN', // Other foreign-sourced income (default exemption)
});

/**
 * Flat tax rate applied to Portuguese-sourced employment and self-employment income
 * under the NHR regime for high-value-added activities (simplified assumption).
 * @type {number}
 */
export const NHR_EMPLOYMENT_TAX_RATE = 0.20;

/**
 * Tax rate applied to foreign-sourced pension income under the NHR regime.
 * @type {number}
 */
export const NHR_FOREIGN_PENSION_TAX_RATE = 0.10;

/**
 * Default tax rate applied to most other foreign-sourced income types
 * (dividends, interest, royalties, capital gains, rental income, foreign employment/self-employment)
 * under the NHR regime, assuming the income *may* be taxed in the source country
 * under a DTA and is not from a listed tax haven.
 * MVP Simplification: Assumes exemption applies (0% rate).
 * @type {number}
 */
export const NHR_FOREIGN_INCOME_DEFAULT_TAX_RATE = 0.00;

// --- Social Security ---

/**
 * Standard employee contribution rate for Portuguese Social Security (Segurança Social),
 * typically applied to gross Portuguese-sourced employment income.
 * Note: Does not account for potential contribution caps or specific rules for self-employed.
 * @type {number}
 */
export const SOCIAL_SECURITY_EMPLOYEE_RATE = 0.11;

// --- Placeholders for Future Complexity ---

// Placeholder: Add logic/config for checking Double Taxation Agreements (DTAs)
// Real NHR exemption often depends on the specific DTA between Portugal and the source country.

// Placeholder: Add logic/config for checking against Portugal's "tax haven" list.
// Income from listed jurisdictions may not qualify for NHR exemptions.

// Placeholder: Define specific rates or rules for self-employment social security,
// which can differ from the standard employee rate. 