'use client';

import React from 'react';
import { useIncome } from '@/context/IncomeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { calculateTotalAnnualNetIncome } from '@/utils/calculations/income.calculations';
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
}

const BudgetSummaryDisplay: React.FC<BudgetSummaryDisplayProps> = ({ profileSettings }) => {
  const { state: incomeState } = useIncome();
  const { rates: exchangeRates, baseCurrency, isLoading: currencyLoading } = useCurrency();

  // --- Reinstated Correct Calculation Call ---
  const totalAnnualNetIncome = calculateTotalAnnualNetIncome(
    incomeState,
    {
      destinationCountry: profileSettings.destinationCountry || '',
      originCountry: profileSettings.originCountry || '',
      isNHRActive: profileSettings.isNHRActive,
    },
    exchangeRates,
    baseCurrency
  );

  // --- Fetching Breakdown Data (Requires Refactor in Calculation) ---
  // TODO: Refactor calculateTotalAnnualNetIncome OR calculatePortugalNHRTax 
  //       to return the breakdown details needed here.
  // For now, using placeholder empty arrays.
  const breakdown: IncomeBreakdownItem[] = []; 
  const unprocessedStreams: IncomeBreakdownItem[] = [];
  const totalTaxPayable = 0; // Placeholder
  const totalSocialSecurity = 0; // Placeholder
  
  // TODO: Calculate total expenses here using expense calculation utils
  const totalAnnualExpenses = 0; // Placeholder

  if (currencyLoading) {
    return <div className="mt-6 p-4 border rounded-lg shadow bg-base-100">Loading currency rates...</div>;
  }

  const taxRegimeUsed = profileSettings.isNHRActive && profileSettings.destinationCountry === 'PT' ? 'NHR' : 'Standard (Placeholder)';

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-base-100">
      <h2 className="text-2xl font-semibold mb-4">Budget Summary (WIP)</h2>
      
      {/* Main Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
        <div className="stat" title={`Calculation based on ${taxRegimeUsed} rules.`}>
          <div className="stat-title">Est. Annual Net Income</div>
          <div className="stat-value">
            {baseCurrency} {totalAnnualNetIncome.toFixed(2)}
          </div>
          <div className="stat-desc">After estimated taxes ({taxRegimeUsed})</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Annual Expenses</div>
          <div className="stat-value">
            {baseCurrency} {totalAnnualExpenses.toFixed(2)}
          </div>
           <div className="stat-desc">Placeholder value</div>
        </div>

        <div className="stat">
          <div className="stat-title">Est. Annual Disposable</div>
          <div className="stat-value">
             {baseCurrency} {(totalAnnualNetIncome - totalAnnualExpenses).toFixed(2)}
          </div>
          <div className="stat-desc">Net Income - Expenses</div>
        </div>
      </div>

      {/* Income Breakdown Table */}
      <h3 className="text-lg font-semibold mb-2">Income Breakdown (NHR Calculation)</h3>
      {breakdown.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-sm w-full">
            <thead>
              <tr>
                <th>ID/Type</th>
                <th>Source</th>
                <th>Gross ({baseCurrency})</th>
                <th>NHR Class</th>
                <th>Tax ({baseCurrency})</th>
                <th>SS ({baseCurrency})</th>
                <th>Net ({baseCurrency})</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item: IncomeBreakdownItem, index: number) => (
                <tr key={item.id || index}>
                  <td>{item.id} ({item.type}{item.passiveType ? ` - ${item.passiveType}` : ''})</td>
                  <td>{item.sourceCountry}</td>
                  <td>{item.amount?.toFixed(2)}</td>
                  <td>{item.nhrClassification}</td>
                  <td className="text-warning">{item.calculatedTax?.toFixed(2)}</td>
                  <td className="text-warning">{item.calculatedSocialSecurity?.toFixed(2)}</td>
                  <td className="font-medium">{item.calculatedNetIncome?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
             <tfoot>
              <tr>
                <th colSpan={4}>Totals (NHR Processed)</th>
                <th>{totalTaxPayable.toFixed(2)}</th>
                <th>{totalSocialSecurity.toFixed(2)}</th>
                <th>{totalAnnualNetIncome.toFixed(2)}</th>
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
                      <li key={item.id || index}>{item.id} ({item.type}) - {item.amount?.toFixed(2)} {item.originalCurrency}</li>
                  ))}
              </ul>
          </div>
      )}

      {/* General Disclaimer */}
      <p className="text-xs text-gray-500 mt-6">
        <strong>Disclaimer:</strong> All calculations are estimates based on simplified assumptions (especially for taxes) and user inputs. Currency conversions use rates from {baseCurrency}. This tool is for planning purposes only and does not constitute financial or tax advice. Consult with qualified professionals for advice specific to your situation.
      </p>
    </div>
  );
};

export default BudgetSummaryDisplay; 