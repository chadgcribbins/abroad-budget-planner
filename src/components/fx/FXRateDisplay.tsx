'use client';

import React, { useEffect } from 'react';
import { useFXStore } from '@/src/store/slices/fxSlice';
import { formatCurrency, getCurrencyFlag } from '@/src/utils/currency';
import { formatDistanceToNow } from 'date-fns';

interface FXRateDisplayProps {
  from: string;
  to: string;
  showRefresh?: boolean;
  compact?: boolean;
}

export function FXRateDisplay({ 
  from, 
  to, 
  showRefresh = true,
  compact = false 
}: FXRateDisplayProps) {
  const { 
    getExchangeRate, 
    lastUpdated, 
    isLoading, 
    error,
    fetchLatestRates 
  } = useFXStore();

  const rate = getExchangeRate(from, to);

  useEffect(() => {
    // Fetch rates on mount if not already loaded
    if (!lastUpdated) {
      fetchLatestRates();
    }
  }, [lastUpdated, fetchLatestRates]);

  const handleRefresh = async () => {
    await fetchLatestRates();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">
          1 {from} = {formatCurrency(rate, to, { showSymbol: false })} {to}
        </span>
        {showRefresh && (
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="btn btn-ghost btn-xs"
            title="Refresh rates"
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              '↻'
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Exchange Rate</h3>
          {showRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="btn btn-ghost btn-xs"
              title="Refresh rates"
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                '↻'
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <span className="text-lg">{getCurrencyFlag(from)}</span>
            <span className="font-medium">1 {from}</span>
          </div>
          <span className="text-base-content/50">=</span>
          <div className="flex items-center gap-1">
            <span className="text-lg">{getCurrencyFlag(to)}</span>
            <span className="font-bold text-lg">
              {formatCurrency(rate, to, { showSymbol: false })} {to}
            </span>
          </div>
        </div>

        {error && (
          <div className="text-error text-xs mt-2">
            {error}
          </div>
        )}

        {lastUpdated && (
          <div className="text-xs text-base-content/50 mt-2">
            Updated {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
          </div>
        )}
      </div>
    </div>
  );
}