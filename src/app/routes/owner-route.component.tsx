import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { OwnerRouteTemplate } from './owner-route.html';

export const OwnerRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  return (
    <OwnerRouteTemplate
      isLoading={isLoading}
      isOwner={!!user?.IsOwner}
      isAdmin={!!user?.IsAdmin}
    >
      {children}
    </OwnerRouteTemplate>
  );
};
