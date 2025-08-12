import React from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth from context

const SemesterDropRequest: React.FC = () => {
  const { user } = useAuth(); // ✅ Access logged-in user from AuthProvider

  return (
    <div className="min-h-screen bg-dark-primary text-white flex flex-col items-center justify-center px-4">
      <div className="bg-dark-tertiary p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Semester Drop Request</h1>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            value={user?.name || ''}  // ✅ Dynamic name
            readOnly 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input 
            type="text" 
            value={user?.idNumber || ''}  // ✅ Dynamic ID
            readOnly 
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white cursor-not-allowed"
          />
        </div>

        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded"
          onClick={() => alert('Semester drop request submitted!')}
        >
          Submit Drop Request
        </button>
      </div>
    </div>
  );
};

export default SemesterDropRequest;
