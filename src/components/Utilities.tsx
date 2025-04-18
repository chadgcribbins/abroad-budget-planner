import React from 'react';
import { useCurrency } from '@/context/CurrencyContext'; // Import context hook
import { formatDualCurrency } from '@/utils/formatting'; // Import formatter

// Define the props for the Utilities component
type UtilitiesProps = {
  electricity: number | '';
  isSeasonalElectricity: boolean;
  electricityWinter: number | '';
  electricitySpring: number | '';
  electricitySummer: number | '';
  electricityFall: number | '';

  water: number | '';

  gasHeating: number | '';
  isSeasonalGasHeating: boolean;
  gasHeatingWinter: number | '';
  gasHeatingSpring: number | '';
  gasHeatingSummer: number | '';
  gasHeatingFall: number | '';

  internet: number | '';
  mobile: number | '';

  // Unified change handler
  onUtilitiesChange: (key: keyof Omit<UtilitiesProps, 'onUtilitiesChange'>, value: string | boolean) => void;
};

const Utilities: React.FC<UtilitiesProps> = ({ 
  electricity,
  isSeasonalElectricity,
  electricityWinter,
  electricitySpring,
  electricitySummer,
  electricityFall,
  water,
  gasHeating,
  isSeasonalGasHeating,
  gasHeatingWinter,
  gasHeatingSpring,
  gasHeatingSummer,
  gasHeatingFall,
  internet,
  mobile,
  onUtilitiesChange 
}) => {
  const { originCurrency, targetCurrency, effectiveRate } = useCurrency(); // Get currency context

  // Helper to render dual currency format
  const renderDualCurrency = (amount: number | null | '') => {
    const numericAmount = Number(amount);
    if (amount === null || amount === '' || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate) return 'N/A';

    const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
    return (
      <>
        <span className="font-bold">{formatted.destination}</span>
        <span className="text-sm font-normal"> / {formatted.origin}</span>
      </>
    );
  };

  // Helper to display origin currency equivalent below inputs
  const showOriginEquivalent = (amount: number | '') => {
     const numericAmount = Number(amount);
     if (amount === null || amount === '' || isNaN(numericAmount) || !targetCurrency || !originCurrency || !effectiveRate || numericAmount <= 0) return null;
     const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
     return `≈ ${formatted.origin}`;
  };

  // Calculate seasonal average safely
  const calculateSeasonalAverage = (
    winter: number | '',
    spring: number | '',
    summer: number | '',
    fall: number | ''
  ): number => {
    const values = [winter, spring, summer, fall];
    const validValues = values.map(v => Number(v) || 0).filter(v => v >= 0);
    return validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
  };

  // Calculate total monthly utility cost, considering seasonal variations
  const calculateTotal = (): number => {
    const electricityCost = isSeasonalElectricity 
      ? calculateSeasonalAverage(electricityWinter, electricitySpring, electricitySummer, electricityFall)
      : (Number(electricity) || 0);

    const gasHeatingCost = isSeasonalGasHeating
      ? calculateSeasonalAverage(gasHeatingWinter, gasHeatingSpring, gasHeatingSummer, gasHeatingFall)
      : (Number(gasHeating) || 0);
      
    const waterCost = Number(water) || 0;
    const internetCost = Number(internet) || 0;
    const mobileCost = Number(mobile) || 0;

    return electricityCost + gasHeatingCost + waterCost + internetCost + mobileCost;
  };

  const totalUtilities = calculateTotal();

  // Handle number/empty string inputs
  const handleInputChange = (key: keyof Omit<UtilitiesProps, 'onUtilitiesChange'>, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      onUtilitiesChange(key, value);
    }
  };

  // Handle toggle changes
  const handleToggleChange = (key: 'isSeasonalElectricity' | 'isSeasonalGasHeating', value: boolean) => {
    onUtilitiesChange(key, value);
  };

  // Helper component for seasonal inputs (with currency formatting)
  const SeasonalInputGroup: React.FC<{ 
    baseKey: 'electricity' | 'gasHeating';
    winter: number | '';
    spring: number | '';
    summer: number | '';
    fall: number | '';
   }> = ({ baseKey, winter, spring, summer, fall }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1 col-span-3 md:col-span-1">
      {[ {key: `${baseKey}Winter`, label: 'Winter', value: winter},
        {key: `${baseKey}Spring`, label: 'Spring', value: spring},
        {key: `${baseKey}Summer`, label: 'Summer', value: summer},
        {key: `${baseKey}Fall`,   label: 'Fall',   value: fall}
      ].map(season => {
        const originEquiv = showOriginEquivalent(season.value);
        return (
          <div key={season.key} className="form-control">
            <label className="label label-text-alt pb-0">{season.label} ({targetCurrency})</label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 90" // Placeholder update
              className="input input-bordered input-sm"
              value={season.value}
              onChange={(e) => handleInputChange(season.key as keyof Omit<UtilitiesProps, 'onUtilitiesChange'>, e.target.value)}
            />
            {originEquiv && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {originEquiv}
                </div>
            )}
          </div>
        )
      })}
    </div>
   );

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title lg:text-2xl">Utilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-4 items-start">
          {/* --- Electricity --- */}
          <div className="form-control md:col-span-1">
            <label className="label justify-start gap-2">
              <span className="label-text text-sm md:text-base">Electricity ({targetCurrency}/month)</span>
              <input 
                type="checkbox" 
                className="toggle toggle-xs toggle-primary"
                checked={isSeasonalElectricity}
                onChange={(e) => handleToggleChange('isSeasonalElectricity', e.target.checked)}
              />
              <span className="label-text-alt">Seasonal?</span>
            </label>
            {!isSeasonalElectricity && (
              <>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  placeholder="e.g., 80"
                  className="input input-bordered" 
                  value={electricity}
                  onChange={(e) => handleInputChange('electricity', e.target.value)} 
                />
                 {showOriginEquivalent(electricity) && (
                    <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                        {showOriginEquivalent(electricity)}
                    </div>
                 )}
              </>
            )}
          </div>
          {isSeasonalElectricity && (
            <SeasonalInputGroup 
              baseKey='electricity' 
              winter={electricityWinter} 
              spring={electricitySpring} 
              summer={electricitySummer} 
              fall={electricityFall} 
            />
          )}
          {/* Spacer if not seasonal to maintain grid alignment */}
          {!isSeasonalElectricity && <div className="hidden md:block md:col-span-2"></div>}

          {/* --- Water --- */}
          <div className="form-control md:col-span-1">
            <label className="label"><span className="label-text text-sm md:text-base">Water ({targetCurrency}/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 40"
              className="input input-bordered" 
              value={water}
              onChange={(e) => handleInputChange('water', e.target.value)} 
            />
            {showOriginEquivalent(water) && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {showOriginEquivalent(water)}
                </div>
             )}
          </div>
          {/* Spacer */}
          <div className="hidden md:block md:col-span-2"></div> 

          {/* --- Gas/Heating --- */}
          <div className="form-control md:col-span-1">
            <label className="label justify-start gap-2">
              <span className="label-text text-sm md:text-base">Gas/Heating ({targetCurrency}/month)</span>
              <input 
                type="checkbox" 
                className="toggle toggle-xs toggle-primary"
                checked={isSeasonalGasHeating}
                onChange={(e) => handleToggleChange('isSeasonalGasHeating', e.target.checked)}
              />
              <span className="label-text-alt">Seasonal?</span>
            </label>
            {!isSeasonalGasHeating && (
              <>
                <input 
                  type="number" 
                  min="0" 
                  step="0.01"
                  placeholder="e.g., 100" 
                  className="input input-bordered" 
                  value={gasHeating}
                  onChange={(e) => handleInputChange('gasHeating', e.target.value)} 
                />
                {showOriginEquivalent(gasHeating) && (
                    <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                        {showOriginEquivalent(gasHeating)}
                    </div>
                 )}
               </>
            )}
          </div>
          {isSeasonalGasHeating && (
            <SeasonalInputGroup 
              baseKey='gasHeating' 
              winter={gasHeatingWinter} 
              spring={gasHeatingSpring} 
              summer={gasHeatingSummer} 
              fall={gasHeatingFall} 
            />
          )}
          {/* Spacer if not seasonal */}
          {!isSeasonalGasHeating && <div className="hidden md:block md:col-span-2"></div>}

          {/* --- Internet --- */}
          <div className="form-control md:col-span-1">
            <label className="label"><span className="label-text text-sm md:text-base">Internet ({targetCurrency}/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 50"
              className="input input-bordered" 
              value={internet}
              onChange={(e) => handleInputChange('internet', e.target.value)} 
            />
            {showOriginEquivalent(internet) && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {showOriginEquivalent(internet)}
                </div>
             )}
          </div>
           {/* Spacer */}
           <div className="hidden md:block md:col-span-2"></div> 

          {/* --- Mobile --- */}
          <div className="form-control md:col-span-1">
            <label className="label"><span className="label-text text-sm md:text-base">Mobile ({targetCurrency}/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 30"
              className="input input-bordered" 
              value={mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)} 
            />
            {showOriginEquivalent(mobile) && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {showOriginEquivalent(mobile)}
                </div>
             )}
          </div>
           {/* Spacer */}
           <div className="hidden md:block md:col-span-2"></div> 
        </div>

        {/* Total Display - Apply formatting */}
        <div className="md:col-span-3 mt-6 pt-4 border-t border-base-300 text-right">
          <span className="text-lg lg:text-xl font-semibold">
             Total Monthly Utilities: {renderDualCurrency(totalUtilities)}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Utilities; 