'use client';

import React from 'react';
import { Scenario } from '@/src/types/scenario';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

interface ScenarioCardProps {
  scenario: Scenario;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ScenarioCard({ 
  scenario, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: ScenarioCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/scenarios/${scenario.id}`);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div 
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="card-body">
        <h2 className="card-title text-lg font-bold">{scenario.name}</h2>
        
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/70">Destination:</span>
            <span className="badge badge-primary">{scenario.destinationCountry}</span>
          </div>
          
          {scenario.residencyRegime && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70">Regime:</span>
              <span className="badge badge-secondary">{scenario.residencyRegime}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-base-content/70">Duration:</span>
            <span className="font-medium">{scenario.duration} years</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-base-content/70">Completion</span>
            <span className="text-xs font-medium">{scenario.completionStatus.overall}%</span>
          </div>
          <progress 
            className="progress progress-primary w-full" 
            value={scenario.completionStatus.overall} 
            max="100"
          />
        </div>

        {/* Metadata */}
        <div className="text-xs text-base-content/50 mt-3">
          Last modified {formatDistanceToNow(new Date(scenario.updatedAt), { addSuffix: true })}
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <button 
            className="btn btn-ghost btn-xs"
            onClick={(e) => handleAction(e, () => onDuplicate(scenario.id))}
          >
            Duplicate
          </button>
          <button 
            className="btn btn-ghost btn-xs"
            onClick={(e) => handleAction(e, () => onEdit(scenario.id))}
          >
            Edit
          </button>
          <button 
            className="btn btn-error btn-xs"
            onClick={(e) => handleAction(e, () => onDelete(scenario.id))}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}