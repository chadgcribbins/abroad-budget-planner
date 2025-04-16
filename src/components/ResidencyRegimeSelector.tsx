import React from 'react';

interface ResidencyRegimeSelectorProps {
  selectedCountry: string | null; // Expecting country code like 'PT'
  selectedRegime: string | null;
  onRegimeChange: (regime: string | null) => void;
}

const NHR_REGIME_KEY = 'portugal_nhr';

const ResidencyRegimeSelector: React.FC<ResidencyRegimeSelectorProps> = ({
  selectedCountry,
  selectedRegime,
  onRegimeChange,
}) => {
  // Log the received prop value - removed for cleanup
  // console.log('[ResidencyRegimeSelector] Received selectedCountry:', selectedCountry);

  const isPortugalSelected = selectedCountry === 'PT';
  const isNhrSelected = selectedRegime === NHR_REGIME_KEY;

  const handleNhrToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRegimeChange(event.target.checked ? NHR_REGIME_KEY : null);
  };

  return (
    <div className="mt-4 p-4 border rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Residency Regime</h2>
      {!selectedCountry ? (
        <p className="text-sm text-gray-500">Please select a destination country first.</p>
      ) : isPortugalSelected ? (
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNhrSelected}
              onChange={handleNhrToggle}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="text-sm">Apply Non-Habitual Resident (NHR) Regime</span>
          </label>
          {isNhrSelected && (
            <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded">
              Portugal's NHR regime offers potential tax benefits (e.g., flat 20% on certain PT income, 10% on foreign pensions, exemptions on other foreign income) for qualifying new residents during their first 10 years. Eligibility depends on specific criteria (e.g., not being a PT tax resident in the previous 5 years, type of income/profession). 
              <strong className="block mt-1">Note:</strong> This tool uses simplified NHR assumptions. Consult official resources or a tax advisor for accurate eligibility and application. 
              {/* TODO: Add link to official Finanças NHR page */}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No specific residency regimes available for the selected country in this tool.</p>
      )}
    </div>
  );
};

export default ResidencyRegimeSelector; 