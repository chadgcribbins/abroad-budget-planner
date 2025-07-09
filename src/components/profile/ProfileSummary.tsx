'use client';

import React from 'react';
import { Profile, ROLE_CONFIG, AGE_GROUP_CONFIG } from '@/src/types/profile';
import { getCurrencyFlag, getCountryCurrencies } from '@/src/utils/currency';
import { getMemberCountByRole, getMemberCountByAgeGroup } from '@/src/utils/profileValidation';
import { formatDistanceToNow } from 'date-fns';

interface ProfileSummaryProps {
  profile: Profile;
}

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const memberCounts = getMemberCountByRole(profile.household.members);
  const ageGroupCounts = getMemberCountByAgeGroup(profile.household.members);
  const originCurrency = getCountryCurrencies(profile.household.originCountry)[0];

  return (
    <div className="space-y-6">
      {/* Household Overview */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Household Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">Household Name</span>
              </label>
              <p className="font-medium text-lg">{profile.household.name}</p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Origin Country</span>
              </label>
              <p className="font-medium text-lg flex items-center gap-2">
                <span className="text-2xl">{getCurrencyFlag(originCurrency)}</span>
                {profile.household.originCountry}
                <span className="text-sm text-base-content/70">({originCurrency})</span>
              </p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Total Members</span>
              </label>
              <p className="font-medium text-lg">{profile.household.members.length}</p>
            </div>
            
            <div>
              <label className="label">
                <span className="label-text">Profile Created</span>
              </label>
              <p className="font-medium">
                {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Family Composition */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Family Composition</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(ROLE_CONFIG).map(([role, config]) => {
              const count = memberCounts[role] || 0;
              return (
                <div key={role} className="text-center">
                  <div className="stat-value text-2xl">{count}</div>
                  <div className="stat-desc">{config.label}{count !== 1 ? 's' : ''}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Family Members */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Family Members</h2>
          
          <div className="space-y-3">
            {profile.household.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="avatar placeholder">
                    <div className="bg-primary text-primary-content rounded-full w-10">
                      <span>{member.name.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-base-content/70">
                      {ROLE_CONFIG[member.role].label}
                      {member.ageGroup && ` • ${AGE_GROUP_CONFIG[member.ageGroup].label}`}
                      {member.isPrimary && (
                        <span className="badge badge-primary badge-sm ml-2">Primary Earner</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Age Distribution */}
      {Object.keys(ageGroupCounts).length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Age Distribution</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(AGE_GROUP_CONFIG).map(([ageGroup, config]) => {
                const count = ageGroupCounts[ageGroup] || 0;
                if (count === 0) return null;
                
                return (
                  <div key={ageGroup} className="bg-base-200 rounded-lg p-3">
                    <div className="text-lg font-medium">{count}</div>
                    <div className="text-sm text-base-content/70">{config.label}</div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}