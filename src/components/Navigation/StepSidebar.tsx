import React from 'react';

interface StepSidebarProps {
  stepLabels: string[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  // Optional: Add a way to know which steps are valid/completed if needed
  // completedSteps?: boolean[]; 
}

const StepSidebar: React.FC<StepSidebarProps> = ({ 
  stepLabels, 
  currentStep, 
  setCurrentStep 
}) => {
  const handleStepClick = (index: number) => {
    // Allow navigation only to steps already visited or the current one
    // Or potentially only allow backward navigation?
    // For now, allow clicking any past/present step.
    if (index <= currentStep) { 
        setCurrentStep(index);
    }
    // Optionally, add logic to prevent jumping ahead if step validation is considered.
  };

  return (
    <aside className="w-64 hidden md:block"> {/* Hide on small screens for now */}
      <ul className="menu p-4 w-full bg-base-200 rounded-box shadow-lg h-full">
        <li className="menu-title"><span className="text-lg font-semibold">Steps</span></li>
        {stepLabels.map((label, index) => (
          <li key={label}>
            <a 
              className={`${index === currentStep ? 'active' : ''} ${index > currentStep ? 'disabled text-gray-400 cursor-not-allowed' : ''}`}
              onClick={(e) => {
                e.preventDefault(); // Prevent default anchor behavior
                if (index <= currentStep) { // Only allow clicking past/current steps
                  handleStepClick(index);
                } 
              }}
              href="#" // Add href for semantics, but behavior controlled by onClick
            >
              {index + 1}. {label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default StepSidebar; 