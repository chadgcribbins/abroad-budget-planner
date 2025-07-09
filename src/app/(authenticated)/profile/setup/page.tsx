'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { ProfileSetupWizard } from '@/src/components/profile/ProfileSetupWizard';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { profile, isSetupComplete } = useProfileStore();

  // If profile is already complete, redirect to profile page
  React.useEffect(() => {
    if (profile && isSetupComplete) {
      router.push('/profile');
    }
  }, [profile, isSetupComplete, router]);

  const handleComplete = () => {
    router.push('/scenarios');
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome! Let's Set Up Your Profile</h1>
        <p className="text-base-content/70 mt-2">
          This information helps us provide accurate financial calculations for your household.
        </p>
      </div>

      <ProfileSetupWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}