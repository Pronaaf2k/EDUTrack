import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Importing router elements
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BookSearch from './components/BookSearch'; // Import BookSearch component
import ReserveBook from './components/ReserveBook'; // Import ReserveBook component

const App = () => {
  return (
    <div>
      <Routes>
        {/* Default route redirects to login if no authentication or path is entered */}
        <Route path="/" element={<Navigate replace to="/login" />} />
        
        {/* Define routes for your pages */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard route */}
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Book Search route */}
        <Route path="/dashboard/book-search" element={<BookSearch />} />
        
        {/* Add route for ReserveBook with dynamic parameters */}
        <Route
          path="/dashboard/reserve-book/:bookId/:userId" // Defining dynamic parameters
          element={<ReserveBook />} // Pass dynamic params to ReserveBook
        />
        
        {/* Optionally, add a redirect or fallback if an unknown route is accessed */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
