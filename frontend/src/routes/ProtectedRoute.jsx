import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import Loader from '../components/common/Loader.jsx';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen message="Authenticating session credentials..." />;
  }

  if (!token || !user) {
    return <Navigate to={allowedRole === 'tpo' ? '/login/tpo' : '/login/student'} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'tpo' ? '/tpo/dashboard' : '/student/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
