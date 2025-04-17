'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

// Define types for household state
const ageGroups = [
  'Baby', 'Primary', 'Secondary', 'College', 'Adult', 'Parent', 'Grandparent'
] as const;
type AgeGroup = typeof ageGroups[number];
export type HouseholdComposition = { [K in AgeGroup]: number };

// Define types for Education state
type EducationChoice = 'public' | 'private';
type EducationDetails = {
  choice: EducationChoice;
  annualTuition?: number | '';
  extraCosts?: number | '';
};
type EducationState = { [childKey: string]: EducationDetails };

// Define types for Healthcare state
export type CoverageType = 'Public' | 'Private' | 'Hybrid';
export type HealthcareDetails = {
  type: CoverageType;
  monthlyPremium?: number | '';
  oopEstimate?: number | ''; // Out-of-pocket estimate (GP, Dental, Prescriptions combined for now)
  recurringMedical?: number | ''; // Known recurring costs
};
export type HealthcareState = { [memberKey: string]: HealthcareDetails };

function AppContent() {
  // Get currency state/handlers from context
  const {
    originCurrency, 
    targetCurrency, 
    effectiveRate,
    setOriginCountry,
    setDestinationCountry
  } = useCurrency();

  const [originCountryState, setOriginCountryState] = useState<string | null>(null);
  const [destinationCountryState, setDestinationCountryState] = useState<string | null>(null);
  const [selectedRegime, setSelectedRegime] = useState<string | null>(null);
  const [household, setHousehold] = useState<HouseholdComposition>({
    Baby: 0, Primary: 0, Secondary: 0, College: 0, Adult: 0, Parent: 2, Grandparent: 0,
  });
  const [durationOfStayYears, setDurationOfStayYears] = useState<number>(5);
  const [isBuying, setIsBuying] = useState(false);
  const [monthlyRent, setMonthlyRent] = useState<number | ''>(1000);
  const [propertyPrice, setPropertyPrice] = useState<number | ''>(300000);
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number | ''>(20);
  const [mortgageTermYears, setMortgageTermYears] = useState<number | ''>(30);
  const [mortgageInterestRate, setMortgageInterestRate] = useState<number | ''>(3.5);
  const [annualMaintenance, setAnnualMaintenance] = useState<number | ''>(1500);
  const [annualInsurance, setAnnualInsurance] = useState<number | ''>(500);
  const [annualPropertyTax, setAnnualPropertyTax] = useState<number | ''>(800);
  const [futureUpgradeCost, setFutureUpgradeCost] = useState<number | ''>(0);
  const [electricity, setElectricity] = useState<number | ''>(80);
  const [isSeasonalElectricity, setIsSeasonalElectricity] = useState(false);
  const [electricityWinter, setElectricityWinter] = useState<number | ''>(120);
  const [electricitySpring, setElectricitySpring] = useState<number | ''>(70);
  const [electricitySummer, setElectricitySummer] = useState<number | ''>(60);
  const [electricityFall, setElectricityFall] = useState<number | ''>(90);
  const [water, setWater] = useState<number | ''>(40);
  const [gasHeating, setGasHeating] = useState<number | ''>(100);
  const [isSeasonalGasHeating, setIsSeasonalGasHeating] = useState(false);
  const [gasHeatingWinter, setGasHeatingWinter] = useState<number | ''>(150);
  const [gasHeatingSpring, setGasHeatingSpring] = useState<number | ''>(80);
  const [gasHeatingSummer, setGasHeatingSummer] = useState<number | ''>(50);
  const [gasHeatingFall, setGasHeatingFall] = useState<number | ''>(100);
  const [internet, setInternet] = useState<number | ''>(50);
  const [mobile, setMobile] = useState<number | ''>(30);
  const [educationState, setEducationState] = useState<EducationState>({});
  const [healthcareState, setHealthcareState] = useState<HealthcareState>({});

  const handleOriginCountryChange = (countryCode: string | null) => {
    setOriginCountryState(countryCode);
    setOriginCountry(countryCode);
  };

  const handleDestinationCountryChange = (countryCode: string | null) => {
    setDestinationCountryState(countryCode);
    setDestinationCountry(countryCode);
    setSelectedRegime(null);
  };

  const handleHouseholdChange = (key: AgeGroup | 'durationOfStayYears', value: number) => {
    if (key === 'durationOfStayYears') {
      setDurationOfStayYears(value);
    } else {
      setHousehold(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleHousingChange = (key: string, value: any) => {
    if (key === 'isBuying') setIsBuying(value as boolean);
    else if (key === 'monthlyRent') setMonthlyRent(value === '' ? '' : Number(value));
    else if (key === 'propertyPrice') setPropertyPrice(value === '' ? '' : Number(value));
    else if (key === 'downPaymentPercentage') setDownPaymentPercentage(value === '' ? '' : Number(value));
    else if (key === 'mortgageTermYears') setMortgageTermYears(value === '' ? '' : Number(value));
    else if (key === 'mortgageInterestRate') setMortgageInterestRate(value === '' ? '' : Number(value));
    else if (key === 'annualMaintenance') setAnnualMaintenance(value === '' ? '' : Number(value));
    else if (key === 'annualInsurance') setAnnualInsurance(value === '' ? '' : Number(value));
    else if (key === 'annualPropertyTax') setAnnualPropertyTax(value === '' ? '' : Number(value));
    else if (key === 'futureUpgradeCost') setFutureUpgradeCost(value === '' ? '' : Number(value));
  };

  const handleUtilitiesChange = (key: string, value: any) => {
    const numericValue = value === '' ? '' : Number(value);
    const booleanValue = value as boolean;
    switch (key) {
      case 'electricity': setElectricity(numericValue); break;
      case 'isSeasonalElectricity': setIsSeasonalElectricity(booleanValue); break;
      case 'electricityWinter': setElectricityWinter(numericValue); break;
      case 'electricitySpring': setElectricitySpring(numericValue); break;
      case 'electricitySummer': setElectricitySummer(numericValue); break;
      case 'electricityFall': setElectricityFall(numericValue); break;
      case 'water': setWater(numericValue); break;
      case 'gasHeating': setGasHeating(numericValue); break;
      case 'isSeasonalGasHeating': setIsSeasonalGasHeating(booleanValue); break;
      case 'gasHeatingWinter': setGasHeatingWinter(numericValue); break;
      case 'gasHeatingSpring': setGasHeatingSpring(numericValue); break;
      case 'gasHeatingSummer': setGasHeatingSummer(numericValue); break;
      case 'gasHeatingFall': setGasHeatingFall(numericValue); break;
      case 'internet': setInternet(numericValue); break;
      case 'mobile': setMobile(numericValue); break;
      default: console.warn(`Unhandled utilities key: ${key}`);
    }
  };

  const handleEducationChange = (childKey: string, detailsUpdate: Partial<EducationDetails>) => {
    setEducationState(prev => ({ ...prev, [childKey]: { ...(prev[childKey] || { choice: 'public' }), ...detailsUpdate } }));
  };

  const handleHealthcareChange = (memberKey: string, detailsUpdate: Partial<HealthcareDetails>) => {
    setHealthcareState(prev => ({ ...prev, [memberKey]: { ...(prev[memberKey] || { type: 'Public' }), ...detailsUpdate } }));
  };

  const handleDestinationChange = (countryCode: string | null) => {
    setDestinationCountryState(countryCode);
    setSelectedRegime(null);
  };

  // Prepare profile settings for summary component (uses local state)
  const profileSettings = {
    destinationCountry: destinationCountryState,
    originCountry: originCountryState,
    isNHRActive: destinationCountryState === 'PT' && selectedRegime === 'NHR', 
  };

  // Get FX handlers from context to pass down (if needed by component props)
  const {
    // Values are accessed directly via useCurrency in the components now
    // Props below might be removed if components are refactored to use context directly
    setManualRate, 
    setIsManualOverrideEnabled, 
    setFxSimulationPercentage,
    // We also need the state values to pass as props for now
    manualRate, isManualOverrideEnabled, fxSimulationPercentage, fetchedRate
  } = useCurrency(); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Abroad Budget Planner</h1>

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

      <ResidencyRegimeSelector
        selectedCountry={destinationCountryState}
        selectedRegime={selectedRegime}
        onRegimeChange={setSelectedRegime}
      />

      <HouseholdSetup
        household={household}
        durationOfStayYears={durationOfStayYears}
        onHouseholdChange={handleHouseholdChange}
      />

      <Utilities 
        electricity={electricity}
        isSeasonalElectricity={isSeasonalElectricity}
        electricityWinter={electricityWinter}
        electricitySpring={electricitySpring}
        electricitySummer={electricitySummer}
        electricityFall={electricityFall}
        water={water}
        gasHeating={gasHeating}
        isSeasonalGasHeating={isSeasonalGasHeating}
        gasHeatingWinter={gasHeatingWinter}
        gasHeatingSpring={gasHeatingSpring}
        gasHeatingSummer={gasHeatingSummer}
        gasHeatingFall={gasHeatingFall}
        internet={internet}
        mobile={mobile}
        onUtilitiesChange={handleUtilitiesChange}
      />

      <Education
        household={household}
        educationState={educationState}
        onEducationChange={handleEducationChange}
      />

      <Healthcare
        household={household}
        healthcareState={healthcareState}
        onHealthcareChange={handleHealthcareChange}
      />

      <FXSettings />

      <TransportModule />

      <LifestyleModule />

      <IncomeModule />

      <Housing
        isBuying={isBuying}
        monthlyRent={monthlyRent}
        propertyPrice={propertyPrice}
        downPaymentPercentage={downPaymentPercentage}
        mortgageTermYears={mortgageTermYears}
        mortgageInterestRate={mortgageInterestRate}
        annualMaintenance={annualMaintenance}
        annualInsurance={annualInsurance}
        annualPropertyTax={annualPropertyTax}
        futureUpgradeCost={futureUpgradeCost}
        onHousingChange={handleHousingChange}
      />

      <BudgetSummaryDisplay 
        profileSettings={profileSettings}
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