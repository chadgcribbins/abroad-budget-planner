'use client';

import React, { useMemo } from 'react';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useAppBudget } from '@/context/AppBudgetContext'; // Import budget context
import { useEmergencyBuffer } from '@/context/EmergencyBufferContext'; // Import emergency buffer context
import { calculateTotalAnnualNetIncome } from '@/utils/calculations/income.calculations';
import { calculateTotalFixedMonthlyExpenses, calculateTotalAnnualEducationCost, calculateMonthlyMortgage } from '@/utils/budgetCalculations'; // Fixed import path
import { formatDualCurrency } from '@/utils/formatting';
import { formatCurrency } from '@/utils/currencyUtils';
import { calculateEquivalentValue } from '@/utils/transformations/currency.transformations'; // Import the calculation utility
import { useTransport } from '@/context/TransportContext'; // Need for expense calc
import { useLifestyle } from '@/context/LifestyleContext'; // Need for expense calc
// TODO: Import expense calculations when implemented
// Import necessary types for expense calculation
import type { HousingState } from '@/types/housing.types'; // <-- ADDED
import type { UtilitiesState } from '@/types/utilities.types'; // <-- ADDED

// We need the type for the breakdown items returned by the calculator
// Let's define a simplified version here or import if defined elsewhere
interface IncomeBreakdownItem {
  id?: string;
  type?: string;
  passiveType?: string;
  sourceCountry?: string;
  amount?: number;
  nhrClassification?: string | null;
  calculatedTax?: number;
  calculatedSocialSecurity?: number;
  calculatedNetIncome?: number;
  originalCurrency?: string; // Added for unprocessed display
}

interface ProfileSettings {
  destinationCountry: string | null;
  originCountry: string | null;
  isNHRActive: boolean; // Derived from selectedRegime
}

interface BudgetSummaryDisplayProps {
  profileSettings: ProfileSettings;
  // Removed FX props - will use context hook
  // originCurrency: string;
  // destinationCurrency: string;
  // effectiveRate: number | null;
}

