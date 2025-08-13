// /client/src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import GradeDisputePage from './pages/GradeDisputePage';
import RoutinePage from './pages/RoutinePage';
import AttendancePage from './pages/AttendancePage'; // Import the new AttendancePage
import CarParkingRequest from './pages/CarParkingRequest';
import CourseAddDrop from './pages/CourseAddDrop';
import RfidRequest from './pages/RfidRequest';
import SemesterDropRequest from './pages/SemesterDropRequest';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate replace to="/login" />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/disputes" element={<GradeDisputePage />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/attendance" element={<AttendancePage />} /> {/* Add the new attendance route */}
        <Route path="/car-parking-request" element={<CarParkingRequest />} />
        <Route path="/course-add-drop" element={<CourseAddDrop />} />
        <Route path="/rfid-request" element={<RfidRequest />} />
        <Route path="/semester-drop-request" element={<SemesterDropRequest />} />
        {/* Add more protected routes here later */}
      </Route>

    </Routes>
  );
}

export default App;