import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NonAdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;
  if (user?.role === 'ADMIN') return <Navigate to="/admin-dashboard" replace />;

  return <>{children}</>;
}