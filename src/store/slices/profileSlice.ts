import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, FamilyMember, Household } from '@/src/types/profile';
import { validateProfile, getMemberCountByRole, getMemberCountByAgeGroup } from '@/src/utils/profileValidation';
import { v4 as uuidv4 } from 'uuid';

interface ProfileState {
  profile: Profile | null;
  isSetupComplete: boolean;
  validationErrors: string[];
  
  // Actions
  setProfile: (profile: Profile) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updateHousehold: (household: Partial<Household>) => void;
  clearProfile: () => void;
  
  // Member management
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  removeMember: (memberId: string) => void;
  reorderMembers: (memberIds: string[]) => void;
  
  // Validation
  validateProfile: () => boolean;
  
  // Computed properties
  getMemberCounts: () => { byRole: Record<string, number>; byAgeGroup: Record<string, number> };
  hasAdultMember: () => boolean;
  getPrimaryMember: () => FamilyMember | null;
  
  // Setup wizard
  createNewProfile: (household: Omit<Household, 'members'>) => void;
  completeSetup: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isSetupComplete: false,
      validationErrors: [],

      setProfile: (profile) => {
        set({ 
          profile,
          isSetupComplete: true,
          validationErrors: []
        });
      },

      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : null,
        }));
      },

      updateHousehold: (household) => {
        set((state) => ({
          profile: state.profile
            ? {
                ...state.profile,
                household: {
                  ...state.profile.household,
                  ...household,
                },
                updatedAt: new Date().toISOString(),
              }
            : null,
        }));
      },

      clearProfile: () => {
        set({ 
          profile: null,
          isSetupComplete: false,
          validationErrors: []
        });
      },

      // Member management
      addMember: (memberData) => {
        const member: FamilyMember = {
          ...memberData,
          id: uuidv4(),
        };
        
        set((state) => {
          if (!state.profile) return state;
          
          const newProfile = {
            ...state.profile,
            household: {
              ...state.profile.household,
              members: [...state.profile.household.members, member],
            },
            updatedAt: new Date().toISOString(),
          };
          
          return { profile: newProfile };
        });
      },

      updateMember: (memberId, updates) => {
        set((state) => {
          if (!state.profile) return state;
          
          const newProfile = {
            ...state.profile,
            household: {
              ...state.profile.household,
              members: state.profile.household.members.map((member) =>
                member.id === memberId ? { ...member, ...updates } : member
              ),
            },
            updatedAt: new Date().toISOString(),
          };
          
          return { profile: newProfile };
        });
      },

      removeMember: (memberId) => {
        set((state) => {
          if (!state.profile) return state;
          
          const newProfile = {
            ...state.profile,
            household: {
              ...state.profile.household,
              members: state.profile.household.members.filter(
                (member) => member.id !== memberId
              ),
            },
            updatedAt: new Date().toISOString(),
          };
          
          return { profile: newProfile };
        });
      },

      reorderMembers: (memberIds) => {
        set((state) => {
          if (!state.profile) return state;
          
          const membersMap = new Map(
            state.profile.household.members.map((m) => [m.id, m])
          );
          
          const newMembers = memberIds
            .map((id) => membersMap.get(id))
            .filter((m): m is FamilyMember => m !== undefined);
          
          const newProfile = {
            ...state.profile,
            household: {
              ...state.profile.household,
              members: newMembers,
            },
            updatedAt: new Date().toISOString(),
          };
          
          return { profile: newProfile };
        });
      },

      // Validation
      validateProfile: () => {
        const state = get();
        if (!state.profile) {
          set({ validationErrors: ['Profile not found'] });
          return false;
        }
        
        const errors = validateProfile(state.profile);
        const errorMessages = errors.map((e) => e.message);
        set({ validationErrors: errorMessages });
        
        return errors.length === 0;
      },

      // Computed properties
      getMemberCounts: () => {
        const state = get();
        if (!state.profile) {
          return { byRole: {}, byAgeGroup: {} };
        }
        
        return {
          byRole: getMemberCountByRole(state.profile.household.members),
          byAgeGroup: getMemberCountByAgeGroup(state.profile.household.members),
        };
      },

      hasAdultMember: () => {
        const state = get();
        return state.profile?.household.members.some((m) => m.role === 'Adult') || false;
      },

      getPrimaryMember: () => {
        const state = get();
        return state.profile?.household.members.find((m) => m.isPrimary) || null;
      },

      // Setup wizard
      createNewProfile: (household) => {
        const profile: Profile = {
          id: uuidv4(),
          household: {
            ...household,
            members: [],
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set({ 
          profile,
          isSetupComplete: false,
          validationErrors: []
        });
      },

      completeSetup: () => {
        const state = get();
        if (state.validateProfile()) {
          set({ isSetupComplete: true });
        }
      },
    }),
    {
      name: 'profile-storage',
    }
  )
);