import React from 'react';
import { useCurrency } from '@/context/CurrencyContext'; // <-- Import hook

// Remove props interface or keep it empty if no props are needed
// interface FXSettingsProps { ... }

const FXSettings: React.FC = () => { // <-- No props
  // Get state and handlers from context
  const {
    originCurrency,
    targetCurrency,
    fetchedRate,
    manualRate,
    isManualOverrideEnabled,
    fxSimulationPercentage,
    effectiveRate, // Use effectiveRate from context for display if needed
    isLoading, // Use loading state
    error, // Use error state
    setManualRate,
    setIsManualOverrideEnabled,
    setFxSimulationPercentage
  } = useCurrency();

  // Base rate calculation now happens in context, but we might need it for display logic
  const displayBaseRate = isManualOverrideEnabled ? Number(manualRate) : fetchedRate;
  // Simulated rate calculation also happens in context (effectiveRate)
  // We recalculate here only if needed for display consistency before context updates?
  // Or directly use effectiveRate if simulation != 0?
  // Let's use effectiveRate when simulation is active, otherwise displayBaseRate.
  const displaySimulatedRate = fxSimulationPercentage !== 0 ? effectiveRate : null; // Show only if simulation is active

  // Display loading or error state
  if (isLoading) {
    return (
       <div className="card bg-base-200 shadow-xl mb-4">
         <div className="card-body items-center text-center">
           <h2 className="card-title">Foreign Exchange (FX) Settings & Simulation</h2>
           <span className="loading loading-dots loading-md"></span>
           <p>Loading exchange rate...</p>
         </div>
       </div>
    );
  }
  if (error) {
     return (
       <div className="card bg-error text-error-content shadow-xl mb-4">
         <div className="card-body">
           <h2 className="card-title">FX Settings Error</h2>
           <p>Could not load exchange rate: {error.message}</p>
         </div>
       </div>
     );
  }
  // Don't render if currencies aren't set
  if (!originCurrency || !targetCurrency) {
      return (
        <div className="card bg-base-200 shadow-xl mb-4">
         <div className="card-body items-center text-center">
            <h2 className="card-title">Foreign Exchange (FX) Settings & Simulation</h2>
            <p className="text-sm text-gray-500">Select origin and destination countries first.</p>
          </div>
        </div>
      );
  }


  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Foreign Exchange (FX) Settings & Simulation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Base Currency Display */}
          <div>
            <label className="label">
              <span className="label-text">Base Currency (Origin)</span>
            </label>
            <input 
              type="text" 
              value={originCurrency} // Use from context
              readOnly 
              className="input input-bordered w-full max-w-xs input-disabled"
            />
          </div>
          
          {/* Target Currency Display */}
          <div>
            <label className="label">
              <span className="label-text">Target Currency (Destination)</span>
            </label>
            <input 
              type="text" 
              value={targetCurrency} // Use from context
              readOnly 
              className="input input-bordered w-full max-w-xs input-disabled"
            />
          </div>

          {/* Base Rate Display */}
          <div>
            <label className="label">
              <span className="label-text">Base Exchange Rate (1 {originCurrency} = ?)</span>
            </label>
            <input 
              type="text" 
              value={displayBaseRate !== null && !isNaN(displayBaseRate) ? `${displayBaseRate.toFixed(4)} ${targetCurrency}` : 'Not Available'} 
              readOnly 
              className="input input-bordered w-full max-w-xs input-disabled"
            />
            {fetchedRate !== null && !isManualOverrideEnabled && (
              <label className="label">
                <span className="label-text-alt">(Rate from API)</span>
              </label>
            )}
             {isManualOverrideEnabled && (
              <label className="label">
                <span className="label-text-alt">(Manual Override Active)</span>
              </label>
            )}
          </div>

          {/* Manual Override Section */}
          <div>
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Manual Override</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={isManualOverrideEnabled} // Use from context
                  onChange={(e) => setIsManualOverrideEnabled(e.target.checked)} // Use handler from context
                />
              </label>
            </div>
            
            {isManualOverrideEnabled && (
              <div>
                <label className="label">
                  <span className="label-text">Set Manual Rate (1 {originCurrency} = ?)</span>
                </label>
                <input 
                  type="number" 
                  placeholder={`e.g., ${fetchedRate ? fetchedRate.toFixed(4) : '1.18'}`} 
                  className={`input input-bordered w-full max-w-xs ${isNaN(Number(manualRate)) ? 'input-error' : ''}`}
                  value={manualRate} // Use from context
                  onChange={(e) => setManualRate(e.target.value)} // Use handler from context
                  step="0.0001"
                />
              </div>
            )}
          </div>
          
          {/* FX Simulation Section */}
          <div className="md:col-span-2 border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-2">FX Rate Simulation</h3>
            <label className="label">
              <span className="label-text">Simulate % Change vs Base Rate: <strong>{fxSimulationPercentage}%</strong></span>
            </label>
            <input 
              type="range" 
              min="-20" 
              max="20" 
              value={fxSimulationPercentage} // Use from context
              onChange={(e) => setFxSimulationPercentage(Number(e.target.value))} // Use handler from context
              className="range range-primary"
              step="1"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>-20%</span>
              <span>0%</span>
              <span>+20%</span>
            </div>
            
            {/* Display Simulated Rate - Only if simulation is active */}
            {displaySimulatedRate !== null && (
              <div className="mt-4">
                 <label className="label">
                   <span className="label-text">Simulated Exchange Rate (1 {originCurrency} = ?)</span>
                 </label>
                 <input 
                   type="text" 
                   value={`${displaySimulatedRate.toFixed(4)} ${targetCurrency}`} 
                   readOnly 
                   className="input input-bordered w-full max-w-xs input-disabled font-bold"
                 />
                 <label className="label">
                   <span className="label-text-alt">This rate will be used for calculations.</span>
                 </label>
               </div>
            )}
          </div>
          
        </div> 
      </div>
    </div>
  );
};

export default FXSettings; 