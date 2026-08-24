import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { useJobNotificationToast } from '../../hooks/use-job-notification-toast';

function JobNotificationToastListener() {
  useJobNotificationToast();
  return null;
}

/** Mounts job-completion toast listening when the user is authenticated. */
export const JobNotificationToastHost: React.FC = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <JobNotificationToastListener />;
};
