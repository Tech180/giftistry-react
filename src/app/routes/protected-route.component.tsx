import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { ProtectedRouteTemplate } from './protected-route.html';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; allowOnboarding?: boolean }> = ({
  children,
  allowOnboarding = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
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
  }

  if (allowOnboarding) {
    if (!isAuthenticated) {
      return (
        <ProtectedRouteTemplate
          isAuthenticated={false}
          isLoading={false}
          redirectTo="/login"
          allowAuthenticated={false}
        >
          {children}
        </ProtectedRouteTemplate>
      );
    }
    if (user?.IsOnboarded) {
      return (
        <ProtectedRouteTemplate
          isAuthenticated
          isLoading={false}
          redirectTo="/dashboard"
          allowAuthenticated
        >
          {children}
        </ProtectedRouteTemplate>
      );
    }
    return <>{children}</>;
  }

  if (isAuthenticated && user && user.IsOnboarded === false) {
    return (
      <ProtectedRouteTemplate
        isAuthenticated
        isLoading={false}
        redirectTo="/welcome"
        allowAuthenticated={false}
      >
        {children}
      </ProtectedRouteTemplate>
    );
  }

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
  const { isAuthenticated, isLoading, user } = useAuth();
  const redirectTo = user?.IsOnboarded === false ? '/welcome' : '/dashboard';

  return (
    <ProtectedRouteTemplate
      isAuthenticated={isAuthenticated}
      isLoading={isLoading}
      redirectTo={redirectTo}
      allowAuthenticated
    >
      {children}
    </ProtectedRouteTemplate>
  );
};
