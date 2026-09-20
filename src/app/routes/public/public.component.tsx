import React from 'react';
import { useAuth } from 'features/auth';
import { postAuthPath } from 'features/auth';
import { ProtectedTemplate } from '../protected/protected.html';
import type { Props } from './interfaces/props.interface';

export const PublicRoute: React.FC<Props> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const redirectTo = postAuthPath(user);

  return (
    <ProtectedTemplate
      isAuthenticated = {
        isAuthenticated
      }
      isLoading = {
        isLoading
      }
      redirectTo = {
        redirectTo
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
};