const BudgetSummaryDisplay: React.FC<BudgetSummaryDisplayProps> = ({ 
  profileSettings, 
  // Removed FX props
}) => {
  const { state: incomeState } = useIncome();
  const { state: appBudgetState } = useAppBudget();
  const { state: emergencyBufferState } = useEmergencyBuffer(); // <-- Re-add hook call
  const { state: transportState } = useTransport(); // Need for expense calc
  const { state: lifestyleState } = useLifestyle(); // Need for expense calc
  // Get currency context
  const {
    // rates: exchangeRates, // Keep if needed for fallback conversion logic in calculations
    isLoading: currencyLoading, 
    originCurrency, 
    targetCurrency, 
    effectiveRate, // Rate including simulation
    fetchedRate,   // API rate
    manualRate,    // Manual override value (string)
    isManualOverrideEnabled, // Is manual override active?
    fxSimulationPercentage, // The simulation percentage (-25 to +25)
    // convertCurrency // Keep if needed for fallback
  } = useCurrency();

  // --- Determine Baseline Rate (without simulation) --- 
  const baselineRate = useMemo(() => {
    if (isManualOverrideEnabled) {
      // Ensure manualRate is treated as a string for parseFloat
      const parsedManual = parseFloat(String(manualRate)); 
      if (!isNaN(parsedManual) && parsedManual > 0) {
        return parsedManual;
      }
    }
    return fetchedRate; // Fallback to fetched API rate
  }, [isManualOverrideEnabled, manualRate, fetchedRate]);

  // --- Calculation Calls (Baseline vs. Simulated) --- 
  // TODO: Refactor calculateTotalAnnualNetIncome to accept rate explicitly 
  //       instead of relying solely on context, OR confirm it uses the passed rate.
  //       For now, assume it uses the rate passed as the last argument.

  const baselineTotalAnnualNetIncome = useMemo(() => calculateTotalAnnualNetIncome(
    incomeState,
    {
        // Provide defaults for potentially null values
        destinationCountry: profileSettings.destinationCountry ?? '',
        originCountry: profileSettings.originCountry ?? '',
        isNHRActive: profileSettings.isNHRActive,
    },
    null,
    targetCurrency, 
    originCurrency, 
    baselineRate
  ), [incomeState, profileSettings, targetCurrency, originCurrency, baselineRate]);

  // --- Baseline Expense Calculation (Directly using required states) --- 
  const baselineTotalAnnualExpenses = useMemo(() => {
      // Prepare state slices for the calculation function
      const housingState: HousingState = {
        isBuying: appBudgetState.isBuying,
        monthlyRent: appBudgetState.monthlyRent,
        propertyPrice: appBudgetState.propertyPrice,
        downPaymentPercentage: appBudgetState.downPaymentPercentage,
        mortgageTermYears: appBudgetState.mortgageTermYears,
        mortgageInterestRate: appBudgetState.mortgageInterestRate,
        annualMaintenance: appBudgetState.annualMaintenance,
        annualInsurance: appBudgetState.annualInsurance,
        annualPropertyTax: appBudgetState.annualPropertyTax,
        futureUpgradeCost: appBudgetState.futureUpgradeCost, 
      };
      const utilitiesState: UtilitiesState = {
          electricity: appBudgetState.electricity,
          isSeasonalElectricity: appBudgetState.isSeasonalElectricity,
          electricityWinter: appBudgetState.electricityWinter,
          electricitySpring: appBudgetState.electricitySpring,
          electricitySummer: appBudgetState.electricitySummer,
          electricityFall: appBudgetState.electricityFall,
          water: appBudgetState.water,
          gasHeating: appBudgetState.gasHeating,
          isSeasonalGasHeating: appBudgetState.isSeasonalGasHeating,
          gasHeatingWinter: appBudgetState.gasHeatingWinter,
          gasHeatingSpring: appBudgetState.gasHeatingSpring,
          gasHeatingSummer: appBudgetState.gasHeatingSummer,
          gasHeatingFall: appBudgetState.gasHeatingFall,
          internet: appBudgetState.internet,
          mobile: appBudgetState.mobile,
      };

      const monthlyExpenses = calculateTotalFixedMonthlyExpenses(
          housingState,
          utilitiesState,
          transportState, // from useTransport hook
          appBudgetState.healthcareState, // from useAppBudget hook
          appBudgetState.educationState,  // from useAppBudget hook
          lifestyleState  // from useLifestyle hook
      );
      return monthlyExpenses * 12;
  }, [appBudgetState, transportState, lifestyleState]); // Dependencies updated

  const baselineDisposable = baselineTotalAnnualNetIncome - baselineTotalAnnualExpenses;

  // --- Simulated Values (Apply FX simulation only if active) ---
  const simulationMultiplier = 1 + (fxSimulationPercentage / 100);
  
  // For simplicity, simulate by applying multiplier to baseline. 
  // More accurate would be recalculating with simulated rate.
  // TODO: Refactor income/expense calcs to accept rate for simulation.
  const simulatedTotalAnnualNetIncome = fxSimulationPercentage !== 0 
      ? baselineTotalAnnualNetIncome * simulationMultiplier // Simplified simulation
      : baselineTotalAnnualNetIncome;
  const simulatedTotalAnnualExpenses = fxSimulationPercentage !== 0
      ? baselineTotalAnnualExpenses * simulationMultiplier // Simplified simulation
      : baselineTotalAnnualExpenses;
  const simulatedDisposable = simulatedTotalAnnualNetIncome - simulatedTotalAnnualExpenses;
  const monthlyDisposable = simulatedDisposable / 12;

  // --- Required Gross Income Estimation (Simplified NHR) ---
  const ESTIMATED_NHR_EFFECTIVE_RATE = 0.28; // Placeholder for 20% tax + ~8% SS avg?
  let requiredGrossIncome = 0;
  let grossIncomeCalculationNote = `Estimated gross income needed to cover annual expenses (${formatCurrency(baselineTotalAnnualExpenses, targetCurrency)})`;

  if (profileSettings.isNHRActive && profileSettings.destinationCountry === 'PT') {
      if (baselineTotalAnnualExpenses > 0) {
           requiredGrossIncome = baselineTotalAnnualExpenses / (1 - ESTIMATED_NHR_EFFECTIVE_RATE);
           grossIncomeCalculationNote += ` assuming ~${(ESTIMATED_NHR_EFFECTIVE_RATE * 100).toFixed(0)}% effective tax/SS burden under NHR.`;
      } else {
          grossIncomeCalculationNote += ` (Expenses are zero).`;
      }
  } else {
      requiredGrossIncome = NaN; // Indicate calculation not available
       grossIncomeCalculationNote = `Calculation currently only available for Portugal NHR regime.`;
  }

  // --- School Cost Analysis Calculation ---
  const annualNetSchoolCost = useMemo(() => {
    // Pass only the education part of the appBudgetState
    return calculateTotalAnnualEducationCost(appBudgetState.educationState);
  }, [appBudgetState.educationState]);

  let requiredGrossSchoolCost = 0;
  let schoolCostAnalysisNote = `Estimated gross income needed to cover the net annual school cost (${formatCurrency(annualNetSchoolCost, targetCurrency)})`;
  const monthlyNetSchoolCost = annualNetSchoolCost / 12;

  if (profileSettings.isNHRActive && profileSettings.destinationCountry === 'PT') {
      if (annualNetSchoolCost > 0) {
          requiredGrossSchoolCost = annualNetSchoolCost / (1 - ESTIMATED_NHR_EFFECTIVE_RATE);
          schoolCostAnalysisNote += ` assuming ~${(ESTIMATED_NHR_EFFECTIVE_RATE * 100).toFixed(0)}% effective tax/SS burden under NHR.`;
      } else {
          schoolCostAnalysisNote = `No private school costs entered.`;
      }
  } else {
      requiredGrossSchoolCost = NaN; // Indicate calculation not available
      if (annualNetSchoolCost > 0) {
          schoolCostAnalysisNote = `Net annual school cost is ${formatCurrency(annualNetSchoolCost, targetCurrency)}. 'Felt Cost' estimation currently only available for Portugal NHR.`;
      } else {
          schoolCostAnalysisNote = `No private school costs entered.`;
      }
  }

  // --- Rent vs Buy Comparison Calculations ---
  const { 
      isBuying, monthlyRent, 
      propertyPrice, downPaymentPercentage, mortgageTermYears, mortgageInterestRate,
      annualMaintenance, annualInsurance, annualPropertyTax
  } = appBudgetState; // Destructure housing state

  const rentMonthlyCost = useMemo(() => Number(monthlyRent ?? 0), [monthlyRent]);
  const rentUpfrontCost = useMemo(() => rentMonthlyCost * 2, [rentMonthlyCost]); // Placeholder: deposit + 1st month

  const buyMonthlyMortgage = useMemo(() => calculateMonthlyMortgage(
      propertyPrice, downPaymentPercentage, mortgageTermYears, mortgageInterestRate
  ), [propertyPrice, downPaymentPercentage, mortgageTermYears, mortgageInterestRate]);

  const buyAnnualCosts = useMemo(() => 
      (Number(annualMaintenance ?? 0) + Number(annualInsurance ?? 0) + Number(annualPropertyTax ?? 0)),
      [annualMaintenance, annualInsurance, annualPropertyTax]
  );

  const buyMonthlyTotalCost = useMemo(() => 
      buyMonthlyMortgage + (buyAnnualCosts / 12),
      [buyMonthlyMortgage, buyAnnualCosts]
  );

  const buyDownPaymentAmount = useMemo(() => {
      const price = Number(propertyPrice ?? 0);
      const percent = Number(downPaymentPercentage ?? 0);
      return price > 0 && percent > 0 ? price * (percent / 100) : 0;
  }, [propertyPrice, downPaymentPercentage]);
  // Note: Excluding other closing costs for simplicity
  const buyUpfrontCost = buyDownPaymentAmount; 

  if (currencyLoading) {
    return <div className="mt-6 p-4 border rounded-lg shadow bg-base-100 text-center"><span className="loading loading-dots loading-md"></span></div>;
  }
  
   // Don't render full summary if currencies aren't ready
   if (!originCurrency || !targetCurrency) {
     return (
       <div className="mt-6 p-4 border rounded-lg shadow bg-base-100">
         <h2 className="text-2xl font-semibold mb-4">Budget Summary</h2>
         <p className="text-sm text-gray-500 italic">Select origin and destination countries to view summary.</p>
       </div>
     );
   }

  const taxRegimeUsed = profileSettings.isNHRActive && profileSettings.destinationCountry === 'PT' ? 'NHR' : 'Standard (Placeholder)';

  return (
    <div className="mt-6 space-y-6">
      <h2 className="text-3xl font-semibold mb-4">Budget Summary Dashboard</h2>
      
      {/* Row 1: Key Metrics */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-primary text-primary-content">
        <div className="stat" title={`Calculation based on ${taxRegimeUsed} rules. ${fxSimulationPercentage !== 0 ? `Includes ${fxSimulationPercentage}% FX simulation.` : ''}`}>
          <div className="stat-title">Est. Annual Net Income</div>
          <div className="stat-value whitespace-normal text-2xl"> 
            {formatDualCurrency(simulatedTotalAnnualNetIncome, targetCurrency, originCurrency, effectiveRate).destination}
          </div>
          <div className="stat-desc">{formatDualCurrency(simulatedTotalAnnualNetIncome, targetCurrency, originCurrency, effectiveRate).origin}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Annual Expenses</div>
          <div className="stat-value whitespace-normal text-2xl"> 
            {formatDualCurrency(simulatedTotalAnnualExpenses, targetCurrency, originCurrency, effectiveRate).destination}
          </div>
           <div className="stat-desc">{formatDualCurrency(simulatedTotalAnnualExpenses, targetCurrency, originCurrency, effectiveRate).origin}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Disposable (Annual / Monthly)</div>
           <div className={`stat-value whitespace-normal text-2xl ${simulatedDisposable >= 0 ? '' : 'text-error-content'}`}> 
            {formatDualCurrency(simulatedDisposable, targetCurrency, originCurrency, effectiveRate).destination}
           </div>
           <div className="stat-desc">
                {formatDualCurrency(simulatedDisposable, targetCurrency, originCurrency, effectiveRate).origin}
                 / {formatCurrency(monthlyDisposable, targetCurrency)} Monthly
           </div>
        </div>
      </div>

      {/* Row 2: Planning Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Required Gross Income Card */}
          <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                  <h3 className="card-title text-lg">Required Gross Income</h3>
                  <p className="text-2xl font-bold">
                      {isNaN(requiredGrossIncome) 
                          ? "N/A" 
                          : formatDualCurrency(requiredGrossIncome, targetCurrency, originCurrency, baselineRate).destination
                      }
                  </p>
                   {/* Display origin currency equivalent if calculation was successful */}
                  {!isNaN(requiredGrossIncome) && (
                      <p className="text-sm font-normal">
                          {` / ${formatDualCurrency(requiredGrossIncome, targetCurrency, originCurrency, baselineRate).origin}`}
                      </p>
                  )}
                  <p className="text-xs text-base-content/70 mt-1">{grossIncomeCalculationNote}</p>
              </div>
          </div>

           {/* Emergency Buffer Card - Use emergencyBufferState */}
          <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                  <h3 className="card-title text-lg">Emergency Buffer</h3>
                   <p className="text-2xl font-bold">
                      {isFinite(emergencyBufferState.calculatedFixedMonthlyExpenses > 0 ? (emergencyBufferState.currentReserveAmount / emergencyBufferState.calculatedFixedMonthlyExpenses) : Infinity) 
                        ? `${(emergencyBufferState.currentReserveAmount / emergencyBufferState.calculatedFixedMonthlyExpenses).toFixed(1)} Months`
                        : 'N/A' }
                   </p>
                  <p className="text-xs text-base-content/70">
                      Current runway based on saved reserve ({formatCurrency(emergencyBufferState.currentReserveAmount, targetCurrency)}) and monthly costs ({formatCurrency(emergencyBufferState.calculatedFixedMonthlyExpenses, targetCurrency)}).
                  </p>
              </div>
          </div>
          
          {/* Placeholder Card */}
          <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                  <h3 className="card-title text-lg">Placeholder Insight</h3>
                   <p className="text-2xl font-bold">[Data Here]</p>
                  <p className="text-xs text-base-content/70">More insights coming soon.</p>
              </div>
          </div>
      </div>

      {/* Row 3: Scenario Analysis (Tabs or Accordion?) */}
       <div className="card bg-base-100 shadow-md">
          <div className="card-body">
             <div role="tablist" className="tabs tabs-lifted">
                  <input type="radio" name="summary_tabs" role="tab" className="tab" aria-label="FX Impact" defaultChecked />
                  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                       {/* --- FX Simulation Impact Section --- */}
                      {fxSimulationPercentage !== 0 ? (
                        <div className="">
                          <h3 className="text-lg font-semibold text-info-content mb-3">
                            FX Simulation Impact ({fxSimulationPercentage > 0 ? '+':''}{fxSimulationPercentage}% Change)
                          </h3>
                          <div className="overflow-x-auto">
                                <table className="table table-sm w-full text-sm">
                                <thead>
                                    <tr className="bg-base-200">
                                    <th>Metric</th>
                                    <th>Baseline Value ({targetCurrency})</th>
                                    <th>Simulated Value ({targetCurrency})</th>
                                    <th>Difference ({targetCurrency})</th>
                                    <th>Difference (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[ 
                                    { label: 'Total Net Income', baseline: baselineTotalAnnualNetIncome, simulated: simulatedTotalAnnualNetIncome },
                                    { label: 'Total Expenses', baseline: baselineTotalAnnualExpenses, simulated: simulatedTotalAnnualExpenses },
                                    { label: 'Disposable Income', baseline: baselineDisposable, simulated: simulatedDisposable },
                                    ].map(item => {
                                    const diff = item.simulated - item.baseline;
                                    const percDiff = item.baseline !== 0 ? (diff / Math.abs(item.baseline)) * 100 : (diff !== 0 ? Infinity : 0);
                                    const diffText = formatDualCurrency(diff, targetCurrency, originCurrency, baselineRate);
                                    
                                    return (
                                        <tr key={item.label}>
                                        <td className="font-medium">{item.label}</td>
                                        <td>{formatDualCurrency(item.baseline, targetCurrency, originCurrency, baselineRate).destination}</td>
                                        <td>{formatDualCurrency(item.simulated, targetCurrency, originCurrency, effectiveRate).destination}</td>
                                        <td className={`${diff >= 0 ? 'text-success' : 'text-error'} font-medium`}>{diffText.destination}</td>
                                        <td className={`${diff >= 0 ? 'text-success' : 'text-error'} font-medium`}>{percDiff !== Infinity ? `${percDiff.toFixed(1)}%` : 'N/A'}</td>
                                        </tr>
                                    );
                                    })}
                                </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 italic">
                                    Baseline calculated using rate: {baselineRate?.toFixed(4)}. Simulated using rate: {effectiveRate?.toFixed(4)}.
                            </p>
                        </div>
                      ) : (
                          <p className="text-sm italic text-base-content/70">Enable FX Simulation via the FX Settings module to see impact analysis here.</p>
                      )}
                  </div>

                  <input type="radio" name="summary_tabs" role="tab" className="tab" aria-label="Rent vs Buy" />
                  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                      <h3 className="text-lg font-semibold mb-3">Rent vs. Buy Comparison</h3>
                      {(rentMonthlyCost > 0 || buyMonthlyTotalCost > 0) ? (
                          <div className="overflow-x-auto">
                              <table className="table table-sm w-full text-sm">
                                  <thead>
                                      <tr className="bg-base-200">
                                          <th>Metric</th>
                                          <th>Renting</th>
                                          <th>Buying</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr>
                                          <td className="font-medium">Est. Monthly Cost</td>
                                          <td>{formatDualCurrency(rentMonthlyCost, targetCurrency, originCurrency, baselineRate).destination}</td>
                                          <td>{formatDualCurrency(buyMonthlyTotalCost, targetCurrency, originCurrency, baselineRate).destination}</td>
                                      </tr>
                                       <tr>
                                          <td className="font-medium"></td>
                                          <td className="text-xs text-base-content/60">({formatDualCurrency(rentMonthlyCost, targetCurrency, originCurrency, baselineRate).origin})</td>
                                          <td className="text-xs text-base-content/60">({formatDualCurrency(buyMonthlyTotalCost, targetCurrency, originCurrency, baselineRate).origin})</td>
                                      </tr>
                                      <tr>
                                          <td className="font-medium">Est. Upfront Cost</td>
                                          <td>{formatDualCurrency(rentUpfrontCost, targetCurrency, originCurrency, baselineRate).destination}</td>
                                          <td>{formatDualCurrency(buyUpfrontCost, targetCurrency, originCurrency, baselineRate).destination}</td>
                                      </tr>
                                       <tr>
                                          <td className="font-medium"></td>
                                          <td className="text-xs text-base-content/60">({formatDualCurrency(rentUpfrontCost, targetCurrency, originCurrency, baselineRate).origin})</td>
                                          <td className="text-xs text-base-content/60">({formatDualCurrency(buyUpfrontCost, targetCurrency, originCurrency, baselineRate).origin})</td>
                                      </tr>
                                  </tbody>
                              </table>
                               <p className="text-xs text-gray-600 mt-2 italic">
                                   Rent upfront assumes 1 month deposit + 1st month rent. Buy upfront assumes down payment only (excluding closing costs).
                              </p>
                          </div>
                      ) : (
                          <p className="text-sm italic text-base-content/70">Enter housing details (Rent or Buy) to see comparison.</p>
                      )}
                  </div>

                  <input type="radio" name="summary_tabs" role="tab" className="tab" aria-label="School Cost" />
                  <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
                      <h3 className="text-lg font-semibold mb-3">Private School Cost Analysis</h3>
                      {annualNetSchoolCost > 0 ? (
                          <div className="space-y-3">
                              <div>
                                  <p className="text-sm text-base-content/80">Net Annual / Monthly School Cost:</p>
                                  <p className="text-xl font-semibold">
                                      {formatDualCurrency(annualNetSchoolCost, targetCurrency, originCurrency, baselineRate).destination}
                                       / {formatCurrency(monthlyNetSchoolCost, targetCurrency)} monthly
                                  </p>
                                  <p className="text-xs font-normal text-base-content/60">
                                      {/* Corrected argument order: amount, source, target, rate */}
                                      {`(${formatDualCurrency(annualNetSchoolCost, targetCurrency, originCurrency, baselineRate).origin} / ${formatCurrency(calculateEquivalentValue(monthlyNetSchoolCost, targetCurrency, originCurrency, baselineRate), originCurrency)} monthly)`}
                                  </p>
                              </div>
                              
                              <div>
                                  <p className="text-sm text-base-content/80">Est. Gross Income Required ('Felt Cost'):</p>
                                  <p className="text-xl font-semibold">
                                      {isNaN(requiredGrossSchoolCost)
                                          ? "N/A"
                                          : formatDualCurrency(requiredGrossSchoolCost, targetCurrency, originCurrency, baselineRate).destination
                                      }
                                  </p>
                                  {!isNaN(requiredGrossSchoolCost) && (
                                      <p className="text-xs font-normal text-base-content/60">
                                           {`(${formatDualCurrency(requiredGrossSchoolCost, targetCurrency, originCurrency, baselineRate).origin})`}
                                      </p>
                                  )}
                              </div>
                              <p className="text-xs text-base-content/70 mt-1 italic">{schoolCostAnalysisNote}</p>
                          </div>
                      ) : (
                           <p className="text-sm italic text-base-content/70">{schoolCostAnalysisNote}</p>
                      )}
                  </div>
              </div>
          </div>
       </div>

      {/* Removed Income Breakdown Table for now */}
      
    </div>
  );
};

export default BudgetSummaryDisplay; 