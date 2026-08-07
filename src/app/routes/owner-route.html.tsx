import React from 'react';
import { Navigate } from 'react-router-dom';
import { LoadingState } from 'shared/ui';
import { OwnerRouteTemplateProps } from './interfaces/owner-route-template-props.interface';

export const OwnerRouteTemplate: React.FC<OwnerRouteTemplateProps> = ({
  isLoading,
  isOwner,
  isAdmin,
  children,
}) => {
  if (isLoading) {
    return <LoadingState fullHeight />;
  }

  if (!isOwner) {
    return <Navigate to={isAdmin ? '/settings/admin' : '/settings/account'} replace />;
  }

  return <>{children}</>;
};
