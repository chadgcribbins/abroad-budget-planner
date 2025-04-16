'use client';

import React from 'react';
import SalaryInput from './SalaryInput';
import PassiveIncomeItem from './PassiveIncomeItem';
import OneOffInflowItem from './OneOffInflowItem';
import { useIncome } from '../../context/IncomeContext';
import { SalaryDetails, PassiveIncome, OneOffInflow } from '../../types/income.types';
import { useCurrency } from '../../context/CurrencyContext';

const IncomeModule: React.FC = () => {
  const { state, dispatch } = useIncome();
  const { baseCurrency } = useCurrency();

  const handleUpdatePartner1 = (payload: SalaryDetails | undefined) => {
    dispatch({ type: 'UPDATE_PARTNER1_SALARY', payload });
  };

  const handleUpdatePartner2 = (payload: SalaryDetails | undefined) => {
    dispatch({ type: 'UPDATE_PARTNER2_SALARY', payload });
  };

  const handleUpdatePassiveIncome = (updatedItem: PassiveIncome) => {
    dispatch({ type: 'UPDATE_PASSIVE_INCOME', payload: updatedItem });
  };

  const handleRemovePassiveIncome = (id: string) => {
    dispatch({ type: 'REMOVE_PASSIVE_INCOME', payload: { id } });
  };

  const handleAddPassiveIncome = () => {
    dispatch({ 
        type: 'ADD_PASSIVE_INCOME', 
        payload: { 
            type: '', 
            amount: 0,
            frequency: 'Monthly',
            currency: baseCurrency || '',
            sourceCountry: '',
        }
    });
  };

  const handleUpdateOneOffInflow = (updatedItem: OneOffInflow) => {
    dispatch({ type: 'UPDATE_ONE_OFF_INFLOW', payload: updatedItem });
  };

  const handleRemoveOneOffInflow = (id: string) => {
    dispatch({ type: 'REMOVE_ONE_OFF_INFLOW', payload: { id } });
  };

  const handleAddOneOffInflow = () => {
    dispatch({ 
        type: 'ADD_ONE_OFF_INFLOW', 
        payload: { 
            description: '', 
            amount: 0, 
            currency: baseCurrency || '',
            sourceCountry: '',
        } 
    });
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Income Sources</h2>
      
      {/* Partner Salaries */}
      <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Salaries</h3>
          <SalaryInput 
            partnerLabel="Partner 1"
            value={state.partner1Salary}
            onUpdate={handleUpdatePartner1}
          />
          <SalaryInput 
            partnerLabel="Partner 2"
            value={state.partner2Salary}
            onUpdate={handleUpdatePartner2}
          />
      </div>

      {/* Passive Income Section */}
      <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">Passive Income</h3>
          {state.passiveIncomes.length === 0 && (
              <p className="text-sm text-gray-500 italic mb-3">
                  No passive income sources added yet.
              </p>
          )}
          {state.passiveIncomes.map((item) => (
              <PassiveIncomeItem 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdatePassiveIncome} 
                onRemove={handleRemovePassiveIncome} 
              />
          ))}
          <button 
            className="btn btn-sm btn-outline btn-primary mt-2" 
            onClick={handleAddPassiveIncome}
          >
            + Add Passive Income Source
          </button>
      </div>

      {/* One-Off Inflows Section */}
      <div className="mb-6">
          <h3 className="text-xl font-medium mb-3">One-Off Inflows</h3>
          {state.oneOffInflows.length === 0 && (
              <p className="text-sm text-gray-500 italic mb-3">
                  No one-off inflows added yet.
              </p>
          )}
          {state.oneOffInflows.map((item) => (
              <OneOffInflowItem 
                key={item.id} 
                item={item} 
                onUpdate={handleUpdateOneOffInflow} 
                onRemove={handleRemoveOneOffInflow} 
              />
          ))}
          <button 
            className="btn btn-sm btn-outline btn-primary mt-2" 
            onClick={handleAddOneOffInflow}
          >
            + Add One-Off Inflow
          </button>
      </div>
    </div>
  );
};

export default IncomeModule; 