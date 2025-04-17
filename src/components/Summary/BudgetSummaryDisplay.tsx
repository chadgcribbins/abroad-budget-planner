'use client';

import React, { useMemo } from 'react';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { calculateTotalAnnualNetIncome } from '@/utils/calculations/income.calculations';
import { formatDualCurrency } from '@/utils/formatting';
import { calculateEquivalentValue } from '@/utils/transformations/currency.transformations'; // Import the calculation utility
// TODO: Import expense calculations when implemented

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
      destinationCountry: profileSettings.destinationCountry || '',
      originCountry: profileSettings.originCountry || '',
      isNHRActive: profileSettings.isNHRActive,
    },
    null, // Pass null for exchangeRates map (if calculation supports it)
    targetCurrency, 
    originCurrency, 
    baselineRate // Use BASELINE rate
  ), [incomeState, profileSettings, targetCurrency, originCurrency, baselineRate]);

  const simulatedTotalAnnualNetIncome = useMemo(() => calculateTotalAnnualNetIncome(
    incomeState,
    {
      destinationCountry: profileSettings.destinationCountry || '',
      originCountry: profileSettings.originCountry || '',
      isNHRActive: profileSettings.isNHRActive,
    },
    null, // Pass null for exchangeRates map
    targetCurrency, 
    originCurrency, 
    effectiveRate // Use EFFECTIVE rate (includes simulation)
  ), [incomeState, profileSettings, targetCurrency, originCurrency, effectiveRate]);

  // --- Fetching Breakdown Data (Requires Refactor in Calculation) ---
  // TODO: Refactor calculateTotalAnnualNetIncome OR calculatePortugalNHRTax 
  //       to return the breakdown details needed here.
  // For now, using placeholder empty arrays.
  const breakdown: IncomeBreakdownItem[] = []; 
  const unprocessedStreams: IncomeBreakdownItem[] = [];
  const totalTaxPayable = 0; // Placeholder
  const totalSocialSecurity = 0; // Placeholder
  
  // TODO: Calculate total expenses here using expense calculation utils
  // For simulation display, we need baseline and simulated expenses
  const baselineTotalAnnualExpenses = 0; // Placeholder
  const simulatedTotalAnnualExpenses = 0; // Placeholder

  // Calculate Disposable Income
  const baselineDisposable = baselineTotalAnnualNetIncome - baselineTotalAnnualExpenses;
  const simulatedDisposable = simulatedTotalAnnualNetIncome - simulatedTotalAnnualExpenses;

  if (currencyLoading) {
    return <div className="mt-6 p-4 border rounded-lg shadow bg-base-100">Loading currency rates...</div>;
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
    <div className="mt-6 p-4 border rounded-lg shadow bg-base-100">
      <h2 className="text-2xl font-semibold mb-4">Budget Summary (WIP)</h2>
      
      {/* Main Stats - Display SIMULATED values by default when simulation is active */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
        <div className="stat" title={`Calculation based on ${taxRegimeUsed} rules. ${fxSimulationPercentage !== 0 ? `Includes ${fxSimulationPercentage}% FX simulation.` : ''}`}>
          <div className="stat-title">Est. Annual Net Income</div>
          <div className="stat-value whitespace-normal"> 
            <span className="font-bold">
              {formatDualCurrency(simulatedTotalAnnualNetIncome, targetCurrency, originCurrency, effectiveRate).destination}
            </span>
            <span className="text-sm font-normal">
              {` / ${formatDualCurrency(simulatedTotalAnnualNetIncome, targetCurrency, originCurrency, effectiveRate).origin}`}
            </span>
          </div>
          <div className="stat-desc">After estimated taxes ({taxRegimeUsed}){fxSimulationPercentage !== 0 ? ` (Simulated)` : ''}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Annual Expenses</div>
          <div className="stat-value whitespace-normal"> 
             <span className="font-bold">
              {formatDualCurrency(simulatedTotalAnnualExpenses, targetCurrency, originCurrency, effectiveRate).destination}
            </span>
            <span className="text-sm font-normal">
              {` / ${formatDualCurrency(simulatedTotalAnnualExpenses, targetCurrency, originCurrency, effectiveRate).origin}`}
            </span>
          </div>
           <div className="stat-desc">Placeholder value{fxSimulationPercentage !== 0 ? ` (Simulated)` : ''}</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Annual Disposable</div>
          <div className="stat-value whitespace-normal"> 
            <span className="font-bold">
              {formatDualCurrency(simulatedDisposable, targetCurrency, originCurrency, effectiveRate).destination}
            </span>
            <span className="text-sm font-normal">
              {` / ${formatDualCurrency(simulatedDisposable, targetCurrency, originCurrency, effectiveRate).origin}`}
            </span>
          </div>
          <div className="stat-desc">Net Income - Expenses{fxSimulationPercentage !== 0 ? ` (Simulated)` : ''}</div>
        </div>
      </div>

      {/* --- FX Simulation Impact Section --- */}
      {fxSimulationPercentage !== 0 && (
        <div className="mt-6 mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            FX Simulation Impact ({fxSimulationPercentage > 0 ? '+':''}{fxSimulationPercentage}% Change)
          </h3>
          <div className="overflow-x-auto">
            <table className="table table-sm w-full text-sm">
              <thead>
                <tr className="bg-blue-100">
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
                  // Avoid division by zero if baseline is 0
                  const percDiff = item.baseline !== 0 ? (diff / Math.abs(item.baseline)) * 100 : (diff !== 0 ? Infinity : 0);
                  const diffText = formatDualCurrency(diff, targetCurrency, originCurrency, baselineRate); // Format diff using baseline rate
                  
                  return (
                    <tr key={item.label}>
                      <td className="font-medium">{item.label}</td>
                      <td>{formatDualCurrency(item.baseline, targetCurrency, originCurrency, baselineRate).destination}</td>
                      <td>{formatDualCurrency(item.simulated, targetCurrency, originCurrency, effectiveRate).destination}</td>
                      <td className={`${diff >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>{diffText.destination}</td>
                      <td className={`${diff >= 0 ? 'text-green-600' : 'text-red-600'} font-medium`}>{percDiff !== Infinity ? `${percDiff.toFixed(1)}%` : 'N/A'}</td>
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
      )}

      {/* Income Breakdown Table */}
      <h3 className="text-lg font-semibold mb-2">Income Breakdown (NHR Calculation)</h3>
      {breakdown.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr>
                <th>ID/Type</th>
                <th>Source</th>
                <th>Gross ({targetCurrency})</th>{/* Use targetCurrency */}
                <th>NHR Class</th>
                <th>Tax ({targetCurrency})</th>{/* Use targetCurrency */}
                <th>SS ({targetCurrency})</th>{/* Use targetCurrency */}
                <th>Net ({targetCurrency})</th>{/* Use targetCurrency */}
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item: IncomeBreakdownItem, index: number) => (
                <tr key={item.id || index}>
                  <td>{item.id} ({item.type}{item.passiveType ? ` - ${item.passiveType}` : ''})</td>
                  <td>{item.sourceCountry}</td>
                  <td>{item.amount?.toFixed(2)}</td>{/* TODO: Format */}
                  <td>{item.nhrClassification}</td>
                  <td className="text-warning">{item.calculatedTax?.toFixed(2)}</td>{/* TODO: Format */}
                  <td className="text-warning">{item.calculatedSocialSecurity?.toFixed(2)}</td>{/* TODO: Format */}
                  <td className="font-medium">{item.calculatedNetIncome?.toFixed(2)}</td>{/* TODO: Format */}
                </tr>
              ))}
            </tbody>
             <tfoot>
              <tr>
                <th colSpan={4}>Totals (NHR Processed)</th>
                <th>{totalTaxPayable.toFixed(2)}</th>{/* TODO: Format */}
                <th>{totalSocialSecurity.toFixed(2)}</th>{/* TODO: Format */}
                <th>{simulatedTotalAnnualNetIncome.toFixed(2)}</th>{/* TODO: Format */}
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Income breakdown details not available (requires calculation refactor).</p>
      )}

      {/* Unprocessed Streams Note */}
      {unprocessedStreams.length > 0 && (
          <div className="mt-4">
              <h4 className="text-sm font-semibold text-warning">Unprocessed Income Streams:</h4>
              <p className="text-xs text-gray-600">The following streams require standard Portuguese tax calculation (not implemented in MVP):</p>
              <ul className="list-disc list-inside text-xs">
                  {unprocessedStreams.map((item: IncomeBreakdownItem, index: number) => (
                      <li key={item.id || index}>{item.id} ({item.type}) - {item.amount?.toFixed(2)} {item.originalCurrency}</li> // Keep original currency here
                  ))}
              </ul>
          </div>
      )}

      {/* General Disclaimer */}
      <p className="text-xs text-gray-500 mt-6">
        <strong>Disclaimer:</strong> All calculations are estimates based on simplified assumptions (especially for taxes) and user inputs. 
        Currency conversions use the effective rate based on your settings. 
        This tool is for planning purposes only and does not constitute financial or tax advice. 
        Consult with qualified professionals for advice specific to your situation.
      </p>
    </div>
  );
};

export default BudgetSummaryDisplay; 