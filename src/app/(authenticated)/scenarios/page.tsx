'use client';

import React, { useState, useMemo } from 'react';
import { useScenarioStore } from '@/src/store/slices/scenarioSlice';
import { useUIStore } from '@/src/store/slices/uiSlice';
import { ScenarioCard } from '@/src/components/scenarios/ScenarioCard';
import { CreateScenarioModal } from '@/src/components/scenarios/CreateScenarioModal';
import { DeleteConfirmModal } from '@/src/components/scenarios/DeleteConfirmModal';
import { Scenario } from '@/src/types/scenario';

export default function ScenariosPage() {
  const { scenarios, duplicateScenario } = useScenarioStore();
  const { 
    openCreateScenarioModal, 
    openDeleteConfirmModal,
    scenarioViewMode,
    setScenarioViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
  } = useUIStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const scenarioList = Object.values(scenarios);

  // Sort and filter scenarios
  const filteredAndSortedScenarios = useMemo(() => {
    let filtered = scenarioList.filter(scenario => 
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case 'completion':
          comparison = a.completionStatus.overall - b.completionStatus.overall;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [scenarioList, searchTerm, sortBy, sortOrder]);

  const handleEdit = (id: string) => {
    const scenario = scenarios[id];
    if (scenario) {
      setRenameId(id);
      setNewName(scenario.name);
    }
  };

  const handleRename = () => {
    if (renameId && newName.trim()) {
      useScenarioStore.getState().updateScenario(renameId, { name: newName.trim() });
      setRenameId(null);
      setNewName('');
    }
  };

  const handleDuplicate = (id: string) => {
    const scenario = scenarios[id];
    if (scenario) {
      const duplicateName = `${scenario.name} (Copy)`;
      duplicateScenario(id, duplicateName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Scenarios</h1>
        <button 
          className="btn btn-primary"
          onClick={openCreateScenarioModal}
        >
          Create New Scenario
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="form-control flex-1 max-w-md">
          <input 
            type="text" 
            placeholder="Search scenarios..." 
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="btn-group">
          <button 
            className={`btn ${scenarioViewMode === 'grid' ? 'btn-active' : ''}`}
            onClick={() => setScenarioViewMode('grid')}
          >
            Grid
          </button>
          <button 
            className={`btn ${scenarioViewMode === 'list' ? 'btn-active' : ''}`}
            onClick={() => setScenarioViewMode('list')}
          >
            List
          </button>
        </div>

        {/* Sort Options */}
        <select 
          className="select select-bordered"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="completion">Sort by Completion</option>
        </select>

        <button 
          className="btn btn-ghost btn-square"
          onClick={toggleSortOrder}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Scenarios Grid/List */}
      {filteredAndSortedScenarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-base-content/70 mb-4">
            {searchTerm 
              ? 'No scenarios match your search.' 
              : 'No scenarios yet. Create your first one!'}
          </p>
          {!searchTerm && (
            <button 
              className="btn btn-primary"
              onClick={openCreateScenarioModal}
            >
              Create First Scenario
            </button>
          )}
        </div>
      ) : (
        <div className={
          scenarioViewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredAndSortedScenarios.map(scenario => (
            <div key={scenario.id}>
              {renameId === scenario.id ? (
                // Inline rename form
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <input 
                      type="text"
                      className="input input-bordered w-full"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') handleRename();
                      }}
                      autoFocus
                    />
                    <div className="card-actions justify-end mt-2">
                      <button 
                        className="btn btn-ghost btn-sm"
                        onClick={() => setRenameId(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={handleRename}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <ScenarioCard
                  scenario={scenario}
                  onEdit={handleEdit}
                  onDelete={openDeleteConfirmModal}
                  onDuplicate={handleDuplicate}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateScenarioModal />
      <DeleteConfirmModal />
    </div>
  );
}