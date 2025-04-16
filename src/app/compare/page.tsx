'use client';

import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Cost of living data for different destinations
const destinationData = {
  thailand: {
    name: 'Thailand',
    monthlyCosts: {
      accommodation: 500,
      food: 300,
      transportation: 50,
      activities: 150,
      miscellaneous: 100
    },
    totalMonthly: 1100,
    currency: 'USD',
    internet: '50 Mbps',
    climate: 'Tropical',
  },
  portugal: {
    name: 'Portugal',
    monthlyCosts: {
      accommodation: 700,
      food: 400,
      transportation: 60,
      activities: 200,
      miscellaneous: 150
    },
    totalMonthly: 1510,
    currency: 'USD',
    internet: '100 Mbps',
    climate: 'Mediterranean',
  },
  mexico: {
    name: 'Mexico',
    monthlyCosts: {
      accommodation: 450,
      food: 350,
      transportation: 40,
      activities: 150,
      miscellaneous: 100
    },
    totalMonthly: 1090,
    currency: 'USD',
    internet: '30 Mbps',
    climate: 'Varies by region',
  },
  spain: {
    name: 'Spain',
    monthlyCosts: {
      accommodation: 800,
      food: 450,
      transportation: 70,
      activities: 250,
      miscellaneous: 180
    },
    totalMonthly: 1750,
    currency: 'USD',
    internet: '100 Mbps',
    climate: 'Mediterranean',
  },
  vietnam: {
    name: 'Vietnam',
    monthlyCosts: {
      accommodation: 400,
      food: 250,
      transportation: 30,
      activities: 100,
      miscellaneous: 80
    },
    totalMonthly: 860,
    currency: 'USD',
    internet: '25 Mbps',
    climate: 'Tropical',
  },
  colombia: {
    name: 'Colombia',
    monthlyCosts: {
      accommodation: 450,
      food: 300,
      transportation: 40,
      activities: 120,
      miscellaneous: 90
    },
    totalMonthly: 1000,
    currency: 'USD',
    internet: '20 Mbps',
    climate: 'Tropical',
  }
};

export default function ComparePage() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleDestinationToggle = (destinationId: string) => {
    if (selectedDestinations.includes(destinationId)) {
      setSelectedDestinations(selectedDestinations.filter(id => id !== destinationId));
    } else {
      // Limit to 3 destinations for better visualization
      if (selectedDestinations.length < 3) {
        setSelectedDestinations([...selectedDestinations, destinationId]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedDestinations.length >= 2) {
      setShowComparison(true);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: ['Accommodation', 'Food', 'Transportation', 'Activities', 'Miscellaneous'],
    datasets: selectedDestinations.map((destId, index) => {
      const destination = destinationData[destId as keyof typeof destinationData];
      const costs = destination.monthlyCosts;
      
      // Colors for the bars
      const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
      ];
      
      return {
        label: destination.name,
        data: [
          costs.accommodation,
          costs.food,
          costs.transportation,
          costs.activities,
          costs.miscellaneous
        ],
        backgroundColor: colors[index],
        borderColor: colors[index].replace('0.7', '1'),
        borderWidth: 1,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Cost Comparison by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'USD',
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 sm:mb-8">Compare Destinations</h1>
      
      <div className="card bg-base-100 shadow-xl mb-6 sm:mb-8">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title mb-4">Select destinations to compare (max 3)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            {Object.entries(destinationData).map(([id, data]) => (
              <div key={id} className="form-control">
                <label className="cursor-pointer label justify-start gap-4">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary" 
                    checked={selectedDestinations.includes(id)}
                    onChange={() => handleDestinationToggle(id)}
                  />
                  <span className="label-text text-lg">{data.name}</span>
                </label>
              </div>
            ))}
          </div>
          
          <div className="card-actions justify-center mt-4">
            <button 
              className="btn btn-primary"
              disabled={selectedDestinations.length < 2}
              onClick={handleCompare}
            >
              Compare Selected Destinations
            </button>
          </div>
        </div>
      </div>
      
      {showComparison && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl mb-4 sm:mb-6">Cost Comparison</h2>
            
            <div className="h-64 sm:h-80 md:h-96 w-full mb-6 sm:mb-8">
              <Bar data={chartData} options={chartOptions} />
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="table w-full text-sm sm:text-base">
                <thead>
                  <tr>
                    <th>Category</th>
                    {selectedDestinations.map(destId => (
                      <th key={destId}>
                        {destinationData[destId as keyof typeof destinationData].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['accommodation', 'food', 'transportation', 'activities', 'miscellaneous'].map(category => (
                    <tr key={category}>
                      <td className="capitalize">{category}</td>
                      {selectedDestinations.map(destId => (
                        <td key={`${destId}-${category}`}>
                          ${destinationData[destId as keyof typeof destinationData].monthlyCosts[category as keyof typeof destinationData[keyof typeof destinationData]['monthlyCosts']]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="font-bold">
                    <td>Total Monthly</td>
                    {selectedDestinations.map(destId => (
                      <td key={`${destId}-total`}>
                        ${destinationData[destId as keyof typeof destinationData].totalMonthly}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-lg sm:text-xl font-bold mt-6 sm:mt-8 mb-3 sm:mb-4">Other Factors</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="table w-full text-sm sm:text-base">
                <thead>
                  <tr>
                    <th>Factor</th>
                    {selectedDestinations.map(destId => (
                      <th key={destId}>
                        {destinationData[destId as keyof typeof destinationData].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Climate</td>
                    {selectedDestinations.map(destId => (
                      <td key={`${destId}-climate`}>
                        {destinationData[destId as keyof typeof destinationData].climate}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td>Internet Speed</td>
                    {selectedDestinations.map(destId => (
                      <td key={`${destId}-internet`}>
                        {destinationData[destId as keyof typeof destinationData].internet}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="alert alert-info mt-4 sm:mt-6 text-sm sm:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <h3 className="font-bold">Comparison Note</h3>
                <div className="text-sm">
                  These figures represent average costs and may vary based on lifestyle and specific locations within each country.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 