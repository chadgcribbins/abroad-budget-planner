'use client';

import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

// Define expense type
type Expense = {
  _id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
};

// Define budget type
type Budget = {
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
  createdAt?: string;
  updatedAt?: string;
};

// Fallback dummy data in case API is not available
const dummyBudget: Budget = {
  destination: 'Paris',
  startDate: '2023-04-01',
  endDate: '2023-04-30',
  accommodation: 700,
  food: 400,
  transportation: 60,
  activities: 200,
  miscellaneous: 150,
  currency: 'USD'
};

// API functions
const fetchExpenses = async (
  category: string = 'all', 
  startDate: string = '', 
  endDate: string = ''
): Promise<Expense[]> => {
  try {
    let url = '/api/expenses';
    const params = new URLSearchParams();
    
    if (category !== 'all') {
      params.append('category', category);
    }
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.expenses || [];
  } catch (error) {
    console.error('Error fetching expenses:', error);
    // Return empty array if API fails
    return [];
  }
};

// Function to fetch budget
const fetchBudget = async (): Promise<Budget | null> => {
  try {
    const response = await fetch('/api/budget');
    
    if (!response.ok) {
      if (response.status === 404) {
        // No budget found is a normal case
        return null;
      }
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.budget || null;
  } catch (error) {
    console.error('Error fetching budget:', error);
    // Return null if API fails
    return null;
  }
};

// Function to add a new expense
const addExpense = async (expense: Omit<Expense, '_id'>): Promise<Expense | null> => {
  try {
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expense),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.expense || null;
  } catch (error) {
    console.error('Error adding expense:', error);
    return null;
  }
};

// Function to delete an expense
const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting expense:', error);
    return false;
  }
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [newExpense, setNewExpense] = useState<Omit<Expense, '_id'>>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    category: 'food',
    description: '',
    currency: 'USD'
  });
  const [filter, setFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);
  const [isDeletingExpense, setIsDeletingExpense] = useState<{[key: string]: boolean}>({});

  // Fetch expenses and budget when filters change
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Fetch budget
      const fetchedBudget = await fetchBudget();
      if (fetchedBudget) {
        setBudget(fetchedBudget);
      } else {
        setBudget(dummyBudget); // Fallback to dummy data
      }
      
      // Fetch expenses
      const fetchedExpenses = await fetchExpenses(filter, dateRange.start, dateRange.end);
      setExpenses(fetchedExpenses);
      
      setIsLoading(false);
    };
    
    loadData();
  }, [filter, dateRange]);

  // Calculate total expenses by category
  const calculateTotalsByCategory = () => {
    const totals: {[key: string]: number} = {
      accommodation: 0,
      food: 0,
      transportation: 0,
      activities: 0,
      miscellaneous: 0
    };
    
    const filteredExpenses = expenses.filter(expense => 
      filter === 'all' || expense.category === filter
    );
    
    filteredExpenses.forEach(expense => {
      if (totals[expense.category] !== undefined) {
        totals[expense.category] += expense.amount;
      }
    });
    
    return totals;
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return currency === 'USD' 
      ? `$${amount.toFixed(2)}` 
      : currency === 'EUR' 
        ? `€${amount.toFixed(2)}` 
        : `${amount.toFixed(2)} ${currency}`;
  };

  // Handle adding a new expense
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newExpense.description || newExpense.amount <= 0) {
      alert('Please enter a description and a valid amount');
      return;
    }
    
    setIsAddingExpense(true);
    
    const result = await addExpense(newExpense);
    
    if (result) {
      // Add the new expense to the list
      setExpenses(prev => [result, ...prev]);
      
      // Reset the form
      setNewExpense({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        category: 'food',
        description: '',
        currency: 'USD'
      });
    } else {
      alert('Failed to add expense. Please try again.');
    }
    
    setIsAddingExpense(false);
  };

  // Handle deleting an expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) {
      return;
    }
    
    setIsDeletingExpense(prev => ({ ...prev, [id]: true }));
    
    const success = await deleteExpense(id);
    
    if (success) {
      // Remove the expense from the list
      setExpenses(prev => prev.filter(expense => expense._id !== id));
    } else {
      alert('Failed to delete expense. Please try again.');
    }
    
    setIsDeletingExpense(prev => ({ ...prev, [id]: false }));
  };

  // Prepare data for the doughnut chart
  const doughnutData = {
    labels: ['Accommodation', 'Food', 'Transportation', 'Activities', 'Miscellaneous'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: [
          calculateTotalsByCategory().accommodation,
          calculateTotalsByCategory().food,
          calculateTotalsByCategory().transportation,
          calculateTotalsByCategory().activities,
          calculateTotalsByCategory().miscellaneous,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the bar chart (budget vs. actual)
  const barData = {
    labels: ['Accommodation', 'Food', 'Transportation', 'Activities', 'Miscellaneous'],
    datasets: [
      {
        label: 'Budget',
        data: budget ? [
          budget.accommodation,
          budget.food,
          budget.transportation,
          budget.activities,
          budget.miscellaneous,
        ] : [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual',
        data: [
          calculateTotalsByCategory().accommodation,
          calculateTotalsByCategory().food,
          calculateTotalsByCategory().transportation,
          calculateTotalsByCategory().activities,
          calculateTotalsByCategory().miscellaneous,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate total budget and total expenses
  const totalBudget = budget ? 
    budget.accommodation + budget.food + budget.transportation + budget.activities + budget.miscellaneous : 0;
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Expense Tracker</h1>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading expenses...</p>
        </div>
      )}
      
      {!isLoading && (
        <>
          {/* Add Expense Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={newExpense.currency}
                  onChange={(e) => setNewExpense({...newExpense, currency: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="activities">Activities</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="flex items-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition w-full flex justify-center items-center"
                  disabled={isAddingExpense}
                >
                  {isAddingExpense ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
                      Adding...
                    </>
                  ) : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
          
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Categories</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="activities">Activities</option>
                  <option value="miscellaneous">Miscellaneous</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Budget vs. Actual</h3>
                <div className="h-80">
                  <Bar 
                    data={barData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: budget?.currency || 'USD'
                          }
                        }
                      },
                      plugins: {
                        title: {
                          display: true,
                          text: 'Budget vs. Actual Expenses'
                        }
                      }
                    }} 
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-3">Expense Distribution</h3>
                <div className="h-80">
                  <Doughnut 
                    data={doughnutData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: 'Expense Distribution by Category'
                        }
                      }
                    }} 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Total Budget</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalBudget, budget?.currency || 'USD')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Total Expenses</h3>
                <p className={`text-2xl font-bold ${totalExpenses > totalBudget ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(totalExpenses, budget?.currency || 'USD')}
                </p>
              </div>
            </div>
          </div>
          
          {/* Expenses Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Expenses</h2>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No expenses found for the selected filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">{expense.description}</td>
                        <td className="px-6 py-4 capitalize">{expense.category}</td>
                        <td className="px-6 py-4">{formatCurrency(expense.amount, expense.currency)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            disabled={isDeletingExpense[expense._id]}
                          >
                            {isDeletingExpense[expense._id] ? (
                              <>
                                <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-600 rounded-full mr-1"></span>
                                Deleting...
                              </>
                            ) : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 