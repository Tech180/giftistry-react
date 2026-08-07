import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { postAuthPath } from 'features/auth';
import { ProtectedRouteTemplate } from './protected-route.html';

export const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowOnboarding?: boolean;
  allowPasswordChange?: boolean;
}> = ({
  children,
  allowOnboarding = false,
  allowPasswordChange = false,
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

  if (allowPasswordChange) {
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
    if (!user?.ForcePasswordChange) {
      return (
        <ProtectedRouteTemplate
          isAuthenticated
          isLoading={false}
          redirectTo={postAuthPath(user)}
          allowAuthenticated
        >
          {children}
        </ProtectedRouteTemplate>
      );
    }
    return <>{children}</>;
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
    if (user?.ForcePasswordChange) {
      return (
        <ProtectedRouteTemplate
          isAuthenticated
          isLoading={false}
          redirectTo="/change-password"
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

  if (isAuthenticated && user?.ForcePasswordChange) {
    return (
      <ProtectedRouteTemplate
        isAuthenticated
        isLoading={false}
        redirectTo="/change-password"
        allowAuthenticated={false}
      >
        {children}
      </ProtectedRouteTemplate>
    );
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
  const redirectTo = postAuthPath(user);

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
