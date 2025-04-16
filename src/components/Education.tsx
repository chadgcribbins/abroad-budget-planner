'use client';

import React from 'react';

// Define types consistent with page.tsx
const ageGroups = [
  'Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Parent', 'Grandparent'
] as const;
type AgeGroup = typeof ageGroups[number];
type HouseholdComposition = { [K in AgeGroup]: number };
type EducationChoice = 'public' | 'private';
type EducationState = { [childKey: string]: EducationChoice };

interface EducationProps {
  household: HouseholdComposition;
  educationChoices: EducationState;
  onEducationChange: (childKey: string, choice: EducationChoice) => void;
}

const relevantAgeGroups: AgeGroup[] = ['Primary', 'Secondary', 'College'];

const Education: React.FC<EducationProps> = ({
  household,
  educationChoices,
  onEducationChange,
}) => {
  
  // Helper to generate child elements
  const renderChildToggles = () => {
    const elements: JSX.Element[] = [];
    relevantAgeGroups.forEach(ageGroup => {
      const count = household[ageGroup] || 0;
      for (let i = 0; i < count; i++) {
        const childKey = `${ageGroup.toLowerCase()}-${i}`;
        const currentChoice = educationChoices[childKey] || 'public'; // Default to public

        elements.push(
          <div key={childKey} className="form-control w-full max-w-xs mb-2">
            <label className="label cursor-pointer">
              <span className="label-text">{`${ageGroup} Child ${i + 1} Education`}</span>
              <div className="flex items-center">
                <span className={`mr-2 text-sm ${currentChoice === 'public' ? 'font-semibold' : ''}`}>Public</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={currentChoice === 'private'}
                  onChange={(e) => onEducationChange(childKey, e.target.checked ? 'private' : 'public')}
                />
                <span className={`ml-2 text-sm ${currentChoice === 'private' ? 'font-semibold' : ''}`}>Private</span>
              </div>
            </label>
          </div>
        );
      }
    });
    return elements;
  };

  const childToggles = renderChildToggles();

  if (childToggles.length === 0) {
    return null; // Don't render the card if there are no relevant children
  }

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Education Choices</h2>
        {childToggles}
        {/* TODO: Add fields for private school costs (tuition, extras) when 'private' is selected */}
      </div>
    </div>
  );
};

export default Education; 