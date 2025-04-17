'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { OneOffInflow } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';
import { formatSingleCurrency } from '@/utils/formatting';

interface OneOffInflowItemProps {
  item: OneOffInflow;
  onUpdate: (updatedItem: OneOffInflow) => void;
  onRemove: (id: string) => void;
}

const OneOffInflowItem: React.FC<OneOffInflowItemProps> = ({ 
    item, 
    onUpdate, 
    onRemove, 
}) => {
  const {
    isLoading: currencyLoading,
    originCurrency,
    targetCurrency,
    effectiveRate
  } = useCurrency();

  const [description, setDescription] = useState<string>(item.description);
  const [amount, setAmount] = useState<string>(item.amount.toString());
  const [selectedCurrency, setSelectedCurrency] = useState<string>(item.currency || originCurrency || '');
  const [year, setYear] = useState<string>(item.year?.toString() || '');
  const [sourceCountry, setSourceCountry] = useState<string>(item.sourceCountry || '');

  useEffect(() => {
    setDescription(item.description);
    setAmount(item.amount.toString());
    setSelectedCurrency(item.currency || originCurrency || '');
    setYear(item.year?.toString() || '');
    setSourceCountry(item.sourceCountry || '');
  }, [item, originCurrency]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    const numericYear = year ? parseInt(year, 10) : undefined;
    
    if (!isNaN(numericAmount) && numericAmount >= 0 && description && selectedCurrency) {
      const updatedItem: OneOffInflow = {
        id: item.id,
        description,
        amount: numericAmount,
        currency: selectedCurrency,
        year: (numericYear && !isNaN(numericYear)) ? numericYear : undefined,
        sourceCountry: sourceCountry || undefined,
      };
       if (
          updatedItem.description !== item.description ||
          updatedItem.amount !== item.amount ||
          updatedItem.currency !== item.currency ||
          updatedItem.year !== item.year ||
          updatedItem.sourceCountry !== item.sourceCountry
      ) {
        onUpdate(updatedItem);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, amount, selectedCurrency, year, sourceCountry, item.id]);

  const equivalentInDestination = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !selectedCurrency || !targetCurrency) {
      return null;
    }

    if (selectedCurrency === targetCurrency) {
      return numericAmount;
    }

    if (selectedCurrency === originCurrency && effectiveRate !== null) {
      return numericAmount * effectiveRate;
    }

    console.warn(`Cannot calculate equivalent in ${targetCurrency} for ${selectedCurrency}. Missing rate or fallback logic.`);
    return null;
  }, [amount, selectedCurrency, originCurrency, targetCurrency, effectiveRate]);


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end mb-3 p-3 border rounded bg-base-200/50 relative">
      <div className="form-control lg:col-span-2"> 
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

      <div className="form-control">
         <label className="label py-1">
          <span className="label-text text-xs">Currency</span>
        </label>
        <select 
          className="select select-sm select-bordered w-full" 
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          disabled={currencyLoading || (!originCurrency && !targetCurrency)}
        >
           {originCurrency && <option key={`origin-${originCurrency}`} value={originCurrency}>{originCurrency}</option>}
           {targetCurrency && originCurrency !== targetCurrency && <option key={`target-${targetCurrency}`} value={targetCurrency}>{targetCurrency}</option>}
           {selectedCurrency && selectedCurrency !== originCurrency && selectedCurrency !== targetCurrency && 
              <option key={`selected-${selectedCurrency}`} value={selectedCurrency}>{selectedCurrency}</option>}
           
          {currencyLoading && <option value="" disabled>Loading...</option>} 
          {!currencyLoading && !originCurrency && !targetCurrency && <option value="" disabled>Set Countries</option>}
        </select>
      </div>
      
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
          title="Country where this inflow originates (e.g., PT, UK, US). Needed for NHR tax calculation."
        />
      </div>

      <div className="form-control flex flex-row items-end gap-2">
          <div className="grow">
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
               className="btn btn-xs btn-ghost text-error mb-1"
               onClick={() => onRemove(item.id)}
               aria-label="Remove one-off inflow item"
            >
               Remove
            </button>
      </div>

       {equivalentInDestination !== null && (
        <div className="col-span-full text-right text-xs text-gray-500 -mt-2 mr-1 mb-1">
          <span>≈ {formatSingleCurrency(equivalentInDestination, targetCurrency)}</span>
        </div>
      )}

    </div>
  );
};

export default OneOffInflowItem; 