'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { ProfileSummary } from '@/src/components/profile/ProfileSummary';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isSetupComplete } = useProfileStore();

  // Redirect to setup if no profile exists
  React.useEffect(() => {
    if (!profile || !isSetupComplete) {
      router.push('/profile/setup');
    }
  }, [profile, isSetupComplete, router]);

  if (!profile || !isSetupComplete) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <button
          onClick={() => router.push('/profile/edit')}
          className="btn btn-primary"
        >
          Edit Profile
        </button>
      </div>

      <ProfileSummary profile={profile} />

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/scenarios')}
              className="btn btn-outline"
            >
              View Scenarios
            </button>
            <button
              onClick={() => router.push('/scenarios')}
              className="btn btn-outline btn-primary"
            >
              Create New Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}