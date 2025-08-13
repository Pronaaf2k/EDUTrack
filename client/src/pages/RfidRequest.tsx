import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth from context

const RfidRequest: React.FC = () => {
  const { user } = useAuth(); // ✅ Access logged-in user from AuthProvider

  // ✅ Local state so the user can edit values
  const [name, setName] = useState(user?.name || '');
  const [idNumber, setIdNumber] = useState(user?.idNumber || '');

const handleSubmit = () => {
  alert(`RFID request submitted!\nName: ${name}\nID: ${idNumber}`);
};
 

  return (
    <div className="min-h-screen bg-dark-primary text-white flex flex-col items-center justify-center px-4">
      <div className="bg-dark-tertiary p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">RFID Request</h1>
        
        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        {/* ID Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input 
            type="text" 
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        <button
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-2 rounded"
          onClick={handleSubmit}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default RfidRequest;

