'use client';

import React, { useState, useCallback } from 'react';
import CountrySelector from '@/components/CountrySelector';
import ResidencyRegimeSelector from '@/components/ResidencyRegimeSelector';
import HouseholdSetup from '@/components/HouseholdSetup';
import Housing from '@/components/Housing';
import IncomeModule from '@/components/Income/IncomeModule';
import BudgetSummaryDisplay from '@/components/Summary/BudgetSummaryDisplay';
import TransportModule from '@/components/Transport/TransportModule';
import { TransportProvider } from '@/context/TransportContext';
import { LifestyleModule } from '@/components/Lifestyle/LifestyleModule';
import Utilities from '@/components/Utilities';
import Education from '@/components/Education';
import Healthcare from '@/components/Healthcare';
import FXSettings from '@/components/FXSettings';
import { CurrencyProvider, useCurrency } from '@/context/CurrencyContext';
import { useAppBudget, AppBudgetState } from '@/context/AppBudgetContext';
import EmergencyBufferModule from '@/components/EmergencyBufferModule';
import ScenarioManager from '@/components/ScenarioManager/ScenarioManager';
import { 
    ScenarioSnapshot, 
    saveScenario, 
    loadScenarioByName 
} from '@/utils/scenarioManager';
import { useIncome } from '@/context/IncomeContext';
import { useLifestyle, HomeServiceName } from '@/context/LifestyleContext';
import { useEmergencyBuffer } from '@/context/EmergencyBufferContext';
import { useTransport } from '@/context/TransportContext';

