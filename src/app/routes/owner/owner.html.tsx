import React from 'react';
import { Navigate } from 'react-router-dom';
import type { TemplateProps } from './interfaces/template-props.interface';

export const OwnerTemplate: React.FC<TemplateProps> = ({
  isLoading,
  isOwner,
  isAdmin,
  children,
}) => {
  if (isLoading) {
    return null;
  }

  if (!isOwner) {
    return <Navigate to={isAdmin ? '/settings/admin' : '/settings/account'} replace />;
  }

  return <>{children}</>;
};
