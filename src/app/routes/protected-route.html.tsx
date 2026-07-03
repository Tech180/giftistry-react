import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingState } from 'shared/ui';
import { ProtectedRouteTemplateProps } from './interfaces/protected-route-template-props.interface';

export const ProtectedRouteTemplate: React.FC<ProtectedRouteTemplateProps> = ({
  isAuthenticated,
  isLoading,
  children,
  redirectTo,
  allowAuthenticated,
}) => {
  if (isLoading) {
    return <LoadingState fullHeight />;
  }

  if (allowAuthenticated) {
    return isAuthenticated ? <Navigate to={redirectTo} replace /> : <>{children}</>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
};
