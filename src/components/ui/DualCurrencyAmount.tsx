'use client';

import React from 'react';
import { formatDualCurrency } from '@/src/utils/currency';
import { cn } from '@/src/utils/cn';

interface DualCurrencyAmountProps {
  amount: number;
  primaryCurrency: string;
  secondaryCurrency: string;
  exchangeRate: number;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  showSlash?: boolean;
}

export function DualCurrencyAmount({
  amount,
  primaryCurrency,
  secondaryCurrency,
  exchangeRate,
  className,
  primaryClassName,
  secondaryClassName,
  showSlash = true,
}: DualCurrencyAmountProps) {
  const { primary, secondary } = formatDualCurrency(
    amount,
    primaryCurrency,
    secondaryCurrency,
    exchangeRate
  );

  return (
    <span className={cn('inline-flex items-baseline gap-1', className)}>
      <span className={cn('font-bold', primaryClassName)}>{primary}</span>
      {showSlash && <span className="text-base-content/50">/</span>}
      <span className={cn('text-base-content/70', secondaryClassName)}>
        {secondary}
      </span>
    </span>
  );
}