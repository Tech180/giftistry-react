import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingState } from 'shared/ui';
import { AdminRouteTemplateProps } from './interfaces/admin-route-template-props.interface';

export const AdminRouteTemplate: React.FC<AdminRouteTemplateProps> = ({
  isLoading,
  isAdmin,
  children,
}) => {
  if (isLoading) {
    return <LoadingState fullHeight />;
  }

  if (!isAdmin) {
    return <Navigate to="/settings/account" replace />;
  }

  return <>{children}</>;
};
