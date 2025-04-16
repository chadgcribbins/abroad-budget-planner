import React from 'react';
import { countries, Country } from '@/data/countries';

interface CountrySelectorProps {
  label: string;
  selectedCountry: string | null;
  onCountryChange: (countryCode: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  label,
  selectedCountry,
  onCountryChange,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={label}
        value={selectedCountry ?? ''}
        onChange={(e) => onCountryChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
      >
        <option value="" disabled>
          Select a country...
        </option>
        {countries.map((country: Country) => (
          <option key={country.code} value={country.code}>
            {country.flag} {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector; 