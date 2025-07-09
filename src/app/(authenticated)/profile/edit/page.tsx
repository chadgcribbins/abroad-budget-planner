'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { ProfileSetupWizard } from '@/src/components/profile/ProfileSetupWizard';

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile } = useProfileStore();

  // If no profile exists, redirect to setup
  React.useEffect(() => {
    if (!profile) {
      router.push('/profile/setup');
    }
  }, [profile, router]);

  const handleComplete = () => {
    router.push('/profile');
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Your Profile</h1>
        <p className="text-base-content/70 mt-2">
          Update your household information and family members.
        </p>
      </div>

      <ProfileSetupWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}