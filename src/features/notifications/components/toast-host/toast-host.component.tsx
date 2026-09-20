import React from 'react';
import { useAuth } from 'features/auth';
import { ToastHostTemplate } from './toast-host.html';

/** Mounts job-completion toast listening when the user is authenticated. */
export const ToastHost: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <ToastHostTemplate
      showListener = {
        isAuthenticated
      }
    />
  );
};
