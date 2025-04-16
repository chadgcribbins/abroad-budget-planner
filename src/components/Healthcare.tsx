'use client';

import React from 'react';
import HealthcareCoverageSelector from './HealthcareCoverageSelector';
import { type HouseholdComposition, type HealthcareState, type HealthcareDetails, type CoverageType } from '../app/page';
import { formatNumberInput, parseFormattedNumber } from '@/utils/transformations/financial.transformations'; // Import utilities

interface HealthcareProps {
  // ... existing code ...
  const handleInputChange = (
    memberKey: string,
    field: keyof HealthcareDetails,
    value: string
  ) => {
    onHealthcareChange(memberKey, { [field]: parseFormattedNumber(value) });
  };

  return (
    // ... existing code ...
            />

            {/* Conditional Premium Input */}
            {(healthcareState[memberKey]?.type === 'Private' || healthcareState[memberKey]?.type === 'Hybrid') && (
              <div className="form-control w-full mb-2">
                <label className="label" htmlFor={`premium-${memberKey}`}>
                  <span className="label-text">Monthly Premium (€)</span>
                </label>
                <input
                  type="text" // Use text for formatted input
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

    // ... existing code ...
  );
};

export default Healthcare;