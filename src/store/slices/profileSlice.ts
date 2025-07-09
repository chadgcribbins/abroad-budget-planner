import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile } from '@/src/types/scenario';

interface ProfileState {
  profile: Profile | null;
  
  // Actions
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile) => {
        set({ profile });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...updates,
              }
            : null,
        }));
      },

      clearProfile: () => {
        set({ profile: null });
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);