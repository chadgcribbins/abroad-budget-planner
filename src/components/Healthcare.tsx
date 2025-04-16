'use client';

import React, { useMemo } from 'react';
import HealthcareCoverageSelector from './HealthcareCoverageSelector';
import { type HouseholdComposition, type HealthcareState, type HealthcareDetails, type CoverageType } from '../app/page';
import { formatNumberInput, parseFormattedNumber } from '@/utils/transformations/financial.transformations';

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
  // Determine relevant household members
  const relevantMembers = Object.entries(household)
    .filter(([, count]) => count > 0)
    .filter(([ageGroup]) => 
      ['Adult', 'Parent', 'Grandparent'].includes(ageGroup)
    )
    .flatMap(([ageGroup, count]: [string, number]) => 
      Array.from({ length: count }, (_, i) => `${ageGroup}-${i + 1}`)
    );

  // Handler for input changes within this component
  const handleInputChange = (
    memberKey: string,
    field: keyof HealthcareDetails,
    value: string
  ) => {
    onHealthcareChange(memberKey, { [field]: parseFormattedNumber(value) });
  };

  // Calculate total monthly healthcare costs
  const totalMonthlyCost = useMemo(() => {
    return relevantMembers.reduce((total, memberKey) => {
      const details = healthcareState[memberKey];
      if (!details) return total;

      let memberTotal = 0;
      // Add premium if applicable
      if ((details.type === 'Private' || details.type === 'Hybrid') && details.monthlyPremium) {
        memberTotal += Number(details.monthlyPremium) || 0;
      }
      // Add OOP estimate
      memberTotal += Number(details.oopEstimate) || 0;
      // Add recurring medical costs
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
        
        {relevantMembers.map((memberKey: string) => (
          <div key={memberKey} className="mb-4 p-3 border rounded-md bg-base-100">
            <h3 className="font-medium mb-2">{memberKey.replace('-', ' ')}</h3>
            <HealthcareCoverageSelector
              memberKey={memberKey}
              currentSelection={healthcareState[memberKey]?.type}
              onChange={(update) => onHealthcareChange(memberKey, update)}
            />

            {/* Conditional Premium Input */}
            {(healthcareState[memberKey]?.type === 'Private' || healthcareState[memberKey]?.type === 'Hybrid') && (
              <div className="form-control w-full mb-2">
                <label className="label" htmlFor={`premium-${memberKey}`}>
                  <span className="label-text">Monthly Premium (€)</span>
                </label>
                <input
                  type="text"
                  id={`premium-${memberKey}`}
                  placeholder="e.g., 150"
                  className="input input-bordered w-full"
                  value={formatNumberInput(healthcareState[memberKey]?.monthlyPremium)}
                  onChange={(e) => handleInputChange(memberKey, 'monthlyPremium', e.target.value)}
                />
              </div>
            )}

            {/* OOP Estimate Input */}
            <div className="form-control w-full mb-2">
              <label className="label" htmlFor={`oop-${memberKey}`}>
                <span className="label-text">Est. Monthly OOP (€)</span>
                <span className="label-text-alt">(GP, Dental, Rx)</span>
              </label>
              <input
                type="text"
                id={`oop-${memberKey}`}
                placeholder="e.g., 50"
                className="input input-bordered w-full"
                value={formatNumberInput(healthcareState[memberKey]?.oopEstimate)}
                onChange={(e) => handleInputChange(memberKey, 'oopEstimate', e.target.value)}
              />
            </div>

            {/* Recurring Medical Costs Input */}
            <div className="form-control w-full mb-2">
              <label className="label" htmlFor={`recurring-${memberKey}`}>
                <span className="label-text">Known Monthly Recurring (€)</span>
              </label>
              <input
                type="text"
                id={`recurring-${memberKey}`}
                placeholder="e.g., 0"
                className="input input-bordered w-full"
                value={formatNumberInput(healthcareState[memberKey]?.recurringMedical)}
                onChange={(e) => handleInputChange(memberKey, 'recurringMedical', e.target.value)}
              />
            </div>

          </div>
        ))}

        {/* Display Total Costs */}
        <div className="mt-4 pt-4 border-t border-base-300">
          <h3 className="text-lg font-semibold">Healthcare Cost Summary</h3>
          <div className="flex justify-between mt-2">
            <span>Total Estimated Monthly Cost:</span>
            <span className="font-bold">€{formatNumberInput(totalMonthlyCost)}</span>
          </div>
          <div className="flex justify-between mt-1 text-sm text-gray-500">
            <span>Total Estimated Annual Cost:</span>
            <span className="font-bold">€{formatNumberInput(totalMonthlyCost * 12)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Healthcare;