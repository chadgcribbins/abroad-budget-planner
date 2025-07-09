'use client';

import React from 'react';
import { CURRENCY_NAMES, getCurrencyFlag } from '@/src/utils/currency';
import { openExchangeRatesService } from '@/src/services/openExchangeRates';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  excludeCurrencies?: string[];
}

export function CurrencySelector({
  value,
  onChange,
  label,
  placeholder = 'Select currency',
  className = '',
  disabled = false,
  excludeCurrencies = [],
}: CurrencySelectorProps) {
  const currencies = openExchangeRatesService
    .getSupportedCurrencies()
    .filter(currency => !excludeCurrencies.includes(currency))
    .sort((a, b) => CURRENCY_NAMES[a].localeCompare(CURRENCY_NAMES[b]));

  return (
    <div className={`form-control ${className}`}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select select-bordered w-full"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {currencies.map((currency) => (
          <option key={currency} value={currency}>
            {getCurrencyFlag(currency)} {currency} - {CURRENCY_NAMES[currency]}
          </option>
        ))}
      </select>
    </div>
  );
}