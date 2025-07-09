import { create } from 'zustand';

interface UIState {
  // Modal states
  isCreateScenarioModalOpen: boolean;
  isDeleteConfirmModalOpen: boolean;
  selectedScenarioId: string | null;
  
  // View preferences
  scenarioViewMode: 'grid' | 'list';
  sortBy: 'date' | 'name' | 'completion';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  openCreateScenarioModal: () => void;
  closeCreateScenarioModal: () => void;
  openDeleteConfirmModal: (scenarioId: string) => void;
  closeDeleteConfirmModal: () => void;
  setScenarioViewMode: (mode: 'grid' | 'list') => void;
  setSortBy: (sortBy: 'date' | 'name' | 'completion') => void;
  toggleSortOrder: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial states
  isCreateScenarioModalOpen: false,
  isDeleteConfirmModalOpen: false,
  selectedScenarioId: null,
  scenarioViewMode: 'grid',
  sortBy: 'date',
  sortOrder: 'desc',

  // Actions
  openCreateScenarioModal: () => {
    set({ isCreateScenarioModalOpen: true });
  },

  closeCreateScenarioModal: () => {
    set({ isCreateScenarioModalOpen: false });
  },

  openDeleteConfirmModal: (scenarioId) => {
    set({ 
      isDeleteConfirmModalOpen: true,
      selectedScenarioId: scenarioId,
    });
  },

  closeDeleteConfirmModal: () => {
    set({ 
      isDeleteConfirmModalOpen: false,
      selectedScenarioId: null,
    });
  },

  setScenarioViewMode: (mode) => {
    set({ scenarioViewMode: mode });
  },

  setSortBy: (sortBy) => {
    set({ sortBy });
  },

  toggleSortOrder: () => {
    set((state) => ({
      sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  },
}));