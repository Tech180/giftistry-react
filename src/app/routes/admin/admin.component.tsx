import React from 'react';
import { useAuth } from 'features/auth';
import { AdminTemplate } from './admin.html';
import type { Props } from './interfaces/props.interface';

export const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();

  return (
    <AdminTemplate
      isLoading = {
        isLoading
      }
      isAdmin = {
        !!user?.IsAdmin
      }
    >
      {
        children
      }
    </AdminTemplate>
  );
};
