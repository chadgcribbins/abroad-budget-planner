'use client';

import React from 'react';
// Assuming a Zustand store like this exists, adjust path if needed
// import { useAppStore } from '../store/store';

// Define types reused from page.tsx (consider moving to a shared types file)
const ageGroups = [
  'Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Parent', 'Grandparent'
] as const;
type AgeGroup = typeof ageGroups[number];
type HouseholdComposition = { [K in AgeGroup]: number };

interface HouseholdSetupProps {
  household: HouseholdComposition;
  durationOfStayYears: number;
  onHouseholdChange: (key: AgeGroup | 'durationOfStayYears', value: number) => void;
}

const HouseholdSetup: React.FC<HouseholdSetupProps> = ({ household, durationOfStayYears, onHouseholdChange }) => {
  // Remove placeholder state logic, now using props
  // const household = {
  //   Baby: 0,
  //   Primary: 0,
  //   Secondary: 0,
  //   College: 0,
  //   Adult: 0,
  //   Parent: 2, // Default assumption
  //   Grandparent: 0,
  //   durationOfStayYears: 5, // Default assumption
  // };
  // const setHouseholdValue = (key: keyof typeof household, value: number) => {
  //   console.log(`Setting ${key} to ${value}`);
  //   // TODO: Implement state update logic with Zustand
  // };

  const handleInputChange = (key: AgeGroup | 'durationOfStayYears', value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onHouseholdChange(key, numValue);
    } else if (value === '') {
      onHouseholdChange(key, 0); // Handle empty input
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Household Setup</h2>
        <p>Define who is moving and for how long.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {ageGroups.map((group) => (
            <div key={group} className="form-control">
              <label className="label">
                <span className="label-text">{group}s</span>
              </label>
              <input
                type="number"
                min="0"
                value={household[group]}
                onChange={(e) => handleInputChange(group, e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          ))}
        </div>

        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text">Planned Duration of Stay (Years)</span>
          </label>
          <input
            type="number"
            min="1"
            value={durationOfStayYears}
            onChange={(e) => handleInputChange('durationOfStayYears', e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        {/* Display Total People - optional */}
        {/* <div className="mt-4 font-semibold">
          Total People: {Object.values(household).reduce((sum, count) => typeof count === 'number' && count > 0 ? sum + count : sum, 0) - household.durationOfStayYears}
        </div> */}

      </div>
    </div>
  );
};

export default HouseholdSetup; 