import React from 'react';
import { useAuth, postAuthPath } from 'features/auth';
import { RootRedirectTemplate } from './root-redirect.html';

export function RootRedirect() {
  const { isAuthenticated, user } = useAuth();
  const to = isAuthenticated ? postAuthPath(user) : '/login';

  return (
    <RootRedirectTemplate
      to = {
        to
      }
    />
  );
}
