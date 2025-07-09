import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate replace to="/login" />} />
      
      {/* Define routes for your pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* You can add more routes here later for specific modules */}
      {/* <Route path="/dashboard/grades" element={<GradesPage />} /> */}
    </Routes>
  );
}

export default App;