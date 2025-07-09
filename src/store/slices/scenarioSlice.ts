import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Scenario, ScenarioMap } from '@/src/types/scenario';

interface ScenarioState {
  scenarios: ScenarioMap;
  activeScenarioId: string | null;
  
  // Actions
  addScenario: (scenario: Scenario) => void;
  updateScenario: (id: string, updates: Partial<Scenario>) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string, newName: string) => void;
  setActiveScenario: (id: string | null) => void;
  getScenario: (id: string) => Scenario | undefined;
  getActiveScenario: () => Scenario | undefined;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      scenarios: {},
      activeScenarioId: null,

      addScenario: (scenario) => {
        set((state) => ({
          scenarios: {
            ...state.scenarios,
            [scenario.id]: scenario,
          },
          activeScenarioId: scenario.id,
        }));
      },

      updateScenario: (id, updates) => {
        set((state) => ({
          scenarios: {
            ...state.scenarios,
            [id]: {
              ...state.scenarios[id],
              ...updates,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      deleteScenario: (id) => {
        set((state) => {
          const { [id]: deleted, ...remainingScenarios } = state.scenarios;
          return {
            scenarios: remainingScenarios,
            activeScenarioId: state.activeScenarioId === id ? null : state.activeScenarioId,
          };
        });
      },

      duplicateScenario: (id, newName) => {
        const original = get().scenarios[id];
        if (!original) return;

        const duplicated: Scenario = {
          ...original,
          id: `scenario-${Date.now()}`,
          name: newName,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        get().addScenario(duplicated);
      },

      setActiveScenario: (id) => {
        set({ activeScenarioId: id });
      },

      getScenario: (id) => {
        return get().scenarios[id];
      },

      getActiveScenario: () => {
        const state = get();
        return state.activeScenarioId ? state.scenarios[state.activeScenarioId] : undefined;
      },
    }),
    {
      name: 'scenario-storage',
    }
  )
);