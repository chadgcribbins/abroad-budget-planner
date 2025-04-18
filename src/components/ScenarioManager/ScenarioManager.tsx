'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    saveScenario as saveScenarioUtil, 
    loadScenarioByName, 
    deleteScenario, 
    listSavedScenarios, 
    ScenarioSnapshot 
} from '@/utils/scenarioManager'; // Assuming ProfileSettings type exists

// Define props if needed, e.g., functions to trigger snapshotting and loading
interface ScenarioManagerProps {
    onSaveScenario: (name: string) => void; // Function to call when save is requested
    onLoadScenario: (name: string) => void; // Function to call when load is requested
    onCloneScenario?: () => void; // Optional: Function to handle cloning the current state
}

const ScenarioManager: React.FC<ScenarioManagerProps> = ({ onSaveScenario, onLoadScenario, onCloneScenario }) => {
    const [scenarioName, setScenarioName] = useState<string>('');
    const [savedScenarios, setSavedScenarios] = useState<{ name: string; timestamp: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

    const refreshScenarioList = useCallback(() => {
        setSavedScenarios(listSavedScenarios());
    }, []);

    useEffect(() => {
        refreshScenarioList();
    }, [refreshScenarioList]);

    const handleSave = () => {
        if (!scenarioName.trim()) {
            setFeedbackMessage('Please enter a name for the scenario.');
            return;
        }
        setIsLoading(true);
        setFeedbackMessage(null);
        // Call the prop function which will handle getting state and saving
        onSaveScenario(scenarioName.trim()); 
        // Reset name and refresh list (optimistically, actual save handled by parent)
        setScenarioName('');
        setTimeout(() => { // Give time for potential save to complete
             refreshScenarioList();
             setFeedbackMessage(`Scenario '${scenarioName.trim()}' save requested.`); // Provide feedback
             setIsLoading(false);
        }, 500); 
    };

    const handleLoad = (name: string) => {
        setIsLoading(true);
        setFeedbackMessage(null);
        // Call the prop function to handle loading state into contexts
        onLoadScenario(name);
        setTimeout(() => { // Simulate loading time / allow state update
            setFeedbackMessage(`Scenario '${name}' load requested.`);
            setIsLoading(false);
       }, 500);
    };

    const handleDelete = (name: string) => {
        // Optional: Add confirmation dialog here
        if (confirm(`Are you sure you want to delete scenario "${name}"?`)) {
            setIsLoading(true);
            setFeedbackMessage(null);
            const success = deleteScenario(name);
            if (success) {
                refreshScenarioList();
                setFeedbackMessage(`Scenario '${name}' deleted.`);
            } else {
                setFeedbackMessage(`Failed to delete scenario '${name}'.`);
            }
            setIsLoading(false);
        }
    };

    const handleClone = () => {
        if (onCloneScenario) {
            setFeedbackMessage('Current scenario state ready to be saved with a new name.');
            onCloneScenario(); // Parent handles setting up state for save
        }
    };

    // --- Export Logic ---
    const handleExportAll = () => {
        setIsLoading(true);
        setFeedbackMessage('Exporting scenarios...');
        try {
            const scenarioNames = listSavedScenarios().map(s => s.name);
            const allScenarioData = scenarioNames.map(name => loadScenarioByName(name)).filter(s => s !== null) as ScenarioSnapshot[];

            if (allScenarioData.length === 0) {
                setFeedbackMessage('No scenarios to export.');
                setIsLoading(false);
                return;
            }

            const jsonString = JSON.stringify(allScenarioData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.download = `budget_scenarios_${timestamp}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setFeedbackMessage('All scenarios exported successfully.');
        } catch (error) {
            console.error('Error exporting scenarios:', error);
            setFeedbackMessage('Error exporting scenarios.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Import Logic ---
    const handleImportClick = () => {
        fileInputRef.current?.click(); // Trigger hidden file input
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setIsLoading(true);
        setFeedbackMessage('Importing scenarios...');
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error('Failed to read file content.');
                }
                const importedData = JSON.parse(text);
                
                // Basic validation (check if it's an array)
                if (!Array.isArray(importedData)) {
                     throw new Error('Invalid file format: Expected an array of scenarios.');
                }

                let importedCount = 0;
                let skippedCount = 0;

                importedData.forEach((scenario: any) => {
                    // Basic validation for scenario object
                    if (scenario && typeof scenario === 'object' && scenario.name && scenario.timestamp) {
                         // TODO: Add more robust validation of scenario structure if needed
                        const success = saveScenarioUtil(scenario); // Use renamed import
                        if (success) {
                            importedCount++;
                        } else {
                           skippedCount++; // Failed to save (e.g., invalid data, though saveScenarioUtil might not return false)
                        }
                    } else {
                        console.warn('Skipping invalid scenario object during import:', scenario);
                        skippedCount++;
                    }
                });
                
                refreshScenarioList();
                 setFeedbackMessage(`Import complete. Imported: ${importedCount}, Skipped/Failed: ${skippedCount}.`);
            } catch (error) {
                console.error('Error importing scenarios:', error);
                setFeedbackMessage(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            } finally {
                setIsLoading(false);
                // Reset file input value to allow importing the same file again
                if (fileInputRef.current) {
                     fileInputRef.current.value = '';
                }
            }
        };

        reader.onerror = () => {
            setFeedbackMessage('Error reading file.');
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="card bg-base-200 shadow-xl my-6">
            <div className="card-body">
                <h2 className="card-title">Scenario Management (Local Storage)</h2>
                
                {/* Save Section */}                 
                <div className="form-control flex-row gap-2 items-end">
                     <div className="flex-grow">
                        <label className="label pt-0">
                            <span className="label-text">Save Current as:</span>
                        </label>
                        <input 
                            type="text" 
                            placeholder="Scenario Name" 
                            className="input input-bordered input-sm w-full" 
                            value={scenarioName}
                            onChange={(e) => setScenarioName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                     <button 
                        className={`btn btn-sm btn-primary ${isLoading ? 'btn-disabled' : ''}`}
                        onClick={handleSave}
                        disabled={isLoading || !scenarioName.trim()}
                    >
                        {isLoading ? <span className="loading loading-spinner loading-xs"></span> : 'Save'}
                    </button>
                   {onCloneScenario && (
                       <button 
                            className={`btn btn-sm btn-secondary ${isLoading ? 'btn-disabled' : ''}`}
                            onClick={handleClone}
                            disabled={isLoading}
                            title="Prepare current state for saving with a new name"
                        >
                            Clone
                        </button>
                   )}
                </div>

                 {/* Load/Delete Section */}                 
                 <div className="mt-4">
                     <h3 className="text-md font-semibold mb-2">Saved Scenarios:</h3>
                     {savedScenarios.length > 0 ? (
                         <ul className="menu menu-sm bg-base-100 rounded-box max-h-60 overflow-y-auto">
                             {savedScenarios.map((scenario) => (
                                 <li key={scenario.name} className="flex flex-row items-center justify-between p-1 group">
                                     <div className="flex-grow">
                                         <span className="font-medium">{scenario.name}</span>
                                         <span className="text-xs text-base-content/60 ml-2">
                                             ({new Date(scenario.timestamp).toLocaleString()})
                                         </span>
                                     </div>
                                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button 
                                            className={`btn btn-xs btn-success ${isLoading ? 'btn-disabled' : ''}`}
                                            onClick={() => handleLoad(scenario.name)}
                                            disabled={isLoading}
                                            title={`Load scenario: ${scenario.name}`}
                                        >
                                            Load
                                        </button>
                                         <button 
                                            className={`btn btn-xs btn-error ${isLoading ? 'btn-disabled' : ''}`}
                                            onClick={() => handleDelete(scenario.name)}
                                            disabled={isLoading}
                                            title={`Delete scenario: ${scenario.name}`}
                                        >
                                            Del
                                        </button>
                                     </div>
                                 </li>
                             ))}
                         </ul>
                     ) : (
                         <p className="text-sm italic text-base-content/70">No scenarios saved yet.</p>
                     )}
                 </div>

                 {/* Import/Export Section */}                  
                 <div className="mt-4 pt-4 border-t border-base-300 flex justify-end gap-2">
                     <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden" // Hide the default file input
                        disabled={isLoading}
                    />
                     <button 
                        className={`btn btn-sm btn-outline ${isLoading ? 'btn-disabled' : ''}`}
                        onClick={handleImportClick}
                        disabled={isLoading}
                        title="Import scenarios from a JSON file"
                    >
                         Import
                    </button>
                    <button 
                        className={`btn btn-sm btn-outline ${isLoading ? 'btn-disabled' : ''}`}
                        onClick={handleExportAll}
                        disabled={isLoading || savedScenarios.length === 0}
                        title="Export all saved scenarios to a JSON file"
                    >
                         Export All
                    </button>
                 </div>

                 {/* Feedback Message */}                 
                 {feedbackMessage && (
                     <div className="alert alert-info shadow-lg mt-4 p-2 text-sm">
                         <div>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                             <span>{feedbackMessage}</span>
                         </div>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default ScenarioManager; 