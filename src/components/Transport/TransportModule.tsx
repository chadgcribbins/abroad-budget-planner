'use client';

import React, { useState, useEffect } from 'react';
import { useTransport } from '@/context/TransportContext';
import { CarOwnershipDetails, PublicTransportDetails } from '@/types/transport.types';
import { useCurrency } from '@/context/CurrencyContext';
import { formatDualCurrency } from '@/utils/formatting';

// Helper for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(later, wait);
    };
}

// Reusable Input Component (Optional but good practice)
interface NumberInputProps {
    label: string;
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    placeholder?: string;
    min?: number;
    originCurrency?: string;
    targetCurrency?: string;
    effectiveRate?: number | null;
}
const NumberInput: React.FC<NumberInputProps> = ({
    label,
    value,
    onChange,
    placeholder,
    min = 0,
    originCurrency,
    targetCurrency,
    effectiveRate
}) => {
    const [internalValue, setInternalValue] = useState<string>(value?.toString() ?? '');

    // Update internal state when prop changes
    useEffect(() => {
        setInternalValue(value?.toString() ?? '');
    }, [value]);

    const debouncedOnChange = React.useCallback(
        debounce((valStr: string) => {
            const num = valStr === '' ? undefined : parseFloat(valStr);
            if (valStr === '' || (num !== undefined && !isNaN(num) && num >= (min ?? 0))) {
                onChange(num);
            }
        }, 300), // Debounce by 300ms
        [onChange, min]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInternalValue(e.target.value);
        debouncedOnChange(e.target.value);
    };

    // Function to show origin currency equivalent
    const showOriginEquivalent = () => {
        if (originCurrency && targetCurrency && effectiveRate && value !== undefined && value > 0) {
            const formatted = formatDualCurrency(value, targetCurrency, originCurrency, effectiveRate);
            return `≈ ${formatted.origin}`;
        }
        return null;
    };

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">{label} ({targetCurrency})</span>
            </label>
            <input
                type="number"
                placeholder={placeholder}
                className="input input-bordered w-full"
                value={internalValue}
                onChange={handleChange}
                min={min}
                step="any"
            />
            {/* Display origin currency equivalent */}
            {showOriginEquivalent() && (
                <div className="text-xs text-gray-500 mt-1 text-right pr-1">
                    {showOriginEquivalent()}
                </div>
            )}
        </div>
    );
};

