'use client';

import React, { useState, useEffect } from 'react';
import { useFXStore } from '@/src/store/slices/fxSlice';
import { getCurrencyFlag } from '@/src/utils/currency';
import { CurrencySelector } from './CurrencySelector';

interface RateOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFrom?: string;
  defaultTo?: string;
}

export function RateOverrideModal({
  isOpen,
  onClose,
  defaultFrom = 'USD',
  defaultTo = 'EUR',
}: RateOverrideModalProps) {
  const { setRateOverride, getExchangeRate, clearRateOverride } = useFXStore();
  
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [rate, setRate] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Get current rate to show as placeholder
      const currentRate = getExchangeRate(fromCurrency, toCurrency);
      setRate(currentRate.toFixed(4));
    }
  }, [isOpen, fromCurrency, toCurrency, getExchangeRate]);

  const handleSave = () => {
    const numericRate = parseFloat(rate);
    if (!isNaN(numericRate) && numericRate > 0) {
      setRateOverride(fromCurrency, toCurrency, numericRate);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    }
  };

  const handleClearOverride = () => {
    clearRateOverride(fromCurrency, toCurrency);
    const currentRate = getExchangeRate(fromCurrency, toCurrency);
    setRate(currentRate.toFixed(4));
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Manual Exchange Rate Override</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              label="From Currency"
              excludeCurrencies={[toCurrency]}
            />
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              label="To Currency"
              excludeCurrencies={[fromCurrency]}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Exchange Rate</span>
              <span className="label-text-alt">
                1 {fromCurrency} = ? {toCurrency}
              </span>
            </label>
            <div className="input-group">
              <span className="bg-base-200 px-3 flex items-center">
                {getCurrencyFlag(fromCurrency)} 1 {fromCurrency} =
              </span>
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="input input-bordered flex-1"
                placeholder="Enter rate"
              />
              <span className="bg-base-200 px-3 flex items-center">
                {getCurrencyFlag(toCurrency)} {toCurrency}
              </span>
            </div>
          </div>

          {showSuccess && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Rate override saved successfully!</span>
            </div>
          )}

          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm">
              <p>Manual rates override API rates for this currency pair.</p>
              <p>Use this for more accurate or preferred exchange rates.</p>
            </div>
          </div>
        </div>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleClearOverride}
          >
            Clear Override
          </button>
          <button
            type="button"
            className="btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!rate || parseFloat(rate) <= 0}
          >
            Save Override
          </button>
        </div>
      </div>
    </div>
  );
}