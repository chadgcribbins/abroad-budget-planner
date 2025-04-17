'use client';

import React, { useState, useMemo } from 'react';
import { useLifestyle, HomeServiceName, HomeServiceFrequency } from '@/context/LifestyleContext';
import { useCurrency } from '@/context/CurrencyContext';
import { formatDualCurrency } from '@/utils/formatting';

// Helper to convert amounts to monthly frequency for calculation
const getMonthlyAmount = (amount: number | string, frequency: 'monthly' | 'annual'): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0;
  return frequency === 'annual' ? numericAmount / 12 : numericAmount;
};

export const LifestyleModule: React.FC = () => {
  const { state, dispatch } = useLifestyle();
  const { originCurrency, targetCurrency, effectiveRate } = useCurrency();

  // Helper to render dual currency format
  const renderDualCurrency = (amount: number | null | '' | undefined) => {
    const numericAmount = Number(amount);
    if (amount === null || amount === '' || amount === undefined || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate) return 'N/A';
    const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
    return (
      <>
        <span className="font-bold">{formatted.destination}</span>
        <span className="text-sm font-normal"> / {formatted.origin}</span>
      </>
    );
  };

  // Helper to display origin currency equivalent below inputs
  const showOriginEquivalent = (amount: string | number | null | '' | undefined, isAnnual: boolean = false) => {
     // Convert string to number robustly inside the helper
     const numericAmount = (typeof amount === 'string' && amount !== '') ? parseFloat(amount) : (typeof amount === 'number' ? amount : undefined);
     
     // Use numericAmount for checks and formatting
     if (numericAmount === undefined || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate || numericAmount <= 0) return null;
     
     const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
     return `≈ ${formatted.origin}${isAnnual ? ' / yr' : ' / mo'}`;
  };

  // Helper to display origin equivalent for the input based on frequency
  const showInputOriginEquivalent = (amount: number | string | '' | undefined, frequency: 'monthly' | 'annual') => {
    // This correctly calls the updated showOriginEquivalent
    return showOriginEquivalent(amount, frequency === 'annual');
  }

  // Local state for the new purchase form
  const [newPurchaseName, setNewPurchaseName] = useState('');
  const [newPurchaseAmount, setNewPurchaseAmount] = useState<number | undefined>(undefined);

  const handleGeneralShoppingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    dispatch({
      type: 'UPDATE_GENERAL_SHOPPING_SPEND',
      payload: { ...state.generalShoppingSpend, amount: amount === '' ? '' : parseFloat(amount) || '' },
    });
  };

  const handleGeneralShoppingFrequencyChange = (frequency: 'monthly' | 'annual') => {
    dispatch({
      type: 'UPDATE_GENERAL_SHOPPING_SPEND',
      payload: { ...state.generalShoppingSpend, frequency },
    });
  };

  // Handlers for one-off purchases
  const handleAddOneOffPurchase = () => {
    if (newPurchaseName.trim() && newPurchaseAmount !== undefined && newPurchaseAmount > 0) {
      dispatch({
        type: 'ADD_ONE_OFF_PURCHASE',
        payload: { name: newPurchaseName.trim(), amount: newPurchaseAmount },
      });
      // Reset form
      setNewPurchaseName('');
      setNewPurchaseAmount(undefined);
    } else {
      // Basic validation feedback (could be improved)
      alert('Please enter a valid name and positive amount for the purchase.');
    }
  };

  const handleRemoveOneOffPurchase = (id: string) => {
    dispatch({ type: 'REMOVE_ONE_OFF_PURCHASE', payload: { id } });
  };

  // Handlers for Travel & Holidays
  const handleTravelBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    dispatch({
      type: 'UPDATE_TRAVEL_HOLIDAYS_BUDGET',
      payload: { ...state.travelHolidaysBudget, amount: amount === '' ? '' : parseFloat(amount) || '' },
    });
  };

  const handleTravelBudgetFrequencyChange = (frequency: 'monthly' | 'annual') => {
    dispatch({
      type: 'UPDATE_TRAVEL_HOLIDAYS_BUDGET',
      payload: { ...state.travelHolidaysBudget, frequency },
    });
  };

  // Generic handler for Home Service amount changes
  const handleHomeServiceAmountChange = (serviceName: HomeServiceName, e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value;
    dispatch({
      type: 'UPDATE_HOME_SERVICE',
      payload: {
        serviceName,
        data: { amount: amount === '' ? '' : parseFloat(amount) || '' },
      },
    });
  };

  // Generic handler for Home Service frequency changes
  const handleHomeServiceFrequencyChange = (serviceName: HomeServiceName, frequency: HomeServiceFrequency) => {
    dispatch({
      type: 'UPDATE_HOME_SERVICE',
      payload: {
        serviceName,
        data: { frequency },
      },
    });
  };

  // Handlers for Contingency
  const handleContingencyTypeChange = (type: 'fixed' | 'percentage') => {
    // Reset value when switching type? Optional.
    const defaultValue = type === 'fixed' ? '' : 10;
    dispatch({ type: 'UPDATE_CONTINGENCY', payload: { type, value: defaultValue } });
  };

  const handleContingencyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch({ 
      type: 'UPDATE_CONTINGENCY', 
      payload: { value: value === '' ? '' : parseFloat(value) || '' }
    });
  };

  // Calculate Base Lifestyle Cost (Memoized)
  const baseMonthlyLifestyleCost = useMemo(() => {
    let total = 0;

    // General Shopping
    total += getMonthlyAmount(state.generalShoppingSpend.amount, state.generalShoppingSpend.frequency);

    // One-Off Purchases (averaged annually, then monthly)
    const annualOneOffs = state.oneOffPurchases.reduce((sum, item) => {
      const cost = typeof item.amount === 'string' ? parseFloat(item.amount) || 0 : item.amount || 0;
      return sum + cost;
    }, 0);
    total += annualOneOffs / 12;

    // Travel & Holidays
    total += getMonthlyAmount(state.travelHolidaysBudget.amount, state.travelHolidaysBudget.frequency);

    // Home Services
    Object.values(state.homeServices).forEach(service => {
      total += getMonthlyAmount(service.amount, service.frequency);
    });

    return total;
  }, [state.generalShoppingSpend, state.oneOffPurchases, state.travelHolidaysBudget, state.homeServices]);

  // Calculate Final Contingency Amount
  const finalContingencyAmount = useMemo(() => {
    const value = typeof state.contingency.value === 'string' ? parseFloat(state.contingency.value) || 0 : state.contingency.value || 0;
    if (state.contingency.type === 'fixed') {
      return value;
    } else {
      return (baseMonthlyLifestyleCost * value) / 100;
    }
  }, [state.contingency.type, state.contingency.value, baseMonthlyLifestyleCost]);

  // Helper to render a single home service input row
  const renderHomeServiceInput = (serviceName: HomeServiceName, label: string) => {
    const serviceState = state.homeServices[serviceName];
    const originEquiv = showInputOriginEquivalent(serviceState.amount, serviceState.frequency);
    return (
      <div className="form-control w-full mb-4" key={serviceName}>
        <label className="label">
          <span className="label-text">{label} ({targetCurrency})</span>
        </label>
        <div className="join">
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered join-item w-full"
            value={serviceState.amount}
            onChange={(e) => handleHomeServiceAmountChange(serviceName, e)}
            min="0"
          />
          <button
            className={`btn join-item ${serviceState.frequency === 'monthly' ? 'btn-active' : ''}`}
            onClick={() => handleHomeServiceFrequencyChange(serviceName, 'monthly')}
          >
            Monthly
          </button>
          <button
            className={`btn join-item ${serviceState.frequency === 'annual' ? 'btn-active' : ''}`}
            onClick={() => handleHomeServiceFrequencyChange(serviceName, 'annual')}
          >
            Annual
          </button>
        </div>
        {originEquiv && (
          <label className="label">
            <span className="label-text-alt">{originEquiv}</span>
          </label>
        )}
      </div>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">Lifestyle & Discretionary Costs</h2>

        {/* General Shopping Spend */}
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">General Shopping Spend ({targetCurrency})</span>
            <span className="label-text-alt">(Groceries, clothing, hobbies, etc.)</span>
          </label>
          <div className="join">
            <input
              type="number"
              placeholder="Amount"
              className="input input-bordered join-item w-full"
              value={state.generalShoppingSpend.amount}
              onChange={handleGeneralShoppingChange}
              min="0"
            />
            <button
              className={`btn join-item ${state.generalShoppingSpend.frequency === 'monthly' ? 'btn-active' : ''}`}
              onClick={() => handleGeneralShoppingFrequencyChange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`btn join-item ${state.generalShoppingSpend.frequency === 'annual' ? 'btn-active' : ''}`}
              onClick={() => handleGeneralShoppingFrequencyChange('annual')}
            >
              Annual
            </button>
          </div>
          {showInputOriginEquivalent(state.generalShoppingSpend.amount, state.generalShoppingSpend.frequency) && (
            <label className="label">
              <span className="label-text-alt">
                {showInputOriginEquivalent(state.generalShoppingSpend.amount, state.generalShoppingSpend.frequency)}
              </span>
            </label>
          )}
        </div>
        
        {/* --- One-Off Big Purchases --- */}
        <div className="divider">One-Off Big Purchases ({targetCurrency})</div>

        {/* Add New Purchase Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Purchase Name (e.g., Laptop)"
            className="input input-bordered flex-grow"
            value={newPurchaseName}
            onChange={(e) => setNewPurchaseName(e.target.value)}
          />
          <div className="form-control">
              <input
                type="number"
                placeholder="Amount"
                className="input input-bordered w-full sm:w-32"
                value={newPurchaseAmount?.toString() ?? ''}
                onChange={(e) => {
                    const valStr = e.target.value;
                    const num = valStr === '' ? undefined : parseFloat(valStr);
                    setNewPurchaseAmount(isNaN(num as number) ? undefined : num); 
                }}
                min="0"
              />
               {/* Call helper directly with number | undefined state */} 
               {showOriginEquivalent(newPurchaseAmount, true) && (
                 <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {showOriginEquivalent(newPurchaseAmount, true)}
                 </div>
               )}
          </div>
          <button 
            className="btn btn-secondary"
            onClick={handleAddOneOffPurchase}
          >
            Add Purchase
          </button>
        </div>

        {/* List of Purchases */}
        {state.oneOffPurchases.length > 0 && (
          <div className="overflow-x-auto mb-4">
            <table className="table table-zebra table-sm w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount ({targetCurrency}/yr)</th>
                  <th>Equivalent ({originCurrency}/yr)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.oneOffPurchases.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    {/* Ensure item.amount is treated as number */}
                    <td>{(Number(item.amount) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>{formatDualCurrency(Number(item.amount) || 0, targetCurrency ?? '', originCurrency ?? '', effectiveRate).origin || '---'}</td>
                    <td>
                      <button 
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() => handleRemoveOneOffPurchase(item.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* --- Travel & Holidays --- */}
        <div className="divider">Travel & Holidays</div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Travel Budget ({targetCurrency})</span>
          </label>
          <div className="join">
            <input
              type="number"
              placeholder="Amount"
              className="input input-bordered join-item w-full"
              value={state.travelHolidaysBudget.amount}
              onChange={handleTravelBudgetChange}
              min="0"
            />
            <button
              className={`btn join-item ${state.travelHolidaysBudget.frequency === 'monthly' ? 'btn-active' : ''}`}
              onClick={() => handleTravelBudgetFrequencyChange('monthly')}
            >
              Monthly
            </button>
            <button
              className={`btn join-item ${state.travelHolidaysBudget.frequency === 'annual' ? 'btn-active' : ''}`}
              onClick={() => handleTravelBudgetFrequencyChange('annual')}
            >
              Annual
            </button>
          </div>
           {showInputOriginEquivalent(state.travelHolidaysBudget.amount, state.travelHolidaysBudget.frequency) && (
            <label className="label">
              <span className="label-text-alt">
                {showInputOriginEquivalent(state.travelHolidaysBudget.amount, state.travelHolidaysBudget.frequency)}
              </span>
            </label>
          )}
        </div>

        {/* --- Home Services --- */}
        <div className="divider">Home Services</div>
        {renderHomeServiceInput('cleaner', 'Cleaner')}
        {renderHomeServiceInput('babysitter', 'Babysitter / Nanny')}
        {renderHomeServiceInput('gardening', 'Gardener')}
        {renderHomeServiceInput('petCare', 'Pet Care / Walker')}

        {/* --- Contingency --- */}
        <div className="divider">Contingency / Unknowns</div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Contingency Type</span>
          </label>
          <div className="join mb-2">
            <button
              className={`btn join-item ${state.contingency.type === 'fixed' ? 'btn-active' : ''}`}
              onClick={() => handleContingencyTypeChange('fixed')}
            >
              Fixed Amount ({targetCurrency})
            </button>
            <button
              className={`btn join-item ${state.contingency.type === 'percentage' ? 'btn-active' : ''}`}
              onClick={() => handleContingencyTypeChange('percentage')}
            >
              Percentage (% of Base)
            </button>
          </div>
          <div className="form-control">
            <input
              type="number"
              placeholder={state.contingency.type === 'fixed' ? "Amount" : "Percentage"}
              className="input input-bordered w-full max-w-xs"
              value={state.contingency.value}
              onChange={handleContingencyValueChange}
              min="0"
              step={state.contingency.type === 'fixed' ? "any" : "1"}
            />
            {state.contingency.type === 'fixed' && showOriginEquivalent(state.contingency.value) && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1 w-full max-w-xs">
                    {showOriginEquivalent(state.contingency.value)}
                </div>
            )}
          </div>
          {/* Display calculated contingency amount */}
          <div className="mt-2 text-sm text-right font-medium whitespace-normal">
             Contingency Added: {renderDualCurrency(finalContingencyAmount)}
          </div>
        </div>

        {/* --- Total Lifestyle Cost --- */}
        <div className="mt-6 pt-4 border-t border-base-300 text-right">
          <p className="font-semibold whitespace-normal">
            Total Avg. Monthly Lifestyle Cost (incl. Contingency):
            <span className="block text-xl">
              {renderDualCurrency(baseMonthlyLifestyleCost + finalContingencyAmount)}
            </span>
          </p>
          <p className="text-sm text-base-content/80 whitespace-normal">
            (Base Monthly: {renderDualCurrency(baseMonthlyLifestyleCost)} + Contingency: {renderDualCurrency(finalContingencyAmount)})
          </p>
        </div>

      </div>
    </div>
  );
}; 