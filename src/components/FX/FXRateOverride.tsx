import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
// Assuming UI components might exist elsewhere or using basic HTML
// import { Input } from '@/components/ui/input'; 
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// TODO: Create and import a proper currency formatting utility
// import { formatCurrency } from '@/utils/transformations/currency.transformations';

const FXRateOverride: React.FC = () => {
  const {
    originCurrency,
    targetCurrency,
    effectiveRate,
    fetchedRate,
    manualRate,
    setManualRate,
    isManualOverrideEnabled,
    setIsManualOverrideEnabled,
    isLoading,
    error
  } = useCurrency();

  const [localOverrideInput, setLocalOverrideInput] = useState<string>(manualRate.toString());
  const [fxSimulationPercentage, setFxSimulationPercentage] = useState<number>(0);

  useEffect(() => {
    if (manualRate.toString() !== localOverrideInput) {
        setLocalOverrideInput(manualRate.toString());
    }
  }, [manualRate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setLocalOverrideInput(value);
    }
  };

  const handleApplyOverride = () => {
    const newRate = parseFloat(localOverrideInput);
    if (!isNaN(newRate) && newRate > 0) {
      setManualRate(localOverrideInput);
      if (!isManualOverrideEnabled) {
        setIsManualOverrideEnabled(true);
      }
    } else {
      console.error("Invalid override rate input");
      setLocalOverrideInput(manualRate.toString());
    }
  };

  const handleReset = () => {
    setIsManualOverrideEnabled(false);
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      const inputNum = parseFloat(localOverrideInput);
      if (checked && !isNaN(inputNum) && inputNum > 0) {
           if (localOverrideInput !== manualRate.toString()) {
               setManualRate(localOverrideInput);
           }
           setIsManualOverrideEnabled(true);
      } else if (!checked) {
          setIsManualOverrideEnabled(false);
      } else {
          console.warn("Cannot enable override without a valid rate in the input field.");
      }
  };

  if (!originCurrency || !targetCurrency) {
    return (
        <div className="p-4 border rounded-md shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-2">Exchange Rate Override</h3>
            <p className="text-sm text-gray-500">Please select origin and target countries first.</p>
        </div>
    );
  }

  const displayRate = effectiveRate;
  const rateSourceText = isManualOverrideEnabled ? "(Manual Override Active)" : "(Using Live API Rate)";

  return (
    <div className="p-4 border rounded-md shadow-sm bg-white space-y-3">
      <h3 className="text-lg font-semibold">Exchange Rate Override</h3>
      
      <div className="text-sm">
        <p>From: <span className="font-medium">{originCurrency}</span></p>
        <p>To: <span className="font-medium">{targetCurrency}</span></p>
      </div>

      <div className={`p-2 rounded ${isManualOverrideEnabled && manualRate ? 'bg-yellow-100' : 'bg-blue-50'}`}>
        <p className="text-sm font-medium">Current Effective Rate:</p>
        <p className="text-lg font-bold">
          {isLoading ? 'Loading...' : error ? 'Error' : displayRate ? `1 ${originCurrency} = ${displayRate.toFixed(4)} ${targetCurrency}` : 'N/A'}
        </p>
        <p className="text-xs text-gray-600">{rateSourceText}</p>
      </div>

      {error && <p className="text-xs text-red-500">Error fetching API rate: {error.message}</p>}

      <div className="flex items-center space-x-2">
        <input 
            type="checkbox"
            id="override-toggle"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={isManualOverrideEnabled}
            onChange={handleToggle}
            disabled={!localOverrideInput || parseFloat(localOverrideInput) <= 0}
        />
        <label htmlFor="override-toggle" className="text-sm font-medium">
          Enable Manual Override
        </label>
      </div>

      <div className="flex items-end space-x-2">
        <div className="flex-grow">
          <label htmlFor="override-rate-input" className="block text-xs text-gray-500 mb-1">
            Override Rate (1 {originCurrency} = X {targetCurrency})
          </label>
          <input
            id="override-rate-input"
            type="text"
            inputMode="decimal"
            placeholder={`e.g., ${(fetchedRate ?? 1.1).toFixed(2)}`}
            value={localOverrideInput}
            onChange={handleInputChange}
            className="text-sm form-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button 
            onClick={handleApplyOverride} 
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!localOverrideInput || parseFloat(localOverrideInput) <= 0 || localOverrideInput === manualRate.toString()}
        >
            Apply
        </button>
        <button 
            onClick={handleReset} 
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!isManualOverrideEnabled && !manualRate}
        >
          Reset
        </button>
      </div>

      {/* --- FX Simulation Section --- */}
      <div className="mt-6 border-t pt-4 space-y-3">
          <h4 className="text-md font-semibold">FX Rate Simulation</h4>
          <p className="text-xs text-gray-500">
              Simulate how a +/- percentage change in the effective exchange rate 
              ( <code className="text-xs bg-gray-100 p-0.5 rounded">1 {originCurrency} = {effectiveRate?.toFixed(4) ?? 'N/A'} {targetCurrency}</code> )
              might impact your budget. Calculations throughout the app will use this simulated rate.
          </p>

          <div className="flex items-center space-x-3">
              <span className="text-sm font-medium w-16 text-right">{fxSimulationPercentage}%</span>
              <input 
                  type="range" 
                  min="-25" 
                  max="25" 
                  step="1" 
                  value={fxSimulationPercentage}
                  onChange={(e) => setFxSimulationPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
          </div>
           {/* Optional: Direct input (can add validation/sync later if needed) */}
          {/* <input type="number" value={fxSimulationPercentage} onChange={(e) => setFxSimulationPercentage(Number(e.target.value))} /> */}

          <div className="flex items-center justify-between pt-2">
              <div className="space-x-1">
                {/* Optional Preset Buttons */}
                {[-15, -10, -5, 5, 10, 15].map(perc => (
                    <button
                        key={perc}
                        onClick={() => setFxSimulationPercentage(perc)}
                        className={`px-2 py-1 text-xs rounded ${fxSimulationPercentage === perc ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {perc > 0 ? '+' : ''}{perc}%
                    </button>
                ))}
              </div>
              <button 
                  onClick={() => setFxSimulationPercentage(0)}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={fxSimulationPercentage === 0}
              >
                  Reset Sim
              </button>
          </div>
      </div>

    </div>
  );
};

export default FXRateOverride; 