const TransportModule: React.FC = () => {
  const { state, dispatch } = useTransport();
  const { originCurrency, targetCurrency, effectiveRate } = useCurrency();
  const carDetails = state.carDetails;
  const publicTransportDetails = state.publicTransportDetails;

  const handleHasCarToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'TOGGLE_HAS_CAR', payload: event.target.checked });
  };

  // --- Handlers for Car Details --- 
  const updateCarDetail = (key: keyof CarOwnershipDetails, value: any) => {
      dispatch({ type: 'UPDATE_CAR_DETAILS', payload: { [key]: value } });
  };

  // --- Handler for Public Transport Details --- 
  const updatePublicTransportDetail = (key: keyof PublicTransportDetails, value: any) => {
      dispatch({ type: 'UPDATE_PUBLIC_TRANSPORT_DETAILS', payload: { [key]: value } });
  };

  // Helper to pass currency info to NumberInput
  const currencyProps = { originCurrency, targetCurrency, effectiveRate };

  return (
    <div className="mb-6 p-4 border rounded-lg shadow-sm bg-base-100">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Transportation</h2>

      {/* Car Ownership Toggle */}
      <div className="form-control mb-4">
        <label className="label cursor-pointer justify-start gap-4">
          <span className="label-text text-lg font-medium">Do you plan to own/lease a car?</span> 
          <input 
            type="checkbox" 
            className="toggle toggle-primary" 
            checked={state.hasCar}
            onChange={handleHasCarToggle}
          />
        </label>
      </div>

      {/* Conditional Car Details Section */}
      {state.hasCar && (
        <div className="mb-4 p-4 border border-dashed rounded-md bg-base-200/30">
          <h3 className="text-xl font-medium mb-3">Car Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Car Type (Radio) */}
            <div className="form-control">
                <label className="label"><span className="label-text">Car Type</span></label>
                <div className="flex gap-4">
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text">Gas</span> 
                        <input type="radio" name="carType" className="radio radio-primary" 
                               checked={carDetails?.type === 'Gas'}
                               onChange={() => updateCarDetail('type', 'Gas')} />
                    </label>
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text">Electric</span> 
                        <input type="radio" name="carType" className="radio radio-primary" 
                               checked={carDetails?.type === 'Electric'}
                               onChange={() => updateCarDetail('type', 'Electric')} />
                    </label>
                </div>
            </div>

            {/* Purchase Type (Radio) */}
             <div className="form-control">
                <label className="label"><span className="label-text">Ownership Type</span></label>
                <div className="flex gap-4">
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text">Purchase</span> 
                        <input type="radio" name="purchaseType" className="radio radio-primary" 
                               checked={carDetails?.purchaseType === 'Purchase'}
                               onChange={() => updateCarDetail('purchaseType', 'Purchase')} />
                    </label>
                    <label className="label cursor-pointer gap-2">
                        <span className="label-text">Lease</span> 
                        <input type="radio" name="purchaseType" className="radio radio-primary" 
                               checked={carDetails?.purchaseType === 'Lease'}
                               onChange={() => updateCarDetail('purchaseType', 'Lease')} />
                    </label>
                </div>
            </div>

             {/* Car Cost (Purchase Only) */}
            {carDetails?.purchaseType === 'Purchase' && (
                 <NumberInput
                    label="Est. Purchase Price"
                    value={carDetails?.carCost}
                    onChange={(val) => updateCarDetail('carCost', val)}
                    placeholder="e.g., 25000"
                    {...currencyProps}
                 />
            )}

            {/* Monthly Payment (Generic - could be loan or lease) */}
             <NumberInput
                label="Monthly Loan/Lease Payment"
                value={carDetails?.monthlyPayment}
                onChange={(val) => updateCarDetail('monthlyPayment', val)}
                placeholder="e.g., 400"
                {...currencyProps}
             />
           
             {/* Fuel/Charging Cost */}
             <NumberInput
                label={carDetails?.type === 'Electric' ? "Monthly Charging Cost" : "Monthly Fuel Cost"}
                value={carDetails?.monthlyFuelChargingCost}
                onChange={(val) => updateCarDetail('monthlyFuelChargingCost', val)}
                placeholder="e.g., 150"
                {...currencyProps}
             />

             {/* Insurance Cost */}
             <NumberInput
                label="Monthly Insurance Cost"
                value={carDetails?.monthlyInsuranceCost}
                onChange={(val) => updateCarDetail('monthlyInsuranceCost', val)}
                placeholder="e.g., 100"
                {...currencyProps}
             />

             {/* Maintenance Cost */}
              <NumberInput
                label="Monthly Maintenance Cost"
                value={carDetails?.monthlyMaintenanceCost}
                onChange={(val) => updateCarDetail('monthlyMaintenanceCost', val)}
                placeholder="e.g., 50"
                {...currencyProps}
             />
          </div>
        </div>
      )}

      {/* Public Transport Section */}
      <div className="mb-4 p-4 border border-dashed rounded-md bg-base-200/30">
         <h3 className="text-xl font-medium mb-3">Public Transport & Other</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NumberInput
                label="Monthly Public Transport Pass(es)"
                value={publicTransportDetails.monthlyPassCost}
                onChange={(val) => updatePublicTransportDetail('monthlyPassCost', val)}
                placeholder="e.g., 80"
                {...currencyProps}
             />
              <NumberInput
                label="Monthly Ride-Share / Taxi Average"
                value={publicTransportDetails.monthlyRideShareCost}
                onChange={(val) => updatePublicTransportDetail('monthlyRideShareCost', val)}
                placeholder="e.g., 50"
                {...currencyProps}
             />
          </div>
      </div>

      {/* TODO: Display calculated total transport cost? */}

    </div>
  );
};

export default TransportModule; 