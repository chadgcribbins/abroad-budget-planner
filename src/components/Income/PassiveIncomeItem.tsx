'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PassiveIncome, IncomeFrequency } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';
import { formatSingleCurrency } from '@/utils/formatting';

interface PassiveIncomeItemProps {
  item: PassiveIncome;
  onUpdate: (updatedItem: PassiveIncome) => void;
  onRemove: (id: string) => void;
}

const incomeFrequencies: IncomeFrequency[] = ['Annual', 'Monthly', 'Quarterly', 'Yearly'];

const PassiveIncomeItem: React.FC<PassiveIncomeItemProps> = ({ 
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

  const [type, setType] = useState<string>(item.type);
  const [amount, setAmount] = useState<string>(item.amount.toString());
  const [frequency, setFrequency] = useState<IncomeFrequency>(item.frequency);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(item.currency || originCurrency || '');
  const [sourceCountry, setSourceCountry] = useState<string>(item.sourceCountry || '');

  useEffect(() => {
    setType(item.type);
    setAmount(item.amount.toString());
    setFrequency(item.frequency);
    setSelectedCurrency(item.currency || originCurrency || '');
    setSourceCountry(item.sourceCountry || '');
  }, [item, originCurrency]);

  useEffect(() => {
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount >= 0 && type && selectedCurrency && frequency) {
      const updatedItem: PassiveIncome = {
        id: item.id,
        type,
        amount: numericAmount,
        frequency,
        currency: selectedCurrency,
        sourceCountry: sourceCountry || undefined,
      };
      if (
        updatedItem.type !== item.type ||
        updatedItem.amount !== item.amount || 
        updatedItem.frequency !== item.frequency ||
        updatedItem.currency !== item.currency ||
        updatedItem.sourceCountry !== item.sourceCountry
      ) {
        onUpdate(updatedItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, amount, frequency, selectedCurrency, sourceCountry, item.id]);

  const annualEquivalentInDestination = useMemo(() => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !selectedCurrency || !targetCurrency) {
      return null;
    }

    let annualAmountInSelected = 0;
    switch (frequency) {
        case 'Annual': annualAmountInSelected = numericAmount; break;
        case 'Monthly': annualAmountInSelected = numericAmount * 12; break;
        case 'Quarterly': annualAmountInSelected = numericAmount * 4; break;
        case 'Yearly': annualAmountInSelected = numericAmount; break; 
        default: return null;
    }

    if (selectedCurrency === targetCurrency) {
      return annualAmountInSelected;
    }

    if (selectedCurrency === originCurrency && effectiveRate !== null) {
      return annualAmountInSelected * effectiveRate;
    }

    console.warn(`Cannot calculate equivalent in ${targetCurrency} for ${selectedCurrency}. Missing rate or fallback logic.`);
    return null;
  }, [amount, frequency, selectedCurrency, originCurrency, targetCurrency, effectiveRate]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mb-3 p-3 border rounded bg-base-200/50 relative">
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
          title="Country where this income originates (e.g., PT, UK, US). Needed for NHR tax calculation."
        />
      </div>

      <div className="form-control items-center">
        <button 
          className="btn btn-xs btn-ghost text-error" 
          onClick={() => onRemove(item.id)}
          aria-label="Remove passive income item"
        >
          Remove
        </button>
      </div>
      
      {annualEquivalentInDestination !== null && (
        <div className="col-span-full text-right text-xs text-gray-500 -mt-2 mr-1 mb-1">
          <span>≈ Annual {formatSingleCurrency(annualEquivalentInDestination, targetCurrency)}</span>
        </div>
      )}
    </div>
  );
};

export default PassiveIncomeItem; 