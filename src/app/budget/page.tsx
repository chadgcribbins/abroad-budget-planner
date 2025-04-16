'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define Budget interface
interface Budget {
  _id?: string;
  destination: string;
  startDate: string;
  endDate: string;
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
  currency: string;
}

export default function BudgetPlannerPage() {
  const router = useRouter();
  const [existingBudget, setExistingBudget] = useState<Budget | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [budget, setBudget] = useState({
    accommodation: 500,
    food: 300,
    transportation: 100,
    activities: 200,
    miscellaneous: 100
  });

  const [currency, setCurrency] = useState('USD');
  const [showResults, setShowResults] = useState(false);

  // Fetch existing budget if any
  useEffect(() => {
    const fetchBudget = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/budget');
        
        if (response.ok) {
          const data = await response.json();
          if (data.budget) {
            setExistingBudget(data.budget);
            
            // Populate form with existing budget data
            setDestination(data.budget.destination);
            setStartDate(new Date(data.budget.startDate).toISOString().split('T')[0]);
            setEndDate(new Date(data.budget.endDate).toISOString().split('T')[0]);
            setBudget({
              accommodation: data.budget.accommodation,
              food: data.budget.food,
              transportation: data.budget.transportation,
              activities: data.budget.activities,
              miscellaneous: data.budget.miscellaneous
            });
            setCurrency(data.budget.currency);
            
            setShowResults(true);
          }
        }
      } catch (error) {
        console.error('Error fetching budget:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBudget();
  }, []);

  const handleInputChange = (category: keyof typeof budget, value: number) => {
    setBudget({ ...budget, [category]: value });
  };

  // Calculate trip duration
  const getDurationInDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Ensure we don't divide by zero
  };

  const totalBudget = Object.values(budget).reduce((sum, value) => sum + value, 0);
  const duration = getDurationInDays();
  const dailyBudget = totalBudget / duration;

  // Format currency display
  const formatCurrency = (amount: number) => {
    return currency === 'USD' 
      ? `$${amount.toFixed(2)}` 
      : currency === 'EUR' 
        ? `€${amount.toFixed(2)}` 
        : `£${amount.toFixed(2)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  // Save budget to API
  const saveBudget = async () => {
    setIsSaving(true);
    
    const budgetData: Budget = {
      destination,
      startDate,
      endDate,
      ...budget,
      currency
    };
    
    try {
      let url = '/api/budget';
      let method = 'POST';
      
      // If we're updating an existing budget
      if (existingBudget?._id) {
        method = 'PUT';
        budgetData._id = existingBudget._id;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update our state with the saved budget
      setExistingBudget(data.budget);
      alert(existingBudget ? 'Budget updated successfully!' : 'Budget created successfully!');
      
      // Navigate to expenses page
      router.push('/expenses');
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Failed to save budget. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading budget data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Budget Planner</h1>
      
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Thailand, Portugal, etc."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select 
                className="w-full p-2 border rounded" 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Budget Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Object.entries(budget).map(([category, value]) => (
              <div key={category}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{category}</label>
                <div className="flex">
                  <div className="bg-gray-100 px-3 flex items-center border border-r-0 rounded-l">
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'}
                  </div>
                  <input 
                    type="number" 
                    className="w-full p-2 border rounded-r" 
                    min="0" 
                    value={value}
                    onChange={(e) => handleInputChange(category as keyof typeof budget, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Total Budget</h3>
                <p className="text-sm text-gray-500">{duration} day trip</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBudget)}</p>
                <p className="text-sm text-gray-500">{formatCurrency(dailyBudget)} per day</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              {existingBudget ? 'Update Budget Plan' : 'Create Budget Plan'}
            </button>
          </div>
        </form>
      </div>
      
      {showResults && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6 sm:mt-8">
          <h2 className="text-xl font-semibold mb-4 sm:mb-6">Your Budget Plan</h2>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Average</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(budget).map(([category, value]) => {
                  const dailyAverage = value / duration;
                  const percentage = (value / totalBudget * 100).toFixed(1);
                  
                  return (
                    <tr key={category}>
                      <td className="px-6 py-4 whitespace-nowrap capitalize">{category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(value)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(dailyAverage)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{percentage}%</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">Total</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(totalBudget)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(dailyBudget)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mt-4 sm:mt-6 border border-blue-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Budget Tips</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Consider local cost of living differences. Your budget may go further in some destinations!</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button 
              className="btn btn-outline w-full sm:w-auto"
              onClick={() => setShowResults(false)}
            >
              Edit Budget
            </button>
            <button 
              className="btn btn-success w-full sm:w-auto flex justify-center items-center"
              onClick={saveBudget}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Saving...
                </>
              ) : existingBudget ? 'Update Budget' : 'Save Budget'}
            </button>
            <a 
              href="/expenses" 
              className="btn btn-secondary w-full sm:w-auto text-center"
            >
              Track Expenses
            </a>
          </div>
        </div>
      )}
    </div>
  );
} 