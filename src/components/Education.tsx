'use client';

import React, { useMemo } from 'react';
import { formatNumberInput, parseFormattedNumber } from '@/utils/transformations/financial.transformations';
import { useCurrency } from '@/context/CurrencyContext'; // Import context hook
import { formatDualCurrency } from '@/utils/formatting'; // Import formatter

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
}

const relevantAgeGroups: AgeGroup[] = ['Primary', 'Secondary', 'College'];

const Education: React.FC<EducationProps> = ({
  household,
  educationState,
  onEducationChange,
}) => {
  const { originCurrency, targetCurrency, effectiveRate } = useCurrency(); // Get currency context

  // Helper to render dual currency format
  const renderDualCurrency = (amount: number | null | '') => {
    const numericAmount = Number(amount);
    if (amount === null || amount === '' || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate) return 'N/A';

    const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
    return (
      <>
        <span className="font-bold">{formatted.destination}</span>
        <span className="text-sm font-normal"> / {formatted.origin}</span>
      </>
    );
  };

  // Helper to display origin currency equivalent below inputs
  const showOriginEquivalent = (amount: number | '') => {
     const numericAmount = Number(amount);
     if (amount === null || amount === '' || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate || numericAmount <= 0) return null;
     const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
     return `≈ ${formatted.origin}`;
  };

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

  // Calculate costs - using useMemo for potential optimization
  const educationCosts = useMemo(() => {
    let totalAnnualCost = 0;
    const childCosts: { [key: string]: { annual: number, monthly: number } } = {};

    Object.entries(educationState).forEach(([childKey, details]) => {
      if (details.choice === 'private') {
        const annualTuition = Number(details.annualTuition || 0);
        const extraCosts = Number(details.extraCosts || 0);
        const childAnnual = annualTuition + extraCosts;
        const childMonthly = childAnnual / 12;
        
        childCosts[childKey] = { annual: childAnnual, monthly: childMonthly };
        totalAnnualCost += childAnnual;
      }
    });

    const totalMonthlyCost = totalAnnualCost / 12;
    return { childCosts, totalAnnualCost, totalMonthlyCost };
  }, [educationState]);

  // Helper to generate child elements
  const renderChildInputs = () => {
    const elements: JSX.Element[] = [];
    relevantAgeGroups.forEach(ageGroup => {
      const count = household[ageGroup] || 0;
      for (let i = 0; i < count; i++) {
        const childKey = `${ageGroup.toLowerCase()}-${i}`;
        const currentDetails = educationState[childKey] || { choice: 'public' }; // Default to public
        const currentChoice = currentDetails.choice;
        const costs = educationCosts.childCosts[childKey];
        const tuitionOriginEquiv = showOriginEquivalent(currentDetails.annualTuition ?? '');
        const extrasOriginEquiv = showOriginEquivalent(currentDetails.extraCosts ?? '');

        elements.push(
          <div key={childKey} className="mb-4 p-3 border rounded-md bg-base-200/30">
            {/* Toggle Switch */}
            <div className="form-control w-full mb-2">
              <label className="label cursor-pointer">
                <span className="label-text font-medium md:text-lg">{`${ageGroup} Child ${i + 1} Education`}</span>
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
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-sm md:text-base">Annual Tuition ({targetCurrency})</span>
                  </label>
                  <input
                    type="text" // Use text for formatted input
                    placeholder="e.g., 10,000"
                    className="input input-bordered w-full input"
                    value={formatNumberInput(currentDetails.annualTuition)}
                    onChange={(e) => handleInputChange(childKey, 'annualTuition', e.target.value)}
                    inputMode="decimal" // Hint for mobile keyboards
                  />
                  {tuitionOriginEquiv && (
                    <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                      {tuitionOriginEquiv} / yr
                    </div>
                   )}
                </div>

                {/* Extra Costs */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-sm md:text-base">Annual Extra Costs ({targetCurrency})</span>
                    <span className="label-text-alt">(Books, Uniforms, Activities)</span>
                  </label>
                  <input
                    type="text" // Use text for formatted input
                    placeholder="e.g., 500"
                    className="input input-bordered w-full input"
                    value={formatNumberInput(currentDetails.extraCosts)}
                    onChange={(e) => handleInputChange(childKey, 'extraCosts', e.target.value)}
                    inputMode="decimal"
                  />
                   {extrasOriginEquiv && (
                    <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                      {extrasOriginEquiv} / yr
                    </div>
                   )}
                </div>

                {/* Display Per-Child Monthly Cost - Apply formatting */}
                {costs && (
                  <div className="mt-2 text-sm text-right font-medium whitespace-normal">
                    Avg. Monthly Cost: {renderDualCurrency(costs.monthly)}
                  </div>
                )}
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
        <h2 className="card-title lg:text-2xl">Education Choices & Costs</h2>
        <p className="text-sm md:text-base text-base-content/70 mb-4">Select public or private schooling for each child. For private, enter estimated annual costs.</p>
        
        {childInputs.length > 0 ? (
          childInputs
        ) : (
          <div className="p-4 text-center text-base-content/60 bg-base-200/50 rounded-md">
            Add children in Primary, Secondary, or College age groups in Household Setup to configure education costs.
          </div>
        )}

        {/* Display Household Totals - Apply formatting */}
        {childInputs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-base-300 text-right">
            <p className="font-semibold md:text-lg whitespace-normal">
              Total Avg. Monthly Education Cost: {renderDualCurrency(educationCosts.totalMonthlyCost)}
            </p>
            <p className="text-sm md:text-base text-base-content/80 whitespace-normal">
              (Total Annual: {renderDualCurrency(educationCosts.totalAnnualCost)})
            </p>
          </div>
        )}

        {/* TODO: Integrate totals with overall budget summary */}
      </div>
    </div>
  );
};

export default Education; 