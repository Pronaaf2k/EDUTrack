import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SemesterDropRequest: React.FC = () => {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [idNumber, setIdNumber] = useState(user?.idNumber || '');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    alert(`Semester drop request submitted!\nName: ${name}\nID: ${idNumber}\nReason: ${reason}`);
  };

  return (
    <div className="min-h-screen bg-dark-primary text-white flex flex-col items-center justify-center px-4">
      <div className="bg-dark-tertiary p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Semester Drop Request</h1>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        {/* ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ID</label>
          <input
            type="text"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white"
          />
        </div>

        {/* Reason */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Reason for Semester Drop</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Write your reason here..."
            rows={4}
            className="w-full bg-dark-primary border border-dark-secondary rounded px-3 py-2 text-white resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          className="w-full bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold py-2 rounded"
          onClick={handleSubmit}
          disabled={!name.trim() || !idNumber.trim() || !reason.trim()}
        >
          Submit Drop Request
        </button>
      </div>
    </div>
  );
};

export default SemesterDropRequest;