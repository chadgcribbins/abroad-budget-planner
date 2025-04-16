'use client';

import React from 'react';
import { formatNumberInput, parseFormattedNumber } from '@/utils/transformations/financial.transformations';

// Define types consistent with page.tsx
const ageGroups = [
  'Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Parent', 'Grandparent'
] as const;
type AgeGroup = typeof ageGroups[number];
type HouseholdComposition = { [K in AgeGroup]: number };
type EducationChoice = 'public' | 'private';
type EducationDetails = {
  choice: EducationChoice;
  annualTuition?: number | '';
  extraCosts?: number | '';
};
type EducationState = { [childKey: string]: EducationDetails };

interface EducationProps {
  household: HouseholdComposition;
  educationState: EducationState;
  onEducationChange: (childKey: string, details: Partial<EducationDetails>) => void;
  currencySymbol?: string; // Optional currency symbol
}

const relevantAgeGroups: AgeGroup[] = ['Primary', 'Secondary', 'College'];

const Education: React.FC<EducationProps> = ({
  household,
  educationState,
  onEducationChange,
  currencySymbol = '€', // Default to Euro
}) => {

  const handleInputChange = (
    childKey: string,
    field: 'annualTuition' | 'extraCosts',
    value: string
  ) => {
    const numericValue = parseFormattedNumber(value);
    if (!isNaN(numericValue) || value === '') {
      onEducationChange(childKey, { [field]: numericValue });
    }
  };

  // Helper to generate child elements
  const renderChildInputs = () => {
    const elements: JSX.Element[] = [];
    relevantAgeGroups.forEach(ageGroup => {
      const count = household[ageGroup] || 0;
      for (let i = 0; i < count; i++) {
        const childKey = `${ageGroup.toLowerCase()}-${i}`;
        const currentDetails = educationState[childKey] || { choice: 'public' }; // Default to public
        const currentChoice = currentDetails.choice;

        elements.push(
          <div key={childKey} className="mb-4 p-3 border rounded-md bg-base-200/30">
            {/* Toggle Switch */}
            <div className="form-control w-full max-w-xs mb-2">
              <label className="label cursor-pointer">
                <span className="label-text font-medium">{`${ageGroup} Child ${i + 1} Education`}</span>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${currentChoice === 'public' ? 'font-semibold text-primary' : ''}`}>Public</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={currentChoice === 'private'}
                    onChange={(e) => onEducationChange(childKey, { choice: e.target.checked ? 'private' : 'public' })}
                    data-testid={`education-toggle-${childKey}`}
                  />
                  <span className={`ml-2 text-sm ${currentChoice === 'private' ? 'font-semibold text-primary' : ''}`}>Private</span>
                </div>
              </label>
            </div>

            {/* Conditional Inputs for Private */}
            {currentChoice === 'private' && (
              <div className="mt-2 space-y-2 pl-2 border-l-2 border-primary/50">
                {/* Annual Tuition */}
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Annual Tuition ({currencySymbol})</span>
                  </label>
                  <input
                    type="text" // Use text for formatted input
                    placeholder="e.g., 10,000"
                    className="input input-bordered w-full max-w-xs input-sm"
                    value={formatNumberInput(currentDetails.annualTuition)}
                    onChange={(e) => handleInputChange(childKey, 'annualTuition', e.target.value)}
                    inputMode="decimal" // Hint for mobile keyboards
                  />
                </div>

                {/* Extra Costs */}
                <div className="form-control w-full max-w-xs">
                  <label className="label">
                    <span className="label-text">Annual Extra Costs ({currencySymbol})</span>
                    <span className="label-text-alt">(Books, Uniforms, Activities)</span>
                  </label>
                  <input
                    type="text" // Use text for formatted input
                    placeholder="e.g., 500"
                    className="input input-bordered w-full max-w-xs input-sm"
                    value={formatNumberInput(currentDetails.extraCosts)}
                    onChange={(e) => handleInputChange(childKey, 'extraCosts', e.target.value)}
                    inputMode="decimal"
                  />
                </div>
              </div>
            )}
          </div>
        );
      }
    });
    return elements;
  };

  const childInputs = renderChildInputs();

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Education Choices & Costs</h2>
        <p className="text-sm text-base-content/70 mb-4">Select public or private schooling for each child. For private, enter estimated annual costs.</p>
        
        {childInputs.length > 0 ? (
          childInputs
        ) : (
          <div className="p-4 text-center text-base-content/60 bg-base-200/50 rounded-md">
            Add children in Primary, Secondary, or College age groups in Household Setup to configure education costs.
          </div>
        )}

        {/* TODO: Calculate and display monthly/annual totals */}
      </div>
    </div>
  );
};

export default Education; 