import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RfidRequest from './pages/RfidRequest';

// Import AuthProvider from your context file
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Define routes for your pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* New RFID Request route added */}
        <Route path="/rfid-request" element={<RfidRequest />} />
        
        {/* You can add more routes here later for specific modules */}
        {/* <Route path="/dashboard/grades" element={<GradesPage />} /> */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
