'use client';

import React, { useState, useEffect } from 'react';
import { PassiveIncome, IncomeFrequency } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';

interface PassiveIncomeItemProps {
  item: PassiveIncome;
  onUpdate: (updatedItem: PassiveIncome) => void;
  onRemove: (id: string) => void;
}

const incomeFrequencies: IncomeFrequency[] = ['Annual', 'Monthly', 'Quarterly', 'Yearly'];

const PassiveIncomeItem: React.FC<PassiveIncomeItemProps> = ({ 
    item, 
    onUpdate, 
    onRemove 
}) => {
  const { rates, isLoading: currencyLoading } = useCurrency();

  // Internal state for editing
  const [type, setType] = useState<string>(item.type);
  const [amount, setAmount] = useState<string>(item.amount.toString());
  const [frequency, setFrequency] = useState<IncomeFrequency>(item.frequency);
  const [currency, setCurrency] = useState<string>(item.currency);
  const [sourceCountry, setSourceCountry] = useState<string>(item.sourceCountry || '');

  // Effect to call onUpdate when internal state changes and is valid
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount >= 0 && type && currency && frequency) {
      const updatedItem: PassiveIncome = {
        id: item.id,
        type,
        amount: numericAmount,
        frequency,
        currency,
        sourceCountry: sourceCountry || undefined,
      };
      // Prevent infinite loops
      if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
        onUpdate(updatedItem);
      }
    }
    // No need to call onUpdate(undefined) here as we always have an ID
    // The parent handles the list; invalid intermediate state is okay temporarily
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, amount, frequency, currency, sourceCountry, item.id /* item, onUpdate */]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center mb-3 p-3 border rounded bg-base-200/50">
      {/* Type Input */}
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Type</span>
        </label>
        <input 
          type="text" 
          placeholder="e.g., Rental Income" 
          className="input input-sm input-bordered w-full" 
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      {/* Amount Input */}
      <div className="form-control">
         <label className="label py-1">
          <span className="label-text text-xs">Amount</span>
        </label>
        <input 
          type="number" 
          placeholder="Amount" 
          className="input input-sm input-bordered w-full" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
        />
      </div>

      {/* Frequency Select */}
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Frequency</span>
        </label>
        <select 
          className="select select-sm select-bordered w-full" 
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as IncomeFrequency)}
        >
          {incomeFrequencies.map(freq => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>
      </div>

      {/* Currency Select */}
      <div className="form-control">
         <label className="label py-1">
          <span className="label-text text-xs">Currency</span>
        </label>
        <select 
          className="select select-sm select-bordered w-full" 
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={currencyLoading || !rates}
        >
          <option value="" disabled>{currencyLoading ? 'Loading...' : 'Select'}</option>
          {rates && Object.keys(rates).sort().map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>
      </div>

      {/* Source Country Input */}
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text text-xs">Source Country</span>
        </label>
        <input
          type="text"
          placeholder="e.g., UK"
          className="input input-sm input-bordered w-full"
          value={sourceCountry}
          onChange={(e) => setSourceCountry(e.target.value.toUpperCase())}
          maxLength={3}
          title="Country where this income originates (e.g., PT, UK, US). Needed for NHR tax calculation."
        />
      </div>

      {/* Remove Button */}
      <div className="form-control justify-end pt-5"> {/* Adjust alignment as needed */} 
        <button 
          className="btn btn-xs btn-ghost text-error" 
          onClick={() => onRemove(item.id)}
          aria-label="Remove passive income item"
        >
          {/* Simple text remove, could be an icon */}
          Remove
        </button>
      </div>
    </div>
  );
};

export default PassiveIncomeItem; 