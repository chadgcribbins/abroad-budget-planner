'use client';

import React from 'react';
import { useEmergencyBuffer } from '@/context/EmergencyBufferContext';
import { formatCurrency } from '../utils/currencyUtils'; // Use relative path
import { useCurrency } from '@/context/CurrencyContext'; // To get the target currency

const EmergencyBufferModule: React.FC = () => {
  const { state, dispatch } = useEmergencyBuffer();
  const { targetCurrency } = useCurrency(); // Use target currency for display

  const handleTargetMonthsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    dispatch({ type: 'SET_TARGET_MONTHS', payload: isNaN(value) ? 0 : value });
  };

  const handleCurrentReserveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    dispatch({ type: 'SET_CURRENT_RESERVE', payload: isNaN(value) ? 0 : value });
  };

  const calculatedMonthlyExpenses = state.calculatedFixedMonthlyExpenses;
  const targetMonths = state.targetMonthsOfCoverage;
  const currentReserve = state.currentReserveAmount;

  const targetAmount = calculatedMonthlyExpenses * targetMonths;
  const shortfall = Math.max(0, targetAmount - currentReserve);
  const runwayMonths = calculatedMonthlyExpenses > 0 ? (currentReserve / calculatedMonthlyExpenses) : Infinity;

  // Calculate progress percentage for the visualization
  const progressPercent = targetAmount > 0 ? Math.min((currentReserve / targetAmount) * 100, 100) : 0;

  // Determine progress bar color
  let progressColorClass = 'progress-primary'; // Default
  if (targetAmount > 0) { 
      if (progressPercent >= 100) {
          progressColorClass = 'progress-success';
      } else if (progressPercent >= 50) {
          progressColorClass = 'progress-warning';
      } else {
          progressColorClass = 'progress-error';
      }
  }

  // --- Recommendation Logic --- 
  let recommendationText = '';
  const runwayMonthsFinite = isFinite(runwayMonths) ? runwayMonths : 0;

  if (calculatedMonthlyExpenses <= 0 && currentReserve <= 0) {
      recommendationText = 'Enter your reserve amount and ensure monthly expenses are calculated to see recommendations.';
  } else if (calculatedMonthlyExpenses <= 0 && currentReserve > 0) {
      recommendationText = 'Your reserve is positive, but we need calculated monthly expenses to determine your runway and provide recommendations.';
  } else if (progressPercent >= 100) {
    recommendationText = `Great job! Your emergency buffer meets or exceeds your target of ${targetMonths} months. Your current runway is ${runwayMonthsFinite.toFixed(1)} months.`;
    if (runwayMonthsFinite > 12) { // Suggest considering investment for very large buffers
        recommendationText += " Consider whether excess funds could be allocated to other financial goals."
    }
  } else if (runwayMonthsFinite >= 3) {
    recommendationText = `You're on the right track with ${runwayMonthsFinite.toFixed(1)} months of coverage. Keep contributing consistently to reach your target of ${targetMonths} months (shortfall: ${formatCurrency(shortfall, targetCurrency)}).`;
  } else { // runwayMonthsFinite < 3
    recommendationText = `Building your buffer is important. Aim to save consistently towards a goal of 3-6 months coverage. Your current runway is ${runwayMonthsFinite.toFixed(1)} months. You need ${formatCurrency(shortfall, targetCurrency)} more to reach your ${targetMonths}-month target.`;
  }
  // --- End Recommendation Logic ---

  return (
    <div className="card bg-base-200 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Emergency Buffer Calculator</h2>
        <p className="text-sm mb-4">Plan your safety net for unexpected events.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Input Fields */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Target Months of Coverage</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 3, 6, 12"
              className="input input-bordered w-full"
              value={state.targetMonthsOfCoverage}
              onChange={handleTargetMonthsChange}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Current Reserve Amount ({targetCurrency || 'Target'})</span>
            </label>
            <input
              type="number"
              min="0"
              step="100"
              placeholder="Amount already saved"
              className="input input-bordered w-full"
              value={state.currentReserveAmount}
              onChange={handleCurrentReserveChange}
            />
          </div>
        </div>

        {/* Calculated Summary and Visualization */}
        <div className="space-y-4">
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
            <div className="stat">
              <div className="stat-title">Est. Fixed Monthly Costs</div>
              <div className="stat-value text-lg">{formatCurrency(calculatedMonthlyExpenses, targetCurrency)}</div>
              <div className="stat-desc">Based on your inputs</div>
            </div>

            <div className="stat">
              <div className="stat-title">Target Buffer Amount</div>
              <div className="stat-value text-lg">{formatCurrency(targetAmount, targetCurrency)}</div>
              <div className="stat-desc">({targetMonths} months coverage)</div>
            </div>

            <div className="stat">
              <div className="stat-title">Current Shortfall</div>
              <div className={`stat-value text-lg ${shortfall > 0 ? 'text-error' : 'text-success'}`}>
                {formatCurrency(shortfall, targetCurrency)}
              </div>
              <div className="stat-desc">{shortfall > 0 ? `Needed to reach target` : `Target met! 🎉`}</div>
            </div>
          </div>
          
          {/* Runway Visualization */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
                <span>Current Runway ({formatCurrency(currentReserve, targetCurrency)})</span>
                <span>Target ({formatCurrency(targetAmount, targetCurrency)})</span>
            </div>
            <progress 
                className={`progress ${progressColorClass} w-full`}
                value={progressPercent}
                max="100"
            ></progress>
            <div className="text-center text-lg font-semibold mt-2">
                {isFinite(runwayMonths) ? `${runwayMonths.toFixed(1)} Months Runway` : 'Buffer Target Met'}
            </div>
             <p className="text-xs text-center text-base-content/70 mt-1">
                {isFinite(runwayMonths) 
                    ? `Your current reserve covers approximately ${runwayMonths.toFixed(1)} months of your estimated fixed expenses.`
                    : (calculatedMonthlyExpenses > 0 ? `Your reserve meets or exceeds the target of ${targetMonths} months!` : 'Enter monthly expenses to calculate runway.')}
            </p>
          </div>
        </div>
        
        {/* Recommendation Display */}
        <div className="mt-4 p-3 bg-base-100 rounded-lg shadow-inner">
            <p className="text-sm italic text-base-content/80">
                {recommendationText}
            </p>
        </div>

      </div>
    </div>
  );
};

export default EmergencyBufferModule; 