'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { householdSchema } from '@/src/utils/profileValidation';
import { HouseholdFormData, Household } from '@/src/types/profile';
import { getCurrencyFlag, getCountryCurrencies } from '@/src/utils/currency';

interface HouseholdStepProps {
  initialData?: Partial<Household>;
  onSubmit: (data: HouseholdFormData) => void;
  onCancel: () => void;
}

// Supported countries (based on currency data)
const COUNTRIES = [
  'Portugal', 'Spain', 'France', 'Italy', 'Germany', 'Netherlands',
  'UK', 'USA', 'Canada', 'Australia', 'Japan', 'Switzerland',
  'Sweden', 'Norway', 'Denmark', 'Poland', 'Czech Republic',
  'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Russia',
  'Turkey', 'Brazil', 'China', 'Indonesia', 'India',
  'South Korea', 'Mexico', 'Malaysia', 'New Zealand',
  'Philippines', 'Singapore', 'Thailand', 'South Africa'
];

export function HouseholdStep({ initialData, onSubmit, onCancel }: HouseholdStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: {
      name: initialData?.name || '',
      originCountry: initialData?.originCountry || '',
    },
    mode: 'onChange',
  });

  const selectedCountry = watch('originCountry');
  const selectedCurrency = selectedCountry ? getCountryCurrencies(selectedCountry)[0] : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Household Information</h2>
        <p className="text-base-content/70">
          Let's start with some basic information about your household.
        </p>
      </div>

      <div className="space-y-4">
        {/* Household Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Household Name</span>
            <span className="label-text-alt text-base-content/50">
              e.g., "The Smith Family"
            </span>
          </label>
          <input
            type="text"
            placeholder="Enter your household name"
            className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
            {...register('name')}
          />
          {errors.name && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.name.message}</span>
            </label>
          )}
        </div>

        {/* Origin Country */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Origin Country</span>
            <span className="label-text-alt text-base-content/50">
              Where you currently live
            </span>
          </label>
          <select
            className={`select select-bordered ${errors.originCountry ? 'select-error' : ''}`}
            {...register('originCountry')}
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.originCountry && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.originCountry.message}</span>
            </label>
          )}
        </div>

        {/* Currency Info */}
        {selectedCountry && selectedCurrency && (
          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <p className="font-medium">Your origin currency</p>
              <p className="text-sm">
                {getCurrencyFlag(selectedCurrency)} {selectedCurrency} will be used for your current income and expenses
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="btn btn-primary"
        >
          Next Step
        </button>
      </div>
    </form>
  );
}