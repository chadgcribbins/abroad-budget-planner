'use client';

import React from 'react';
import HealthcareCoverageSelector from './HealthcareCoverageSelector';
import { type HouseholdComposition, type HealthcareState, type HealthcareDetails } from '../app/page'; // Assuming types are exported

// TODO: Define type for Healthcare state (similar to EducationState) <-- No longer needed here

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
  // Determine relevant household members (e.g., Adults, Parents, Grandparents, maybe College?)
  // This logic might need refinement based on actual requirements
  const relevantMembers = Object.entries(household)
    .filter(([, count]) => count > 0) // Filter non-zero counts first
    .filter(([ageGroup]) => 
      ['Adult', 'Parent', 'Grandparent'].includes(ageGroup)
    )
    .flatMap(([ageGroup, count]: [string, number]) => // Explicitly type here
      Array.from({ length: count }, (_, i) => `${ageGroup}-${i + 1}`)
    );

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
              // TODO: Pass necessary props:
              memberKey={memberKey}
              currentSelection={healthcareState[memberKey]?.type}
              onChange={(update) => onHealthcareChange(memberKey, update)}
            />
            {/* TODO: Add inputs for OOP and Recurring Costs here */}
          </div>
        ))}

        {/* TODO: Add calculation and summary display */}
      </div>
    </div>
  );
};

export default Healthcare; 