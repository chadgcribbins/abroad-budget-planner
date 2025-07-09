'use client';

import React, { useEffect } from 'react';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { Profile } from '@/src/types/scenario';

export function TempProfileSetup() {
  const { profile, setProfile } = useProfileStore();

  useEffect(() => {
    // Set up a temporary profile if none exists
    if (!profile) {
      const tempProfile: Profile = {
        id: 'temp-profile-1',
        household: {
          name: 'Smith Family',
          originCountry: 'UK',
          members: [
            {
              id: 'member-1',
              name: 'John Smith',
              role: 'Adult',
              ageGroup: 'Adult',
            },
            {
              id: 'member-2', 
              name: 'Jane Smith',
              role: 'Adult',
              ageGroup: 'Adult',
            },
          ],
        },
      };
      
      setProfile(tempProfile);
    }
  }, [profile, setProfile]);

  return null;
}