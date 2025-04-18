'use client';

import React, { useState, useCallback, useEffect } from 'react';
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
import StepSidebar from '@/components/Navigation/StepSidebar';
import { 
    ScenarioSnapshot, 
    saveScenario, 
    loadScenarioByName 
} from '@/utils/scenarioManager';
import { useIncome } from '@/context/IncomeContext';
import { useLifestyle, HomeServiceName } from '@/context/LifestyleContext';
import { useEmergencyBuffer } from '@/context/EmergencyBufferContext';
import { useTransport } from '@/context/TransportContext';
import { AppBudgetProvider } from '@/context/AppBudgetContext';
import { IncomeProvider } from '@/context/IncomeContext';
import { LifestyleProvider } from '@/context/LifestyleContext';
import { EmergencyBufferProvider } from '@/context/EmergencyBufferContext';

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

  // --- State for Multi-Step Form ---
  const [currentStep, setCurrentStep] = useState(0); 
  const totalSteps = 11; // 0-10
  const [isStepValid, setIsStepValid] = useState(false); // Validation state

  // --- Validation Logic ---
  const validateStep = useCallback((step: number) => {
    // Basic validation example: Step 0 (Profile)
    if (step === 0) {
      const profileComplete = 
        originCountryState !== null && 
        destinationCountryState !== null &&
        (destinationCountryState !== 'PT' || selectedRegime !== null) && // NHR check only for PT
        budgetState.household.Adult > 0 && // At least one adult
        budgetState.durationOfStayYears > 0; // Duration must be set
      return profileComplete;
    }
    // TODO: Add validation rules for other steps (1-9)
    // For now, assume other steps are valid to allow progression
    return true; 
  }, [originCountryState, destinationCountryState, selectedRegime, budgetState.household, budgetState.durationOfStayYears]);

  // Re-validate whenever the current step or relevant data changes
  useEffect(() => {
    setIsStepValid(validateStep(currentStep));
  }, [currentStep, validateStep]); // Dependency array includes validateStep which depends on form data

  // --- Step Labels for Progress Indicator ---
  const stepLabels = [
    "Profile",     // 0
    "Income",      // 1
    "Housing",     // 2
    "Transport",   // 3
    "Lifestyle",   // 4
    "Utilities",   // 5
    "Education",   // 6
    "Healthcare",  // 7
    "Emergency", // 8
    "FX Settings", // 9
    "Summary"      // 10
  ];

  // --- Component Rendering Logic ---

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0: // Profile & Household Setup
        return (
          <>
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
            {destinationCountryState === 'PT' && ( // Only show NHR selector for Portugal
              <ResidencyRegimeSelector 
                selectedCountry={destinationCountryState}
                selectedRegime={selectedRegime} 
                onRegimeChange={setSelectedRegime} 
              />
            )}
            <HouseholdSetup 
              household={budgetState.household} 
              durationOfStayYears={budgetState.durationOfStayYears} 
              onHouseholdChange={handleHouseholdChange} 
            />
          </>
        );
      case 1: // Income
        return <IncomeModule />;
      case 2: // Housing
        return (
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
        );
      case 3: // Transport
        return <TransportModule />;
      case 4: // Lifestyle
        return <LifestyleModule />;
      case 5: // Utilities
        return (
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
        );
      case 6: // Education
        return <Education household={budgetState.household} educationState={budgetState.educationState} onEducationChange={handleEducationChange} />;
      case 7: // Healthcare
        return <Healthcare household={budgetState.household} healthcareState={budgetState.healthcareState} onHealthcareChange={handleHealthcareChange} />;
      case 8: // Emergency Buffer
        return <EmergencyBufferModule />;
      case 9: // FX Settings
        return <FXSettings />;
      case 10: // Summary
        return <BudgetSummaryDisplay profileSettings={profileSettings} />;
      default:
        return <div>Invalid Step</div>;
    }
  };

  return (
    <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 py-4">
            {/* Step Sidebar (conditionally rendered) */}
            {currentStep > 0 && (
                <div className="lg:w-1/4 hidden lg:block">
                    <StepSidebar 
                        stepLabels={stepLabels}
                        currentStep={currentStep}
                        setCurrentStep={setCurrentStep}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-grow border rounded-lg p-6 bg-base-100 shadow-md">
                {/* Progress Indicator */}
                <ul className="steps steps-horizontal w-full mb-8">
                    {stepLabels.map((label, index) => (
                        <li 
                            key={label}
                            className={`step ${index <= currentStep ? 'step-primary' : ''}`}
                        >
                            {label}
                        </li>
                    ))}
                </ul>

                {/* Render the component for the current step */}
                {renderStepComponent()}
                
                {/* Navigation Buttons */}
                <div className="mt-6 flex justify-between">
                    {/* Show Previous button only if not on the first step */}
                    {currentStep > 0 && (
                        <button 
                            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 0))} 
                            className="btn btn-secondary"> {/* Use secondary style for back */}
                            Previous
                        </button>
                    )}
                    {/* Add a spacer div to push the Next/Finish button to the right when Previous is hidden */}
                    {currentStep === 0 && <div />} 

                    {/* Show Next button only if not on the last step AND step is valid */}
                    {currentStep < totalSteps - 1 && (
                        <button 
                            onClick={() => setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1))} 
                            className={`btn btn-primary ${!isStepValid ? 'btn-disabled' : ''}`}
                            disabled={!isStepValid} // Disable button if step is invalid
                        >
                            Next
                        </button>
                    )}
                    
                    {/* Show View Summary button only on the last step */}
                    {currentStep === totalSteps - 1 && (
                        <button className="btn btn-success"> {/* Use success style for final step */}
                            View Summary
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
}

export default function Home() {
  return (
    <CurrencyProvider>
      <AppBudgetProvider>
        <IncomeProvider>
           <TransportProvider>
             <LifestyleProvider>
               <EmergencyBufferProvider>
                 <AppContent /> 
               </EmergencyBufferProvider>
              </LifestyleProvider>
          </TransportProvider>
        </IncomeProvider>
      </AppBudgetProvider>
    </CurrencyProvider>
  );
} 