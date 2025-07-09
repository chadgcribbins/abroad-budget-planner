import { Scenario, ScenarioMap } from '@/src/types/scenario';

const SCENARIOS_STORAGE_KEY = 'living-abroad-scenarios';

export const scenarioStorage = {
  // Load scenarios from localStorage
  loadScenarios: (): ScenarioMap => {
    try {
      const stored = localStorage.getItem(SCENARIOS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading scenarios from localStorage:', error);
    }
    return {};
  },

  // Save scenarios to localStorage
  saveScenarios: (scenarios: ScenarioMap): void => {
    try {
      localStorage.setItem(SCENARIOS_STORAGE_KEY, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Error saving scenarios to localStorage:', error);
    }
  },

  // Clear all scenarios
  clearScenarios: (): void => {
    try {
      localStorage.removeItem(SCENARIOS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing scenarios from localStorage:', error);
    }
  },

  // Export scenario as JSON
  exportScenario: (scenario: Scenario): string => {
    return JSON.stringify(scenario, null, 2);
  },

  // Import scenario from JSON
  importScenario: (jsonString: string): Scenario | null => {
    try {
      const scenario = JSON.parse(jsonString);
      // Basic validation
      if (scenario.id && scenario.name && scenario.destinationCountry) {
        return scenario as Scenario;
      }
    } catch (error) {
      console.error('Error importing scenario:', error);
    }
    return null;
  },
};