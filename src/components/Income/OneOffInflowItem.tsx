'use client';

import React, { useState, useEffect } from 'react';
import { OneOffInflow } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';

interface OneOffInflowItemProps {
  item: OneOffInflow;
  onUpdate: (updatedItem: OneOffInflow) => void;
  onRemove: (id: string) => void;
}

const OneOffInflowItem: React.FC<OneOffInflowItemProps> = ({ 
    item, 
    onUpdate, 
    onRemove 
}) => {
  const { rates, isLoading: currencyLoading } = useCurrency();

  // Internal state for editing
  const [description, setDescription] = useState<string>(item.description);
  const [amount, setAmount] = useState<string>(item.amount.toString());
  const [currency, setCurrency] = useState<string>(item.currency);
  const [year, setYear] = useState<string>(item.year?.toString() || ''); // Optional year
  const [sourceCountry, setSourceCountry] = useState<string>(item.sourceCountry || '');

  // Effect to call onUpdate when internal state changes and is valid
  useEffect(() => {
    const numericAmount = parseFloat(amount);
    const numericYear = year ? parseInt(year, 10) : undefined;
    
    if (!isNaN(numericAmount) && numericAmount >= 0 && description && currency) {
      const updatedItem: OneOffInflow = {
        id: item.id,
        description,
        amount: numericAmount,
        currency,
        year: numericYear,
        sourceCountry: sourceCountry || undefined,
      };
      if (JSON.stringify(updatedItem) !== JSON.stringify(item)) {
        onUpdate(updatedItem);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, amount, currency, year, sourceCountry, item.id]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center mb-3 p-3 border rounded bg-base-200/50">
      {/* Description Input */}
      <div className="form-control md:col-span-2"> {/* Spanning 2 columns */} 
        <label className="label py-1">
          <span className="label-text text-xs">Description</span>
        </label>
        <input 
          type="text" 
          placeholder="e.g., Annual Bonus" 
          className="input input-sm input-bordered w-full" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
      
       {/* Year Input & Remove Button */} 
      <div className="flex items-end gap-2">
          <div className="form-control grow">
            <label className="label py-1">
                <span className="label-text text-xs">Year (Optional)</span>
            </label>
            <input 
                type="number"
                placeholder="YYYY"
                className="input input-sm input-bordered w-full"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="1900"
                max="2100"
            />
          </div>
          <button
               className="btn btn-sm btn-ghost text-error mb-1"
               onClick={() => onRemove(item.id)}
               aria-label="Remove one-off inflow item"
            >
               Remove
            </button>
      </div>

      {/* Source Country Input (Added) */}
      <div className="form-control md:col-start-4"> {/* Align under Currency */} 
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
          title="Country where this inflow originates (e.g., PT, UK, US). Needed for NHR tax calculation."
        />
      </div>

    </div>
  );
};

export default OneOffInflowItem; 