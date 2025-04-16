'use client';

import React, { useState, useEffect } from 'react';
import { SalaryDetails } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext'; // Assuming path

interface SalaryInputProps {
  partnerLabel: string;
  value: SalaryDetails | undefined;
  onUpdate: (payload: SalaryDetails | undefined) => void;
}

const SalaryInput: React.FC<SalaryInputProps> = ({ 
  partnerLabel, 
  value, 
  onUpdate 
}) => {
  const { rates, isLoading: currencyLoading } = useCurrency();

  // Internal state for form inputs
  const [amount, setAmount] = useState<string>(value?.amount?.toString() || '');
  const [frequency, setFrequency] = useState<'Annual' | 'Monthly'>(value?.frequency || 'Annual');
  const [currency, setCurrency] = useState<string>(value?.currency || ''); // Default to empty or baseCurrency? 

  // TODO: useEffect to sync props to state if external changes occur?

  // TODO: useEffect to call onUpdate when internal state forms a valid SalaryDetails object
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && currency && frequency) {
      const updatedSalaryDetails: SalaryDetails = {
        amount: numericAmount,
        frequency,
        currency,
      };
      // Prevent infinite loops: only call onUpdate if the object actually changed
      // Simple string comparison for now, could be more robust
      if (JSON.stringify(updatedSalaryDetails) !== JSON.stringify(value)) {
          onUpdate(updatedSalaryDetails);
      }
    } else {
        // If inputs are incomplete/invalid, notify parent with undefined
        // only if the previous state was not already undefined
        if (value !== undefined) {
            onUpdate(undefined);
        }
    }
// eslint-disable-next-line react-hooks/exhaustive-deps 
}, [amount, frequency, currency /* value <- adding this causes loops, onUpdate */]); // Dependencies need careful management

  return (
    <div className="mb-4 p-4 border rounded-lg shadow-sm bg-base-100">
      <h3 className="text-lg font-semibold mb-2">{partnerLabel} Salary</h3>
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

        {/* Currency Select */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Currency</span>
          </label>
          <select 
            className="select select-bordered w-full" 
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={currencyLoading || !rates}
          >
            <option value="" disabled>{currencyLoading ? 'Loading...' : 'Select Currency'}</option>
            {rates && Object.keys(rates).sort().map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SalaryInput; 