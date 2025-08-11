// /client/src/components/common/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: show a loading spinner while checking auth state
    return <div>Loading...</div>;
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;