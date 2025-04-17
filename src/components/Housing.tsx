import React, { useState, useEffect } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatDualCurrency } from '@/utils/formatting';

// Helper function for mortgage calculation
function calculateMonthlyMortgage(principal: number, annualRate: number, years: number): number | null {
  if (principal <= 0 || annualRate <= 0 || years <= 0) {
    return null; // Invalid input
  }
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;
  
  const numerator = monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments);
  const denominator = Math.pow(1 + monthlyRate, numberOfPayments) - 1;
  
  if (denominator === 0) return null; // Avoid division by zero if rate is extremely low or term is 0

  const monthlyPayment = principal * (numerator / denominator);
  return monthlyPayment;
}

// Updated HousingProps to include props passed from parent
type HousingProps = {
  isBuying: boolean;
  monthlyRent: number | '';
  propertyPrice: number | '';
  downPaymentPercentage: number | '';
  mortgageTermYears: number | '';
  mortgageInterestRate: number | '';
  annualMaintenance: number | '';
  annualInsurance: number | '';
  annualPropertyTax: number | '';
  futureUpgradeCost: number | '';
  onHousingChange: (key: string, value: any) => void;
  // TODO: Add props for common housing costs
};

const Housing: React.FC<HousingProps> = ({ 
  isBuying, 
  monthlyRent,
  propertyPrice,
  downPaymentPercentage,
  mortgageTermYears,
  mortgageInterestRate,
  annualMaintenance,
  annualInsurance,
  annualPropertyTax,
  futureUpgradeCost,
  onHousingChange 
}) => {
  // Get currency context
  const { originCurrency, targetCurrency, effectiveRate, isLoading: isLoadingRates } = useCurrency();

  // State for calculated mortgage payment
  const [monthlyMortgagePayment, setMonthlyMortgagePayment] = useState<number | null>(null);

  // Recalculate mortgage when inputs change
  useEffect(() => {
    if (isBuying && propertyPrice && downPaymentPercentage && mortgageTermYears && mortgageInterestRate) {
      const price = Number(propertyPrice);
      const dpPercent = Number(downPaymentPercentage);
      const term = Number(mortgageTermYears);
      const rate = Number(mortgageInterestRate);

      if (price > 0 && dpPercent >= 0 && dpPercent <= 100 && term > 0 && rate > 0) {
        const principal = price * (1 - dpPercent / 100);
        const payment = calculateMonthlyMortgage(principal, rate, term);
        setMonthlyMortgagePayment(payment);
      } else {
        setMonthlyMortgagePayment(null); // Reset if inputs are invalid
      }
    } else {
      setMonthlyMortgagePayment(null); // Reset if not buying or inputs missing
    }
  }, [isBuying, propertyPrice, downPaymentPercentage, mortgageTermYears, mortgageInterestRate]);

  const handleToggle = () => {
    // Use the prop function to update the parent state
    onHousingChange('isBuying', !isBuying);
  };

  // Helper to render dual currency format
  const renderDualCurrency = (amount: number | null | '', isAnnual: boolean = false) => {
    // Add loading check
    if (isLoadingRates || !targetCurrency || !originCurrency || effectiveRate === null) {
      return <span className="text-xs text-gray-500">Loading rates...</span>;
    }
    
    const numericAmount = Number(amount);
    if (amount === null || amount === '' || isNaN(numericAmount)) {
       // Return an empty fragment or a placeholder if no amount is entered yet
       return <></>; 
    }

    const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
    const annualSuffix = isAnnual ? ' / yr' : '';

    // Return a fragment containing the formatted string or elements
    return (
      <span className="text-xs text-gray-500">
        ≈ {formatted.origin}{annualSuffix}
      </span>
    );
  };
  
  // Helper to render the main display value (e.g., for mortgage payment)
  const renderMainDualCurrency = (amount: number | null | '') => {
     if (isLoadingRates || !targetCurrency || !originCurrency || effectiveRate === null) {
      return <span className="text-lg">Loading rates...</span>;
    }
    const numericAmount = Number(amount);
     if (amount === null || amount === '' || isNaN(numericAmount)) return 'N/A';

    const formatted = formatDualCurrency(numericAmount, targetCurrency, originCurrency, effectiveRate);
    return (
      <>
        <span className="font-bold">{formatted.destination}</span>
        <span className="text-sm font-normal"> / {formatted.origin}</span>
      </>
    );
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Housing</h2>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">{isBuying ? 'Buying' : 'Renting'}</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isBuying}
              onChange={handleToggle}
            />
          </label>
        </div>

        {isBuying ? (
          <div>
            {/* Buying Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Property Price ({targetCurrency})</span></label>
                <input type="number" placeholder="e.g., 300000" className="input input-bordered" 
                       value={propertyPrice} onChange={(e) => onHousingChange('propertyPrice', e.target.value)} />
                {/* Display dual currency equivalent for property price input */}
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                   {renderDualCurrency(propertyPrice)}
                </div>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Down Payment (%)</span></label>
                <input type="number" placeholder="e.g., 20" className="input input-bordered" 
                       value={downPaymentPercentage} onChange={(e) => onHousingChange('downPaymentPercentage', e.target.value)} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Mortgage Term (Years)</span></label>
                <input type="number" placeholder="e.g., 30" className="input input-bordered" 
                       value={mortgageTermYears} onChange={(e) => onHousingChange('mortgageTermYears', e.target.value)} />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Interest Rate (%)</span></label>
                <input type="number" step="0.1" placeholder="e.g., 3.5" className="input input-bordered" 
                       value={mortgageInterestRate} onChange={(e) => onHousingChange('mortgageInterestRate', e.target.value)} />
              </div>
            </div>
            {/* Placeholder for Calculated Mortgage Payment */}
            <div className="mt-4 p-2 bg-base-200 rounded">
              <p className="text-sm font-semibold">Estimated Monthly Mortgage: </p>
              <p className="text-lg whitespace-normal">
                {renderMainDualCurrency(monthlyMortgagePayment)}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {/* Renting Inputs */}
            <div className="form-control w-full max-w-xs mt-4">
              <label className="label">
                <span className="label-text">Monthly Rent ({targetCurrency})</span>
              </label>
              <input
                type="number"
                placeholder="e.g., 1200"
                className="input input-bordered w-full max-w-xs"
                value={monthlyRent}
                onChange={(e) => onHousingChange('monthlyRent', e.target.value)}
              />
              {/* Display dual currency equivalent for rent input */}
              <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                 {renderDualCurrency(monthlyRent)}
              </div>
            </div>
          </div>
        )}
         {/* Common Housing Costs */}
         <div className="divider mt-6 mb-4">Annual Costs ({targetCurrency})</div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="form-control">
             <label className="label"><span className="label-text">Maintenance</span></label>
             <input type="number" placeholder="e.g., 1500" className="input input-bordered" 
                    value={annualMaintenance} onChange={(e) => onHousingChange('annualMaintenance', e.target.value)} />
              <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                 {renderDualCurrency(annualMaintenance, true)}
              </div>
           </div>
           <div className="form-control">
             <label className="label"><span className="label-text">Insurance</span></label>
             <input type="number" placeholder="e.g., 500" className="input input-bordered" 
                    value={annualInsurance} onChange={(e) => onHousingChange('annualInsurance', e.target.value)} />
               <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                 {renderDualCurrency(annualInsurance, true)}
              </div>
           </div>
           <div className="form-control">
             <label className="label"><span className="label-text">Property Tax</span></label>
             <input type="number" placeholder="e.g., 800" className="input input-bordered" 
                    value={annualPropertyTax} onChange={(e) => onHousingChange('annualPropertyTax', e.target.value)} />
               <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                 {renderDualCurrency(annualPropertyTax, true)}
              </div>
           </div>
         </div>

         {/* Future Upgrade Cost */}
         <div className="divider mt-6 mb-4">One-Off Costs ({targetCurrency})</div>
         <div className="form-control w-full md:max-w-xs">
           <label className="label"><span className="label-text">Future Upgrade Cost</span></label>
           <input type="number" placeholder="e.g., 10000" className="input input-bordered" 
                  value={futureUpgradeCost} onChange={(e) => onHousingChange('futureUpgradeCost', e.target.value)} />
           <div className="text-xs text-gray-500 mt-1 text-right pr-1">
              {renderDualCurrency(futureUpgradeCost)}
           </div>
           <label className="label">
             <span className="label-text-alt">One-off cost during your stay (e.g., major renovation, buying a second property later).</span>
           </label>
         </div>
      </div>
    </div>
  );
};

export default Housing; 