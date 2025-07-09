'use client';

import React from 'react';
import { useProfileStore } from '@/src/store/slices/profileSlice';

export default function ProfilePage() {
  const { profile } = useProfileStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile & Household Setup</h1>
      
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile Information</h2>
          
          {profile ? (
            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text">Household Name</span>
                </label>
                <p className="font-medium">{profile.household.name}</p>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Origin Country</span>
                </label>
                <p className="font-medium">{profile.household.originCountry}</p>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text">Household Members</span>
                </label>
                <p className="font-medium">{profile.household.members.length} members</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-base-content/70 mb-4">
                Profile setup will be implemented in Task #8
              </p>
              <p className="text-sm text-base-content/50">
                For now, you can create scenarios without a profile.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}