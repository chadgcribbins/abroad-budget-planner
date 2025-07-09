'use client';

import React, { useState } from 'react';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { HouseholdStep } from './HouseholdStep';
import { MembersStep } from './MembersStep';
import { ReviewStep } from './ReviewStep';
import { HouseholdFormData } from '@/src/types/profile';
import { cn } from '@/src/utils/cn';

interface ProfileSetupWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function ProfileSetupWizard({ onComplete, onCancel }: ProfileSetupWizardProps) {
  const { 
    profile, 
    createNewProfile, 
    updateHousehold,
    validateProfile,
    completeSetup,
    validationErrors 
  } = useProfileStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleHouseholdSubmit = (data: HouseholdFormData) => {
    if (!profile) {
      createNewProfile(data);
    } else {
      updateHousehold(data);
    }
    setCurrentStep(2);
  };

  const handleMembersComplete = () => {
    setCurrentStep(3);
  };

  const handleReviewComplete = () => {
    if (validateProfile()) {
      completeSetup();
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: 'Household Basics' },
    { number: 2, title: 'Family Members' },
    { number: 3, title: 'Review & Confirm' },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="w-full">
        <ul className="steps steps-horizontal w-full">
          {steps.map((step) => (
            <li
              key={step.number}
              className={cn(
                'step',
                currentStep >= step.number && 'step-primary'
              )}
            >
              <span className="hidden md:inline">{step.title}</span>
              <span className="md:hidden">{step.number}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Step Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          {currentStep === 1 && (
            <HouseholdStep
              initialData={profile?.household}
              onSubmit={handleHouseholdSubmit}
              onCancel={onCancel}
            />
          )}
          
          {currentStep === 2 && profile && (
            <MembersStep
              onNext={handleMembersComplete}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && profile && (
            <ReviewStep
              profile={profile}
              onComplete={handleReviewComplete}
              onBack={handleBack}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="text-center text-sm text-base-content/60">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );
}