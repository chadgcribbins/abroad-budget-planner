'use client';

import React from 'react';
import { type HealthcareDetails, type CoverageType } from '../app/page'; // Import necessary types

// Define props interface
interface HealthcareCoverageSelectorProps {
  memberKey: string;
  currentSelection?: CoverageType;
  onChange: (detailsUpdate: Partial<HealthcareDetails>) => void;
}

const HealthcareCoverageSelector: React.FC<HealthcareCoverageSelectorProps> = ({
  memberKey, // Destructure props
  currentSelection,
  onChange,
}) => {
  const coverageTypes = ['Public', 'Private', 'Hybrid'] as const;
  // type CoverageType = typeof coverageTypes[number]; // Already imported

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = event.target.value as CoverageType;
    // Call onChange prop handler with the type update
    onChange({ type: selectedType });
  };

  return (
    <div className="form-control w-full mb-2">
      <label className="label" htmlFor={`coverage-${memberKey}`}>
        <span className="label-text">Coverage Type</span>
      </label>
      <select
        id={`coverage-${memberKey}`} // Add id for label association
        className="select select-bordered w-full"
        onChange={handleChange}
        value={currentSelection || ''} // Set value based on prop, default to empty string if undefined
      >
        <option value="" disabled>Select Coverage</option>
        {coverageTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {/* TODO: Add conditional rendering for premium input */}
    </div>
  );
};

export default HealthcareCoverageSelector; 