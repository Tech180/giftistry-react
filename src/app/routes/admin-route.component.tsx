import React from 'react';
import { useAuth } from 'app/providers/auth-context';
import { AdminRouteTemplate } from './admin-route.html';

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  return (
    <AdminRouteTemplate isLoading={isLoading} isAdmin={!!user?.IsAdmin}>
      {children}
    </AdminRouteTemplate>
  );
};
