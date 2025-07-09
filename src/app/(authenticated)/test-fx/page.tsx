'use client';

import React, { useState } from 'react';
import { useFXStore } from '@/src/store/slices/fxSlice';
import { CurrencySelector } from '@/src/components/fx/CurrencySelector';
import { FXRateDisplay } from '@/src/components/fx/FXRateDisplay';
import { RateOverrideModal } from '@/src/components/fx/RateOverrideModal';
import { DualCurrencyAmount } from '@/src/components/ui/DualCurrencyAmount';
import { formatCurrency } from '@/src/utils/currency';

export default function TestFXPage() {
  const { getExchangeRate, isLoading, error } = useFXStore();
  
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState(1000);
  const [isRateOverrideModalOpen, setIsRateOverrideModalOpen] = useState(false);

  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = amount * exchangeRate;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Currency Exchange Test</h1>
      
      {/* Exchange Rate Display */}
      <FXRateDisplay
        from={fromCurrency}
        to={toCurrency}
        showRefresh={true}
        compact={false}
      />

      {/* Currency Converter */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Currency Converter</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Amount</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="input input-bordered"
              />
            </div>
            
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              label="From"
              excludeCurrencies={[toCurrency]}
            />
            
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              label="To"
              excludeCurrencies={[fromCurrency]}
            />
          </div>

          <div className="divider"></div>

          <div className="text-center">
            <p className="text-2xl font-bold">
              {formatCurrency(amount, fromCurrency)} = {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-sm text-base-content/70 mt-2">
              Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
          </div>

          <button
            className="btn btn-primary mt-4"
            onClick={() => setIsRateOverrideModalOpen(true)}
          >
            Override Exchange Rate
          </button>
        </div>
      </div>

      {/* Dual Currency Display Examples */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Dual Currency Display Examples</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-base-content/70 mb-1">Monthly Rent:</p>
              <DualCurrencyAmount
                amount={1500}
                primaryCurrency={toCurrency}
                secondaryCurrency={fromCurrency}
                exchangeRate={1 / exchangeRate}
              />
            </div>
            
            <div>
              <p className="text-sm text-base-content/70 mb-1">Annual Income:</p>
              <DualCurrencyAmount
                amount={75000}
                primaryCurrency={fromCurrency}
                secondaryCurrency={toCurrency}
                exchangeRate={exchangeRate}
              />
            </div>
            
            <div>
              <p className="text-sm text-base-content/70 mb-1">School Fees:</p>
              <DualCurrencyAmount
                amount={12000}
                primaryCurrency={toCurrency}
                secondaryCurrency={fromCurrency}
                exchangeRate={1 / exchangeRate}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Rate Override Modal */}
      <RateOverrideModal
        isOpen={isRateOverrideModalOpen}
        onClose={() => setIsRateOverrideModalOpen(false)}
        defaultFrom={fromCurrency}
        defaultTo={toCurrency}
      />
    </div>
  );
}