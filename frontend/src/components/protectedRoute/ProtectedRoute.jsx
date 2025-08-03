// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Import your auth context

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation(); // To redirect back after login

  // 1. Check if authenticated
  if (!isAuthenticated) {
    // If not authenticated, redirect to login page
    // Pass current location in state so user can be redirected back after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check if user has one of the allowed roles
  // If allowedRoles is provided, check against it
  if (allowedRoles && allowedRoles.length > 0) {
    if (!userRole || !allowedRoles.includes(userRole)) {
      // If role not allowed, redirect to an unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If authenticated and authorized, render the child routes (Outlet)
  // Outlet renders the nested route element
  return <Outlet />;
};

export default ProtectedRoute;