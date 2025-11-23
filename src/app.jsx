// src/app.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import BorrowedItems from './pages/BorrowedItems';
import ManageInventory from './pages/ManageInventory';
import ReservationRequests from './pages/ReservationRequests';
import RecentlyReturned from './pages/RecentlyReturned';
import ManageUsers from './pages/ManageUsers';

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/borrowed"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <BorrowedItems />
              </ProtectedRoute>
            }
          />

          {/* Officer routes */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/inventory"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ManageInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/reservations"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ReservationRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/returned"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <RecentlyReturned />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/users"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
