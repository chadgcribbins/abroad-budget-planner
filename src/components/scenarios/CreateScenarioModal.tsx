'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useScenarioStore } from '@/src/store/slices/scenarioSlice';
import { useProfileStore } from '@/src/store/slices/profileSlice';
import { useUIStore } from '@/src/store/slices/uiSlice';
import { Scenario } from '@/src/types/scenario';
import { getCountryCurrencies, getCurrencyFlag } from '@/src/utils/currency';

const createScenarioSchema = z.object({
  destinationCountry: z.string().min(1, 'Destination country is required'),
  residencyRegime: z.string().optional(),
  duration: z.number().min(1).max(50),
  customName: z.string().optional(),
});

type CreateScenarioForm = z.infer<typeof createScenarioSchema>;

const COUNTRIES = [
  'Portugal',
  'Spain',
  'France',
  'Italy',
  'Germany',
  'Netherlands',
  'UK',
  'USA',
  'Canada',
  'Australia',
];

const RESIDENCY_REGIMES = {
  Portugal: ['NHR', 'Standard', 'D7 Visa', 'Golden Visa'],
  Spain: ['Beckham Law', 'Standard', 'Non-Lucrative Visa'],
  France: ['Standard', 'Talent Passport'],
  // Add more as needed
};

export function CreateScenarioModal() {
  const { isCreateScenarioModalOpen, closeCreateScenarioModal } = useUIStore();
  const { addScenario } = useScenarioStore();
  const { profile } = useProfileStore();
  const [selectedCountry, setSelectedCountry] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateScenarioForm>({
    resolver: zodResolver(createScenarioSchema),
    defaultValues: {
      duration: 5,
    },
  });

  const watchedCountry = watch('destinationCountry');
  const watchedRegime = watch('residencyRegime');
  const watchedCustomName = watch('customName');

  React.useEffect(() => {
    setSelectedCountry(watchedCountry);
  }, [watchedCountry]);

  const generateScenarioName = (data: CreateScenarioForm) => {
    if (data.customName) return data.customName;
    
    const parts = [];
    if (data.destinationCountry) parts.push(data.destinationCountry);
    if (data.residencyRegime) parts.push(`(${data.residencyRegime})`);
    parts.push(`${data.duration}yr`);
    
    return parts.join(' ');
  };

  const onSubmit = (data: CreateScenarioForm) => {
    if (!profile) {
      alert('Please set up your profile first');
      return;
    }

    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: generateScenarioName(data),
      profileId: profile.id,
      destinationCountry: data.destinationCountry,
      residencyRegime: data.residencyRegime,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionStatus: {
        overall: 0,
        modules: {},
      },
      data: {},
    };

    addScenario(newScenario);
    reset();
    closeCreateScenarioModal();
  };

  if (!isCreateScenarioModalOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Create New Scenario</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Destination Country */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Destination Country</span>
            </label>
            <select 
              className="select select-bordered w-full"
              {...register('destinationCountry')}
            >
              <option value="">Select a country</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.destinationCountry && (
              <label className="label">
                <span className="label-text-alt text-error">
                  {errors.destinationCountry.message}
                </span>
              </label>
            )}
          </div>

          {/* Residency Regime */}
          {selectedCountry && RESIDENCY_REGIMES[selectedCountry as keyof typeof RESIDENCY_REGIMES] && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Residency Regime (Optional)</span>
              </label>
              <select 
                className="select select-bordered w-full"
                {...register('residencyRegime')}
              >
                <option value="">Select a regime</option>
                {RESIDENCY_REGIMES[selectedCountry as keyof typeof RESIDENCY_REGIMES].map(regime => (
                  <option key={regime} value={regime}>{regime}</option>
                ))}
              </select>
            </div>
          )}

          {/* Duration */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Duration (years)</span>
            </label>
            <input 
              type="number" 
              className="input input-bordered w-full"
              {...register('duration', { valueAsNumber: true })}
              min="1"
              max="50"
            />
          </div>

          {/* Custom Name */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Custom Name (Optional)</span>
            </label>
            <input 
              type="text" 
              placeholder={generateScenarioName({ 
                destinationCountry: watchedCountry, 
                residencyRegime: watchedRegime,
                duration: 5,
              })}
              className="input input-bordered w-full"
              {...register('customName')}
            />
            <label className="label">
              <span className="label-text-alt">
                Leave empty to auto-generate based on selections
              </span>
            </label>
          </div>

          {/* Origin Country & Currency Info */}
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm">
              <p>Origin: <strong>{profile?.household.originCountry || 'Not set'}</strong> 
                {profile?.household.originCountry && (
                  <span className="ml-2">
                    {getCurrencyFlag(getCountryCurrencies(profile.household.originCountry)[0])} 
                    {getCountryCurrencies(profile.household.originCountry)[0]}
                  </span>
                )}
              </p>
              {watchedCountry && (
                <p>Destination Currency: 
                  <span className="ml-2 font-medium">
                    {getCurrencyFlag(getCountryCurrencies(watchedCountry)[0])} 
                    {getCountryCurrencies(watchedCountry)[0]}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button 
              type="button" 
              className="btn"
              onClick={() => {
                reset();
                closeCreateScenarioModal();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Scenario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}