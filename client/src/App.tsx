// /client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Add more protected routes here later */}
        {/* <Route path="/dashboard/grades" element={<GradesPage />} /> */}
      </Route>

    </Routes>
  );
}

export default App;