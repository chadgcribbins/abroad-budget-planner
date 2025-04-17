/**
 * @file Utility functions for managing budget scenarios using localStorage.
 */

import type { Income } from '@/types/income.types';
import type { AppBudgetState } from '@/context/AppBudgetContext';
import type { Transport } from '@/types/transport.types';
import type { LifestyleState } from '@/context/LifestyleContext';
import type { EmergencyBuffer } from '@/types/emergency.types';

// Define the inline structure for Profile Settings based on usage
interface ProfileSettingsSnapshot {
  destinationCountry: string | null;
  originCountry: string | null;
  isNHRActive: boolean;
}

// Define the inline structure for relevant Currency state parts
interface CurrencyStateSnapshot {
  originCurrency: string;
  targetCurrency: string;
  fetchedRate: number | null;
  manualRate: number | string;
  isManualOverrideEnabled: boolean;
  fxSimulationPercentage: number;
  // Also need to save the underlying country selections
  originCountry: string | null; 
  destinationCountry: string | null;
}

// Define the structure of a saved scenario snapshot
export interface ScenarioSnapshot {
  name: string;
  timestamp: number; // Store save time
  // Include all relevant state slices with corrected types
  incomeState: Income;
  appBudgetState: AppBudgetState;
  transportState: Transport;
  lifestyleState: LifestyleState;
  emergencyBufferState: EmergencyBuffer;
  profileSettings: ProfileSettingsSnapshot; // Use inline type
  currencyState: CurrencyStateSnapshot; // Use inline type
}

const SCENARIO_STORAGE_KEY = 'budgetScenarios';

/**
 * Retrieves all saved scenarios from localStorage.
 * @returns An array of ScenarioSnapshot objects.
 */
export const loadAllScenarios = (): ScenarioSnapshot[] => {
  if (typeof window === 'undefined') return []; // Guard for SSR
  try {
    const scenariosJson = localStorage.getItem(SCENARIO_STORAGE_KEY);
    return scenariosJson ? JSON.parse(scenariosJson) : [];
  } catch (error) {
    console.error("Error loading scenarios from localStorage:", error);
    return [];
  }
};

/**
 * Saves a scenario snapshot to localStorage.
 * Overwrites if a scenario with the same name exists.
 * @param scenario The ScenarioSnapshot to save.
 * @returns True if successful, false otherwise.
 */
export const saveScenario = (scenario: ScenarioSnapshot): boolean => {
  if (typeof window === 'undefined') return false; // Guard for SSR
  if (!scenario.name) {
      console.error("Scenario name cannot be empty.");
      return false;
  }
  try {
    const scenarios = loadAllScenarios();
    // Remove existing scenario with the same name before adding/updating
    const updatedScenarios = scenarios.filter(s => s.name !== scenario.name);
    updatedScenarios.push(scenario);
    localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(updatedScenarios));
    return true;
  } catch (error) {
    console.error(`Error saving scenario "${scenario.name}" to localStorage:`, error);
    return false;
  }
};

/**
 * Loads a specific scenario by name from localStorage.
 * @param name The name of the scenario to load.
 * @returns The ScenarioSnapshot if found, otherwise null.
 */
export const loadScenarioByName = (name: string): ScenarioSnapshot | null => {
  if (typeof window === 'undefined') return null; // Guard for SSR
  try {
    const scenarios = loadAllScenarios();
    return scenarios.find(s => s.name === name) || null;
  } catch (error) {
    console.error(`Error loading scenario "${name}" from localStorage:`, error);
    return null;
  }
};

/**
 * Deletes a specific scenario by name from localStorage.
 * @param name The name of the scenario to delete.
 * @returns True if successful, false otherwise.
 */
export const deleteScenario = (name: string): boolean => {
  if (typeof window === 'undefined') return false; // Guard for SSR
  try {
    const scenarios = loadAllScenarios();
    const updatedScenarios = scenarios.filter(s => s.name !== name);
    // Only update localStorage if a change was actually made
    if (updatedScenarios.length < scenarios.length) {
        localStorage.setItem(SCENARIO_STORAGE_KEY, JSON.stringify(updatedScenarios));
        return true;
    }
    return false; // Scenario not found
  } catch (error) {
    console.error(`Error deleting scenario "${name}" from localStorage:`, error);
    return false;
  }
};

/**
 * Lists the names and timestamps of all saved scenarios.
 * @returns An array of objects containing { name: string, timestamp: number }.
 */
export const listSavedScenarios = (): { name: string; timestamp: number }[] => {
    if (typeof window === 'undefined') return []; // Guard for SSR
    try {
        const scenarios = loadAllScenarios();
        return scenarios.map(s => ({ name: s.name, timestamp: s.timestamp })).sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
    } catch (error) {
        console.error("Error listing scenarios:", error);
        return [];
    }
}; 