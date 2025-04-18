import { ScenarioSnapshot } from '@/utils/scenarioManager'; // Use the existing snapshot type

const SCENARIO_PREFIX = 'budgetScenario_';

/**
 * Saves a budget scenario to local storage.
 * @param name - The name of the scenario.
 * @param data - The budget data object to save.
 */
export function saveScenario(name: string, data: ScenarioSnapshot): void {
  if (typeof window === 'undefined') {
    console.warn('Local storage is not available outside the browser.');
    return;
  }
  if (!name) {
    console.error('Scenario name cannot be empty.');
    return;
  }
  try {
    const key = `${SCENARIO_PREFIX}${name}`;
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    console.log(`Scenario "${name}" saved successfully.`);
  } catch (error) {
    console.error(`Error saving scenario "${name}":`, error);
  }
}

/**
 * Loads a budget scenario from local storage.
 * @param name - The name of the scenario to load.
 * @returns The loaded budget data object, or null if not found or error.
 */
export function loadScenario(name: string): ScenarioSnapshot | null {
  if (typeof window === 'undefined') {
    console.warn('Local storage is not available outside the browser.');
    return null;
  }
  if (!name) {
    console.error('Scenario name cannot be empty.');
    return null;
  }
  try {
    const key = `${SCENARIO_PREFIX}${name}`;
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      console.log(`Scenario "${name}" not found.`);
      return null;
    }
    const data: ScenarioSnapshot = JSON.parse(serializedData);
    console.log(`Scenario "${name}" loaded successfully.`);
    // TODO: Add schema validation/migration logic if needed in the future
    return data;
  } catch (error) {
    console.error(`Error loading scenario "${name}":`, error);
    // Optionally, remove the corrupted item
    // localStorage.removeItem(`${SCENARIO_PREFIX}${name}`);
    return null;
  }
}

/**
 * Lists the names of all saved budget scenarios.
 * @returns An array of scenario names.
 */
export function listSavedScenarios(): string[] {
  if (typeof window === 'undefined') {
    console.warn('Local storage is not available outside the browser.');
    return [];
  }
  const scenarios: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(SCENARIO_PREFIX)) {
        scenarios.push(key.substring(SCENARIO_PREFIX.length));
      }
    }
    return scenarios;
  } catch (error) {
    console.error('Error listing scenarios:', error);
    return [];
  }
}

/**
 * Deletes a budget scenario from local storage.
 * @param name - The name of the scenario to delete.
 */
export function deleteScenario(name: string): void {
  if (typeof window === 'undefined') {
    console.warn('Local storage is not available outside the browser.');
    return;
  }
  if (!name) {
    console.error('Scenario name cannot be empty.');
    return;
  }
  try {
    const key = `${SCENARIO_PREFIX}${name}`;
    localStorage.removeItem(key);
    console.log(`Scenario "${name}" deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting scenario "${name}":`, error);
  }
} 