'use client';

import React from 'react';
import { Profile, ROLE_CONFIG, AGE_GROUP_CONFIG } from '@/src/types/profile';
import { getCurrencyFlag, getCountryCurrencies } from '@/src/utils/currency';

interface ReviewStepProps {
  profile: Profile;
  onComplete: () => void;
  onBack: () => void;
  validationErrors: string[];
}

export function ReviewStep({ profile, onComplete, onBack, validationErrors }: ReviewStepProps) {
  const originCurrency = getCountryCurrencies(profile.household.originCountry)[0];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Review Your Profile</h2>
        <p className="text-base-content/70">
          Please review your household information before completing setup.
        </p>
      </div>

      {/* Household Summary */}
      <div className="bg-base-200 rounded-lg p-4 space-y-4">
        <div>
          <h3 className="font-medium mb-2">Household Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-base-content/70">Name:</span>
              <span className="ml-2 font-medium">{profile.household.name}</span>
            </div>
            <div>
              <span className="text-base-content/70">Origin:</span>
              <span className="ml-2 font-medium">
                {getCurrencyFlag(originCurrency)} {profile.household.originCountry} ({originCurrency})
              </span>
            </div>
          </div>
        </div>

        <div className="divider my-2"></div>

        <div>
          <h3 className="font-medium mb-2">Family Members ({profile.household.members.length})</h3>
          <div className="space-y-2">
            {profile.household.members.map((member) => (
              <div key={member.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-8">
                      <span className="text-xs">{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <div className="text-base-content/70">
                  {ROLE_CONFIG[member.role].label}
                  {member.ageGroup && ` • ${AGE_GROUP_CONFIG[member.ageGroup].label}`}
                  {member.isPrimary && (
                    <span className="badge badge-primary badge-xs ml-2">Primary</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Please fix the following issues:</h3>
            <ul className="mt-2 ml-4 list-disc">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Confirmation */}
      <div className="alert alert-info">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <div>
          <p className="font-medium">Ready to create scenarios!</p>
          <p className="text-sm">
            You can always edit your profile later from the profile page.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-ghost"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onComplete}
          disabled={validationErrors.length > 0}
          className="btn btn-primary"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}