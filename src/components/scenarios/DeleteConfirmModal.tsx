'use client';

import React from 'react';
import { useUIStore } from '@/src/store/slices/uiSlice';
import { useScenarioStore } from '@/src/store/slices/scenarioSlice';

export function DeleteConfirmModal() {
  const { 
    isDeleteConfirmModalOpen, 
    selectedScenarioId, 
    closeDeleteConfirmModal 
  } = useUIStore();
  const { deleteScenario, getScenario } = useScenarioStore();

  const scenario = selectedScenarioId ? getScenario(selectedScenarioId) : null;

  const handleDelete = () => {
    if (selectedScenarioId) {
      deleteScenario(selectedScenarioId);
      closeDeleteConfirmModal();
    }
  };

  if (!isDeleteConfirmModalOpen || !scenario) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Delete Scenario</h3>
        <p className="py-4">
          Are you sure you want to delete "<strong>{scenario.name}</strong>"? 
          This action cannot be undone.
        </p>
        <div className="modal-action">
          <button className="btn" onClick={closeDeleteConfirmModal}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}