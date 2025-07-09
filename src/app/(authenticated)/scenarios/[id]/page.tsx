'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useScenarioStore } from '@/src/store/slices/scenarioSlice';

export default function ScenarioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getScenario } = useScenarioStore();
  
  const scenario = params.id ? getScenario(params.id as string) : null;

  if (!scenario) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-base-content/70 mb-4">Scenario not found</p>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/scenarios')}
        >
          Back to Scenarios
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{scenario.name}</h1>
        <button 
          className="btn btn-ghost"
          onClick={() => router.push('/scenarios')}
        >
          Back to Scenarios
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Scenario Details</h2>
            <div className="space-y-2">
              <p><strong>Destination:</strong> {scenario.destinationCountry}</p>
              {scenario.residencyRegime && (
                <p><strong>Residency Regime:</strong> {scenario.residencyRegime}</p>
              )}
              <p><strong>Duration:</strong> {scenario.duration} years</p>
              <p><strong>Created:</strong> {new Date(scenario.createdAt).toLocaleDateString()}</p>
              <p><strong>Last Updated:</strong> {new Date(scenario.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Completion Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span>Overall Progress</span>
                  <span className="font-bold">{scenario.completionStatus.overall}%</span>
                </div>
                <progress 
                  className="progress progress-primary w-full" 
                  value={scenario.completionStatus.overall} 
                  max="100"
                />
              </div>
              <p className="text-sm text-base-content/60">
                Individual modules will be implemented in upcoming tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>
            Module implementation (Income, Housing, Education, etc.) will be added in Tasks 9-15.
          </span>
        </div>
      </div>
    </div>
  );
}