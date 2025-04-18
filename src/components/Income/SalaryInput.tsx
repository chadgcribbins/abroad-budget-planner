'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SalaryDetails } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';
import { formatSingleCurrency } from '@/utils/formatting';

interface SalaryInputProps {
  partnerLabel: string;
  value: SalaryDetails | undefined;
  onUpdate: (payload: SalaryDetails | undefined) => void;
  // Removed FX props - will use context
  // originCurrency: string;
  // destinationCurrency: string;
  // effectiveRate: number | null; 
}

const SalaryInput: React.FC<SalaryInputProps> = ({ 
  partnerLabel, 
  value, 
  onUpdate, 
  // Removed FX props from destructuring
}) => {
  // Get currency context values
  const {
    // rates, // Keep if needed for fallback conversion 
    isLoading: currencyLoading, 
    originCurrency, 
    targetCurrency, 
    effectiveRate
  } = useCurrency();

  // Internal state for form inputs
  const [amount, setAmount] = useState<string>(value?.amount?.toString() || '');
  const [frequency, setFrequency] = useState<'Annual' | 'Monthly'>(value?.frequency || 'Annual');
  // Initialize currency state, prioritize value prop, fallback to originCurrency from CONTEXT
  const [selectedCurrency, setSelectedCurrency] = useState<string>(value?.currency || originCurrency || '');

  // Sync internal state if value prop changes OR originCurrency from context changes
  useEffect(() => {
      // Prioritize existing value prop, otherwise use context origin
      const initialCurrency = value?.currency || originCurrency || '';
      if (initialCurrency !== selectedCurrency) {
        setSelectedCurrency(initialCurrency);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.currency, originCurrency]);

  // Effect to call onUpdate when internal state forms a valid SalaryDetails object
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount >= 0 && selectedCurrency && frequency) {
      const updatedSalaryDetails: SalaryDetails = {
        amount: numericAmount,
        frequency,
        currency: selectedCurrency,
      };
      if (JSON.stringify(updatedSalaryDetails) !== JSON.stringify(value)) {
          onUpdate(updatedSalaryDetails);
      }
    } else {
        if (value !== undefined) {
            onUpdate(undefined);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, frequency, selectedCurrency]); // Removed `value` to avoid loops, relying on state sync effect

  // Calculate the equivalent annual amount in the destination currency (using context values)
  const annualEquivalentInDestination = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !selectedCurrency || !targetCurrency) { // use targetCurrency from context
      return null;
    }

    const annualAmountInSelected = frequency === 'Annual' ? numericAmount : numericAmount * 12;

    if (selectedCurrency === targetCurrency) { // use targetCurrency from context
      return annualAmountInSelected;
    }

    if (selectedCurrency === originCurrency && effectiveRate !== null) { // use originCurrency & effectiveRate from context
      return annualAmountInSelected * effectiveRate;
    }

    // Fallback conversion logic remains the same, assuming `rates` might be added back to context if needed
    // if (rates) { ... }
    
    console.warn(`Cannot calculate equivalent in ${targetCurrency} for ${selectedCurrency}. Missing rate or fallback logic.`);
    return null; 

  }, [amount, frequency, selectedCurrency, originCurrency, targetCurrency, effectiveRate]); // Use context variables


  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm bg-base-100 relative">
      <h3 className="text-lg md:text-xl font-semibold mb-2">{partnerLabel} Salary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Amount Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input 
            type="number" 
            placeholder="e.g., 50000" 
            className="input input-bordered w-full" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
        </div>

        {/* Frequency Select */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Frequency</span>
          </label>
          <select 
            className="select select-bordered w-full" 
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as 'Annual' | 'Monthly')}
          >
            <option value="Annual">Annual</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        {/* Currency Select - Simplified options based on context */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Currency</span>
          </label>
          <select 
            className="select select-bordered w-full" 
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            disabled={currencyLoading || (!originCurrency && !targetCurrency)}
          >
             {/* Only show origin and target for simplicity, plus existing value if different */}
             {originCurrency && <option key={`origin-${originCurrency}`} value={originCurrency}>{originCurrency}</option>}
             {targetCurrency && originCurrency !== targetCurrency && <option key={`target-${targetCurrency}`} value={targetCurrency}>{targetCurrency}</option>}
             {/* Add the currently selected value if it's neither origin nor target (e.g. loaded data) */}
             {selectedCurrency && selectedCurrency !== originCurrency && selectedCurrency !== targetCurrency && 
                <option key={`selected-${selectedCurrency}`} value={selectedCurrency}>{selectedCurrency}</option>}
             {/* Consider adding a broader list from context if needed */}
             
            {currencyLoading && <option value="" disabled>Loading...</option>} 
            {!currencyLoading && !originCurrency && !targetCurrency && <option value="" disabled>Set Countries</option>}
          </select>
        </div>
      </div>
      {/* Display Equivalent Annual Value (using context targetCurrency) */}
      {annualEquivalentInDestination !== null && (
        <div className="text-right text-sm text-gray-500 mt-2 pr-1">
          <span>≈ Annual {formatSingleCurrency(annualEquivalentInDestination, targetCurrency)}</span>
        </div>
      )}
    </div>
  );
};

export default SalaryInput; 