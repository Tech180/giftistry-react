import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingState } from 'shared/ui';
import type { TemplateProps } from './interfaces/template-props.interface';

export const AdminTemplate: React.FC<TemplateProps> = ({
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
