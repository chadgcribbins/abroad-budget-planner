import React from 'react';

// Define the props for the Utilities component
type UtilitiesProps = {
  electricity: number | '';
  water: number | '';
  gasHeating: number | '';
  internet: number | '';
  mobile: number | '';
  onUtilitiesChange: (key: keyof Omit<UtilitiesProps, 'onUtilitiesChange'>, value: string) => void;
};

const Utilities: React.FC<UtilitiesProps> = ({ 
  electricity,
  water,
  gasHeating,
  internet,
  mobile,
  onUtilitiesChange 
}) => {

  // Calculate total monthly utility cost
  const calculateTotal = (): number => {
    const values = [electricity, water, gasHeating, internet, mobile];
    return values.reduce((sum: number, value) => sum + (Number(value) || 0), 0);
  };

  const totalUtilities = calculateTotal();

  const handleInputChange = (key: keyof Omit<UtilitiesProps, 'onUtilitiesChange'>, value: string) => {
    // Basic validation: Allow only numbers (including decimals) and empty string
    if (/^\d*\.?\d*$/.test(value)) {
      onUtilitiesChange(key, value);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">Utilities</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Electricity Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Electricity (€/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 80"
              className="input input-bordered" 
              value={electricity}
              onChange={(e) => handleInputChange('electricity', e.target.value)} 
            />
          </div>

          {/* Water Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Water (€/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 40"
              className="input input-bordered" 
              value={water}
              onChange={(e) => handleInputChange('water', e.target.value)} 
            />
          </div>

          {/* Gas/Heating Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Gas/Heating (€/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 100" 
              className="input input-bordered" 
              value={gasHeating}
              onChange={(e) => handleInputChange('gasHeating', e.target.value)} 
            />
          </div>

          {/* Internet Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Internet (€/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 50"
              className="input input-bordered" 
              value={internet}
              onChange={(e) => handleInputChange('internet', e.target.value)} 
            />
          </div>

          {/* Mobile Input */}
          <div className="form-control">
            <label className="label"><span className="label-text">Mobile (€/month)</span></label>
            <input 
              type="number" 
              min="0" 
              step="0.01"
              placeholder="e.g., 30"
              className="input input-bordered" 
              value={mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)} 
            />
          </div>
        </div>

        {/* Total Display */}
        <div className="mt-4 p-2 bg-base-200 rounded">
          <p className="text-sm font-semibold">Total Monthly Utilities:</p>
          <p className="text-lg">€ {totalUtilities.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Utilities; 