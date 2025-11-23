// src/context/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to role-appropriate dashboard
    const target = role === 'officer' ? '/officer' : '/student';
    return <Navigate to={target} replace />;
  }

  return children;
}
