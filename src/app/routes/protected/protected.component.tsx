import React from 'react';
import { useAuth } from 'features/auth';
import { postAuthPath } from 'features/auth';
import type { Props } from './interfaces/props.interface';
import { ProtectedTemplate } from './protected.html';

export const ProtectedRoute: React.FC<Props> = ({
  children,
  allowOnboarding = false,
  allowPasswordChange = false,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <ProtectedTemplate
        isAuthenticated = {
          isAuthenticated
        }
        isLoading = {
          isLoading
        }
        redirectTo = {
          '/login'
        }
        allowAuthenticated = {
          false
        }
      >
        {
          children
        }
      </ProtectedTemplate>
    );
  }

  if (allowPasswordChange) {
    if (!isAuthenticated) {
      return (
        <ProtectedTemplate
          isAuthenticated = {
            false
          }
          isLoading = {
            false
          }
          redirectTo = {
            '/login'
          }
          allowAuthenticated = {
            false
          }
        >
          {
            children
          }
        </ProtectedTemplate>
      );
    }

    if (!user?.ForcePasswordChange) {
      return (
        <ProtectedTemplate
          isAuthenticated = {
            true
          }
          isLoading = {
            false
          }
          redirectTo = {
            postAuthPath(user)
          }
          allowAuthenticated = {
            true
          }
        >
          {
            children
          }
        </ProtectedTemplate>
      );
    }

    return <>{children}</>;
  }

  if (allowOnboarding) {
    if (!isAuthenticated) {
      return (
        <ProtectedTemplate
          isAuthenticated = {
            false
          }
          isLoading = {
            false
          }
          redirectTo = {
            '/login'
          }
          allowAuthenticated = {
            false
          }
        >
          {
            children
          }
        </ProtectedTemplate>
      );
    }

    if (user?.ForcePasswordChange) {
      return (
        <ProtectedTemplate
          isAuthenticated = {
            true
          }
          isLoading = {
            false
          }
          redirectTo = {
            '/change-password'
          }
          allowAuthenticated = {
            false
          }
        >
          {
            children
          }
        </ProtectedTemplate>
      );
    }

    if (user?.IsOnboarded) {
      return (
        <ProtectedTemplate
          isAuthenticated = {
            true
          }
          isLoading = {
            false
          }
          redirectTo = {
            '/dashboard'
          }
          allowAuthenticated = {
            true
          }
        >
          {
            children
          }
        </ProtectedTemplate>
      );
    }

    return <>{children}</>;
  }

  if (isAuthenticated && user?.ForcePasswordChange) {
    return (
      <ProtectedTemplate
        isAuthenticated = {
          true
        }
        isLoading = {
          false
        }
        redirectTo = {
          '/change-password'
        }
        allowAuthenticated = {
          false
        }
      >
        {
          children
        }
      </ProtectedTemplate>
    );
  }

  if (isAuthenticated && user && user.IsOnboarded === false) {
    return (
      <ProtectedTemplate
        isAuthenticated = {
          true
        }
        isLoading = {
          false
        }
        redirectTo = {
          '/welcome'
        }
        allowAuthenticated = {
          false
        }
      >
        {
          children
        }
      </ProtectedTemplate>
    );
  }

  return (
    <ProtectedTemplate
      isAuthenticated = {
        isAuthenticated
      }
      isLoading = {
        isLoading
      }
      redirectTo = {
        '/login'
      }
      allowAuthenticated = {
        false
      }
    >
      {
        children
      }
    </ProtectedTemplate>
  );
};
