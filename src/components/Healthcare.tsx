'use client';

import React, { useMemo } from 'react';
import HealthcareCoverageSelector from './HealthcareCoverageSelector';
import { type HouseholdComposition } from '@/types/household.types';
import { type HealthcareState, type HealthcareDetails, type CoverageType } from '@/types/healthcare.types';
import { formatNumberInput, parseFormattedNumber } from '@/utils/transformations/financial.transformations';
import { useCurrency } from '@/context/CurrencyContext';
import { formatDualCurrency } from '@/utils/formatting';

interface HealthcareProps {
  household: HouseholdComposition;
  healthcareState: HealthcareState;
  onHealthcareChange: (memberKey: string, detailsUpdate: Partial<HealthcareDetails>) => void;
}

const Healthcare: React.FC<HealthcareProps> = ({ 
  household,
  healthcareState,
  onHealthcareChange,
}) => {
  const { originCurrency, targetCurrency, effectiveRate } = useCurrency();

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

  const showOriginEquivalent = (amount: number | '' | undefined) => {
     const numericAmount = Number(amount);
     if (amount === null || amount === '' || amount === undefined || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate || numericAmount <= 0) return null;
     const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
     return `≈ ${formatted.origin}`;
  };

  const relevantMembers = Object.entries(household)
    .filter(([, count]) => count > 0)
    .filter(([ageGroup]) => 
      ['Adult', 'Parent', 'Grandparent'].includes(ageGroup)
    )
    .flatMap(([ageGroup, count]: [string, number]) => 
      Array.from({ length: count }, (_, i) => `${ageGroup}-${i + 1}`)
    );

  const handleInputChange = (
    memberKey: string,
    field: keyof HealthcareDetails,
    value: string
  ) => {
    onHealthcareChange(memberKey, { [field]: parseFormattedNumber(value) });
  };

  const totalMonthlyCost = useMemo(() => {
    return relevantMembers.reduce((total, memberKey) => {
      const details = healthcareState[memberKey];
      if (!details) return total;

      let memberTotal = 0;
      if ((details.type === 'Private' || details.type === 'Hybrid') && details.monthlyPremium) {
        memberTotal += Number(details.monthlyPremium) || 0;
      }
      memberTotal += Number(details.oopEstimate) || 0;
      memberTotal += Number(details.recurringMedical) || 0;

      return total + memberTotal;
    }, 0);
  }, [healthcareState, relevantMembers]);

  if (relevantMembers.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl mb-4">
        <div className="card-body">
          <h2 className="card-title">Healthcare</h2>
          <p>No household members require healthcare planning in this configuration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Healthcare</h2>
        <p className="text-sm mb-4">Configure healthcare coverage for each relevant adult.</p>
        
        {relevantMembers.map((memberKey: string) => {
          const memberDetails = healthcareState[memberKey];
          const premiumOriginEquiv = showOriginEquivalent(memberDetails?.monthlyPremium);
          const oopOriginEquiv = showOriginEquivalent(memberDetails?.oopEstimate);
          const recurringOriginEquiv = showOriginEquivalent(memberDetails?.recurringMedical);

          return (
          <div key={memberKey} className="mb-4 p-3 border rounded-md bg-base-100">
            <h3 className="font-medium mb-2">{memberKey.replace('-', ' ')}</h3>
            <HealthcareCoverageSelector
              memberKey={memberKey}
              currentSelection={memberDetails?.type}
              onChange={(update) => onHealthcareChange(memberKey, update)}
            />

            {(memberDetails?.type === 'Private' || memberDetails?.type === 'Hybrid') && (
              <div className="form-control w-full mb-2">
                <label className="label" htmlFor={`premium-${memberKey}`}>
                  <span className="label-text">Monthly Premium ({targetCurrency})</span>
                </label>
                <input
                  type="text"
                  id={`premium-${memberKey}`}
                  placeholder="e.g., 150"
                  className="input input-bordered w-full"
                  value={formatNumberInput(memberDetails?.monthlyPremium)}
                  onChange={(e) => handleInputChange(memberKey, 'monthlyPremium', e.target.value)}
                />
                {premiumOriginEquiv && (
                    <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                        {premiumOriginEquiv}
                    </div>
                )}
              </div>
            )}

            <div className="form-control w-full mb-2">
              <label className="label" htmlFor={`oop-${memberKey}`}>
                <span className="label-text">Est. Monthly OOP ({targetCurrency})</span>
                <span className="label-text-alt">(GP, Dental, Rx)</span>
              </label>
              <input
                type="text"
                id={`oop-${memberKey}`}
                placeholder="e.g., 50"
                className="input input-bordered w-full"
                value={formatNumberInput(memberDetails?.oopEstimate)}
                onChange={(e) => handleInputChange(memberKey, 'oopEstimate', e.target.value)}
              />
              {oopOriginEquiv && (
                  <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                      {oopOriginEquiv}
                  </div>
              )}
            </div>

            <div className="form-control w-full mb-2">
              <label className="label" htmlFor={`recurring-${memberKey}`}>
                <span className="label-text">Known Monthly Recurring ({targetCurrency})</span>
              </label>
              <input
                type="text"
                id={`recurring-${memberKey}`}
                placeholder="e.g., 0"
                className="input input-bordered w-full"
                value={formatNumberInput(memberDetails?.recurringMedical)}
                onChange={(e) => handleInputChange(memberKey, 'recurringMedical', e.target.value)}
              />
              {recurringOriginEquiv && (
                  <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                      {recurringOriginEquiv}
                  </div>
              )}
            </div>

          </div>
         );
        })}

        <div className="mt-4 pt-4 border-t border-base-300">
          <h3 className="text-lg font-semibold">Healthcare Cost Summary</h3>
          <div className="flex justify-between mt-2 items-center whitespace-normal">
            <span className="text-sm font-medium">Total Estimated Monthly Cost:</span>
            <span className="font-bold text-right">
              {renderDualCurrency(totalMonthlyCost)}
            </span>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-500 items-center whitespace-normal">
            <span className="text-xs">Total Estimated Annual Cost:</span>
            <span className="font-bold text-right">
              {renderDualCurrency(totalMonthlyCost * 12)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Healthcare;