function AppContent() {
  // Get currency state/handlers from CurrencyContext
  const {
    originCurrency, 
    targetCurrency, 
    effectiveRate,
    setOriginCountry,
    setDestinationCountry
  } = useCurrency();
  
  // Get budget state and handlers from AppBudgetContext
  const {
      state: budgetState,
      handleHouseholdChange,
      handleHousingChange,
      handleUtilitiesChange,
      handleEducationChange,
      handleHealthcareChange,
      dispatch: appBudgetDispatch
  } = useAppBudget();

  // Keep profile/country state local to AppContent for now
  const [originCountryState, setOriginCountryState] = useState<string | null>(null);
  const [destinationCountryState, setDestinationCountryState] = useState<string | null>(null);
  const [selectedRegime, setSelectedRegime] = useState<string | null>(null);

  // Update handlers to interact with CurrencyContext AND local state
   const handleOriginCountryChange = (countryCode: string | null) => {
    setOriginCountryState(countryCode);
    setOriginCountry(countryCode); // Propagate to CurrencyContext
  };

  const handleDestinationCountryChange = (countryCode: string | null) => {
    setDestinationCountryState(countryCode);
    setDestinationCountry(countryCode); // Propagate to CurrencyContext
    setSelectedRegime(null);
  };

  // Prepare profile settings for summary component (uses local state)
  const profileSettings = {
    destinationCountry: destinationCountryState,
    originCountry: originCountryState,
    isNHRActive: destinationCountryState === 'PT' && selectedRegime === 'NHR', 
  };

  // State for profile settings, passed down
  const [profileSettingsState, setProfileSettingsState] = useState<{
    destinationCountry: string | null;
    originCountry: string | null;
    selectedRegime: string;
  }>({
    destinationCountry: null,
    originCountry: null,
    selectedRegime: 'standard', // Default
  });

  const isNHRActive = profileSettingsState.selectedRegime === 'nhr';

  // Get states and dispatchers from contexts
  const { state: incomeState, dispatch: incomeDispatch } = useIncome();
  const { state: transportState, dispatch: transportDispatch } = useTransport();
  const { state: lifestyleState, dispatch: lifestyleDispatch } = useLifestyle();
  const { state: emergencyBufferState, dispatch: emergencyBufferDispatch } = useEmergencyBuffer();
  const { 
      // State values needed for snapshot
      fetchedRate,
      manualRate,
      isManualOverrideEnabled,
      fxSimulationPercentage,
      // Need the underlying country selections to restore state correctly
      // These might need to be exposed from the context or derived from profileSettings if synced
      // Assuming profileSettings holds the source of truth for countries for now.
      
      // Setters needed for loading state
      setManualRate,
      setIsManualOverrideEnabled,
      setFxSimulationPercentage
  } = useCurrency();

  const handleProfileChange = useCallback((
    newSettings: Partial<typeof profileSettingsState>
  ) => {
    setProfileSettingsState((prev) => ({ ...prev, ...newSettings }));
     // Update CurrencyContext countries when profile changes
    if (newSettings.originCountry !== undefined) {
        setOriginCountry(newSettings.originCountry);
    }
    if (newSettings.destinationCountry !== undefined) {
        setDestinationCountry(newSettings.destinationCountry);
    }
  }, [setOriginCountry, setDestinationCountry]);

  // --- Scenario Management Logic ---

  const getCurrentStateSnapshot = (): Omit<ScenarioSnapshot, 'name' | 'timestamp'> => {
       // Extract the relevant parts of currency state
      const currencyStateSnapshot = {
          originCurrency,
          targetCurrency,
          fetchedRate,
          manualRate,
          isManualOverrideEnabled,
          fxSimulationPercentage,
          originCountry: profileSettingsState.originCountry, // Get from profile state
          destinationCountry: profileSettingsState.destinationCountry // Get from profile state
      };
      // Snapshot profile settings correctly
       const profileSettingsSnapshot = {
           destinationCountry: profileSettingsState.destinationCountry,
           originCountry: profileSettingsState.originCountry,
           isNHRActive: isNHRActive // Use derived boolean
       };

      return {
          incomeState,
          appBudgetState: budgetState,
          transportState,
          lifestyleState,
          emergencyBufferState: { // Only save user-settable parts
              targetMonthsOfCoverage: emergencyBufferState.targetMonthsOfCoverage,
              currentReserveAmount: emergencyBufferState.currentReserveAmount,
              calculatedFixedMonthlyExpenses: 0 // Don't save calculated value
          },
          profileSettings: profileSettingsSnapshot, 
          currencyState: currencyStateSnapshot,
      };
  };

  const handleSaveScenario = (name: string) => {
      const snapshot = getCurrentStateSnapshot();
      const scenarioToSave: ScenarioSnapshot = {
          name,
          timestamp: Date.now(),
          ...snapshot
      };
      const success = saveScenario(scenarioToSave);
      // Add user feedback based on success if needed
      console.log(`Scenario "${name}" save attempt: ${success}`);
  };

  const handleLoadScenario = (name: string) => {
      const loadedScenario = loadScenarioByName(name);
      if (loadedScenario) {
          // --- Load Simple States ---
          incomeDispatch({ type: 'SET_INCOME_STATE', payload: loadedScenario.incomeState });
          transportDispatch({ type: 'SET_TRANSPORT_STATE', payload: loadedScenario.transportState });
          emergencyBufferDispatch({ type: 'SET_EMERGENCY_BUFFER_STATE', payload: {
              ...loadedScenario.emergencyBufferState, 
              calculatedFixedMonthlyExpenses: emergencyBufferState.calculatedFixedMonthlyExpenses // Keep current calculated value
          } }); 
          
          // --- Load Profile State ---
          handleProfileChange({ 
              destinationCountry: loadedScenario.profileSettings.destinationCountry, 
              originCountry: loadedScenario.profileSettings.originCountry,
              selectedRegime: loadedScenario.profileSettings.isNHRActive ? 'nhr' : 'standard' // Infer regime
          });
          
          // --- Load Currency State ---
          // Note: Countries are set via handleProfileChange triggering CurrencyProvider useEffect
          setManualRate(String(loadedScenario.currencyState.manualRate));
          setIsManualOverrideEnabled(loadedScenario.currencyState.isManualOverrideEnabled);
          setFxSimulationPercentage(loadedScenario.currencyState.fxSimulationPercentage);
          // Fetched rate is not restored, will re-fetch.

          // --- Load AppBudget State (Granular & Type-Safe) ---
          const { appBudgetState: loadedAppBudget } = loadedScenario;
          // Household & Duration
          appBudgetDispatch({ type: 'SET_HOUSEHOLD_COMPOSITION', payload: loadedAppBudget.household });
          appBudgetDispatch({ type: 'SET_DURATION_OF_STAY', payload: loadedAppBudget.durationOfStayYears });
          // Housing Booleans
          appBudgetDispatch({ type: 'SET_IS_BUYING', payload: loadedAppBudget.isBuying });
          // Housing Fields (Type-safe iteration)
          const housingKeys: (keyof AppBudgetState)[] = [
              'monthlyRent', 'propertyPrice', 'downPaymentPercentage', 'mortgageTermYears', 
              'mortgageInterestRate', 'annualMaintenance', 'annualInsurance', 
              'annualPropertyTax', 'futureUpgradeCost'
          ];
          housingKeys.forEach(key => {
              if (key in loadedAppBudget) { // Check if key exists in loaded state
                  appBudgetDispatch({ type: 'SET_HOUSING_FIELD', payload: { key, value: loadedAppBudget[key] } });
              }
          });
           // Utilities Booleans
          appBudgetDispatch({ type: 'SET_IS_SEASONAL_ELECTRICITY', payload: loadedAppBudget.isSeasonalElectricity });
          appBudgetDispatch({ type: 'SET_IS_SEASONAL_GAS', payload: loadedAppBudget.isSeasonalGasHeating });
          // Utilities Fields (Type-safe iteration)
          const utilityKeys: (keyof AppBudgetState)[] = [
              'electricity', 'electricityWinter', 'electricitySpring', 'electricitySummer', 
              'electricityFall', 'water', 'gasHeating', 'gasHeatingWinter', 
              'gasHeatingSpring', 'gasHeatingSummer', 'gasHeatingFall', 'internet', 'mobile'
          ];
          utilityKeys.forEach(key => {
               if (key in loadedAppBudget) { // Check if key exists
                   appBudgetDispatch({ type: 'SET_UTILITIES_FIELD', payload: { key, value: loadedAppBudget[key] } });
               }
          });
          // Education & Healthcare (iterate through nested objects)
          // Ensure the loaded states are objects before iterating
          if (typeof loadedAppBudget.educationState === 'object' && loadedAppBudget.educationState !== null) {
              Object.entries(loadedAppBudget.educationState).forEach(([childKey, details]) => {
                  appBudgetDispatch({ type: 'SET_EDUCATION_DETAILS', payload: { childKey, details } });
              });
          }
          if (typeof loadedAppBudget.healthcareState === 'object' && loadedAppBudget.healthcareState !== null) {
              Object.entries(loadedAppBudget.healthcareState).forEach(([memberKey, details]) => {
                  appBudgetDispatch({ type: 'SET_HEALTHCARE_DETAILS', payload: { memberKey, details } });
              });
          }

          // --- Load Lifestyle State (Granular) ---
          const { lifestyleState: loadedLifestyle } = loadedScenario;
          // Simple fields
          lifestyleDispatch({ type: 'UPDATE_GENERAL_SHOPPING_SPEND', payload: loadedLifestyle.generalShoppingSpend });
          lifestyleDispatch({ type: 'UPDATE_TRAVEL_HOLIDAYS_BUDGET', payload: loadedLifestyle.travelHolidaysBudget });
          lifestyleDispatch({ type: 'UPDATE_CONTINGENCY', payload: loadedLifestyle.contingency });
          // Home Services (iterate)
          if (typeof loadedLifestyle.homeServices === 'object' && loadedLifestyle.homeServices !== null) {
              Object.entries(loadedLifestyle.homeServices).forEach(([serviceName, data]) => {
                  // Add a check to ensure serviceName is a valid HomeServiceName
                  const validServiceNames: HomeServiceName[] = ['cleaner', 'babysitter', 'gardening', 'petCare'];
                  if (validServiceNames.includes(serviceName as HomeServiceName)) {
                      lifestyleDispatch({ type: 'UPDATE_HOME_SERVICE', payload: { serviceName: serviceName as HomeServiceName, data } });
                  }
              });
          }
          // One-off Purchases (clear existing, then add loaded ones)
          // First, clear existing ones by dispatching REMOVE for each current ID
          lifestyleState.oneOffPurchases.forEach(purchase => {
              lifestyleDispatch({ type: 'REMOVE_ONE_OFF_PURCHASE', payload: { id: purchase.id } });
          });
          // Then, add the loaded ones
          if (Array.isArray(loadedLifestyle.oneOffPurchases)) {
              loadedLifestyle.oneOffPurchases.forEach(purchase => {
                  // The ADD action expects payload without ID, ID is generated by reducer
                  const { id, ...purchaseData } = purchase; 
                  lifestyleDispatch({ type: 'ADD_ONE_OFF_PURCHASE', payload: purchaseData });
              });
          }

          console.log(`Scenario "${name}" loaded.`);
      } else {
          console.error(`Failed to load scenario "${name}".`);
          // Add user feedback
      }
  };

  // Placeholder for clone functionality if needed
  const handleCloneScenario = () => {
      console.log("Clone requested. Current state is ready to be saved under a new name.");
      // Potentially pre-fill the save input with "Copy of [Current Scenario Name]"?
      // No direct state change needed here, user just needs to type a new name and save.
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Abroad Budget Planner</h1>

       {/* Country Selectors use local state handlers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg shadow-sm bg-base-100">
        <CountrySelector
          label="Origin Country"
          selectedCountry={originCountryState}
          onCountryChange={handleOriginCountryChange}
        />
        <CountrySelector
          label="Destination Country"
          selectedCountry={destinationCountryState}
          onCountryChange={handleDestinationCountryChange}
        />
      </div>

      {/* Residency Selector uses local state */}
      <ResidencyRegimeSelector
        selectedCountry={destinationCountryState}
        selectedRegime={selectedRegime}
        onRegimeChange={setSelectedRegime}
      />
      
      {/* Components below now use props from budgetState and handlers from useAppBudget */}
      <HouseholdSetup
        household={budgetState.household}
        durationOfStayYears={budgetState.durationOfStayYears}
        onHouseholdChange={handleHouseholdChange}
      />

      <Utilities 
        electricity={budgetState.electricity}
        isSeasonalElectricity={budgetState.isSeasonalElectricity}
        electricityWinter={budgetState.electricityWinter}
        electricitySpring={budgetState.electricitySpring}
        electricitySummer={budgetState.electricitySummer}
        electricityFall={budgetState.electricityFall}
        water={budgetState.water}
        gasHeating={budgetState.gasHeating}
        isSeasonalGasHeating={budgetState.isSeasonalGasHeating}
        gasHeatingWinter={budgetState.gasHeatingWinter}
        gasHeatingSpring={budgetState.gasHeatingSpring}
        gasHeatingSummer={budgetState.gasHeatingSummer}
        gasHeatingFall={budgetState.gasHeatingFall}
        internet={budgetState.internet}
        mobile={budgetState.mobile}
        onUtilitiesChange={handleUtilitiesChange}
      />

      <Education
        household={budgetState.household} // Pass household composition
        educationState={budgetState.educationState}
        onEducationChange={handleEducationChange}
      />

      <Healthcare
        household={budgetState.household} // Pass household composition
        healthcareState={budgetState.healthcareState}
        onHealthcareChange={handleHealthcareChange}
      />

      <EmergencyBufferModule />

      <FXSettings />

      <TransportModule />

      <LifestyleModule />

      <IncomeModule />

      <Housing
        isBuying={budgetState.isBuying}
        monthlyRent={budgetState.monthlyRent}
        propertyPrice={budgetState.propertyPrice}
        downPaymentPercentage={budgetState.downPaymentPercentage}
        mortgageTermYears={budgetState.mortgageTermYears}
        mortgageInterestRate={budgetState.mortgageInterestRate}
        annualMaintenance={budgetState.annualMaintenance}
        annualInsurance={budgetState.annualInsurance}
        annualPropertyTax={budgetState.annualPropertyTax}
        futureUpgradeCost={budgetState.futureUpgradeCost}
        onHousingChange={handleHousingChange}
      />

      {/* Summary needs budgetState and profileSettings */}
      <BudgetSummaryDisplay 
        profileSettings={{
            destinationCountry: profileSettingsState.destinationCountry,
            originCountry: profileSettingsState.originCountry,
            isNHRActive: isNHRActive
        }}
        // TODO: Pass budgetState or relevant parts to BudgetSummaryDisplay if needed
      />

      <p className="text-lg my-8">Plan your budget for living abroad with ease.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Budget Planning</h2>
            <p>Create detailed budgets for your time abroad with customizable categories.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/budget" className="btn btn-primary">Create Budget</a>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Expense Tracking</h2>
            <p>Record and monitor your daily expenses to stay within your budget.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/expenses" className="btn btn-outline">Track Expenses</a>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Cost Comparison</h2>
            <p>Compare living costs between different destinations around the world.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/compare" className="btn btn-outline">Compare Costs</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-base-200 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2">Ready to plan your adventure?</h2>
          <p className="max-w-md">Start by creating a budget tailored to your destination and travel style.</p>
        </div>
        <a href="/destinations" className="btn btn-primary">Browse Destinations</a>
      </div>

      {/* Scenario Manager Component */}
      <ScenarioManager 
          onSaveScenario={handleSaveScenario}
          onLoadScenario={handleLoadScenario}
          onCloneScenario={handleCloneScenario} // Pass the clone handler
      />
    </div>
  );
}

export default function Home() {
  return (
    <TransportProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </TransportProvider>
  );
} 