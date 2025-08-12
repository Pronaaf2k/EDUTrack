import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Importing router elements
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookSearch from './components/BookSearch'; // Import BookSearch component

function App() {
  return (
    <div>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Define routes for your pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* You can add more routes here later for specific modules */}
        <Route path="/dashboard/book-search" element={<BookSearch />} /> {/* Add route for BookSearch */}
      </Routes>
    </div>
  );
}

export default App;
