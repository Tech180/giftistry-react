import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingState } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const ProtectedTemplate: React.FC<TemplateProps> = ({
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
