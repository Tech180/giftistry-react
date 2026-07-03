import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { ProtectedRouteTemplate } from './protected-route.html';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <ProtectedRouteTemplate
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/login"
      allowAuthenticated={false}
    >
      {children}
    </ProtectedRouteTemplate>
  );
};

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <ProtectedRouteTemplate
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo="/dashboard"
      allowAuthenticated
    >
      {children}
    </ProtectedRouteTemplate>
  );
};
