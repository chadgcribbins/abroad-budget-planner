'use client';

import React, { useState, useMemo } from 'react';
import { useLifestyle, HomeServiceName, HomeServiceFrequency } from '@/context/LifestyleContext';
import { useCurrency } from '@/context/CurrencyContext';

// Helper to convert amounts to monthly frequency for calculation
const getMonthlyAmount = (amount: number | string, frequency: 'monthly' | 'annual'): number => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0;
  return frequency === 'annual' ? numericAmount / 12 : numericAmount;
};

export const LifestyleModule: React.FC = () => {
  const { state, dispatch } = useLifestyle();
  const { baseCurrency } = useCurrency();

  // Local state for the new purchase form
  const [newPurchaseName, setNewPurchaseName] = useState('');
  const [newPurchaseAmount, setNewPurchaseAmount] = useState<string | number>('');

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
    const amount = parseFloat(newPurchaseAmount as string);
    if (newPurchaseName.trim() && !isNaN(amount) && amount > 0) {
      dispatch({
        type: 'ADD_ONE_OFF_PURCHASE',
        payload: { name: newPurchaseName.trim(), amount },
      });
      // Reset form
      setNewPurchaseName('');
      setNewPurchaseAmount('');
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
    return (
      <div className="form-control w-full mb-4" key={serviceName}>
        <label className="label">
          <span className="label-text">{label}</span>
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
        <label className="label">
          <span className="label-text-alt">Input as {baseCurrency} {serviceState.amount || 0} per {serviceState.frequency}</span>
        </label>
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
            <span className="label-text">General Shopping Spend (Groceries, clothing, hobbies, gifts, etc.)</span>
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
          <label className="label">
            <span className="label-text-alt">Input as {baseCurrency} {state.generalShoppingSpend.amount || 0} per {state.generalShoppingSpend.frequency}</span>
          </label>
        </div>
        
        {/* --- One-Off Big Purchases --- */}
        <div className="divider">One-Off Big Purchases</div>

        {/* Add New Purchase Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            placeholder="Purchase Name (e.g., Laptop)"
            className="input input-bordered flex-grow"
            value={newPurchaseName}
            onChange={(e) => setNewPurchaseName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            className="input input-bordered w-full sm:w-32"
            value={newPurchaseAmount}
            onChange={(e) => setNewPurchaseAmount(e.target.value)}
            min="0"
          />
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
            <table className="table table-zebra table-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount ({baseCurrency})</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {state.oneOffPurchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{purchase.name}</td>
                    <td>{typeof purchase.amount === 'number' ? purchase.amount.toLocaleString() : purchase.amount}</td>
                    <td>
                      <button 
                        className="btn btn-xs btn-error btn-outline"
                        onClick={() => handleRemoveOneOffPurchase(purchase.id)}
                      >
                        Remove
                      </button>
                      {/* Add Edit button later if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {state.oneOffPurchases.length === 0 && (
           <p className="text-sm text-gray-500 italic mb-4">No one-off purchases added yet.</p>
        )}
        
        {/* --- Travel & Holidays --- */}
        <div className="divider">Travel & Holidays</div>
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Annual Travel & Holidays Budget</span>
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
          <label className="label">
            <span className="label-text-alt">Input as {baseCurrency} {state.travelHolidaysBudget.amount || 0} per {state.travelHolidaysBudget.frequency}</span>
          </label>
        </div>
        
        {/* --- Home Services --- */}
        <div className="divider">Home Services</div>
        {renderHomeServiceInput('cleaner', 'Cleaner')}
        {renderHomeServiceInput('babysitter', 'Babysitter / Childcare')}
        {renderHomeServiceInput('gardening', 'Gardening')}
        {renderHomeServiceInput('petCare', 'Pet Care')}
        
        {/* --- Contingency / Unknowns --- */}
        <div className="divider">Contingency / Unknowns</div>
        
        <div className="form-control w-full mb-4">
          <label className="label">
            <span className="label-text">Contingency Type</span>
          </label>
          <div className="join mb-2">
            <button
              className={`btn join-item ${state.contingency.type === 'percentage' ? 'btn-active' : ''}`}
              onClick={() => handleContingencyTypeChange('percentage')}
            >
              Percentage (%)
            </button>
            <button
              className={`btn join-item ${state.contingency.type === 'fixed' ? 'btn-active' : ''}`}
              onClick={() => handleContingencyTypeChange('fixed')}
            >
              Fixed Amount
            </button>
          </div>

          {state.contingency.type === 'percentage' && (
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Percentage of Monthly Lifestyle Costs</span>
              </label>
              <input
                type="number"
                placeholder="Percentage (e.g., 10)"
                className="input input-bordered w-full"
                value={state.contingency.value}
                onChange={handleContingencyValueChange}
                min="0"
                max="100"
                step="0.1"
              />
              <label className="label">
                <span className="label-text-alt">Base Monthly Cost: {baseCurrency} {baseMonthlyLifestyleCost.toFixed(2)}</span>
                <span className="label-text-alt">Contingency: {baseCurrency} {finalContingencyAmount.toFixed(2)}</span>
              </label>
            </div>
          )}

          {state.contingency.type === 'fixed' && (
             <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Fixed Monthly Contingency Amount</span>
              </label>
              <input
                type="number"
                placeholder="Amount"
                className="input input-bordered w-full"
                value={state.contingency.value}
                onChange={handleContingencyValueChange}
                min="0"
              />
              <label className="label">
                <span className="label-text-alt">Contingency: {baseCurrency} {finalContingencyAmount.toFixed(2)}</span>
              </label>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}; 