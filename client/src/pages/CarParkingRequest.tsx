import React from 'react';
import { useAuth } from '../context/AuthContext'; 

const CarParkingRequest: React.FC = () => {
  const { user } = useAuth(); 

  return (
    <div className="min-h-screen bg-dark-primary text-white flex flex-col items-center justify-center px-4">
      <div className="bg-dark-tertiary p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Car Parking Request</h1>
        
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            value={user?.name || ''}  
            readOnly 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        {/* ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input 
            type="text" 
            value={user?.idNumber || ''} 
            readOnly 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        {/* Car Model */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Car Model</label>
          <input 
            type="text" 
            placeholder="Enter your car model" 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        {/* License Plate Number */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">License Plate Number</label>
          <input 
            type="text" 
            placeholder="Enter your license plate number" 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded"
          onClick={() => alert('Car parking request submitted!')}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default CarParkingRequest;
