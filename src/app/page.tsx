'use client';

import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Abroad Budget Planner</h1>
      <p className="text-lg mb-8">Plan your budget for living abroad with ease.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Budget Planning</h2>
            <p>Create detailed budgets for your time abroad with customizable categories.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/budget" className="btn btn-primary">Create Budget</a>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Expense Tracking</h2>
            <p>Record and monitor your daily expenses to stay within your budget.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/expenses" className="btn btn-outline">Track Expenses</a>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Cost Comparison</h2>
            <p>Compare living costs between different destinations around the world.</p>
            <div className="card-actions justify-end mt-4">
              <a href="/compare" className="btn btn-outline">Compare Costs</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-base-200 rounded-lg">
        <div>
          <h2 className="text-2xl font-bold mb-2">Ready to plan your adventure?</h2>
          <p className="max-w-md">Start by creating a budget tailored to your destination and travel style.</p>
        </div>
        <a href="/destinations" className="btn btn-primary">Browse Destinations</a>
      </div>
    </div>
  );
} 