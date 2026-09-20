import React from 'react';
import { useAuth } from 'features/auth';
import type { Props } from './interfaces/props.interface';
import { OwnerTemplate } from './owner.html';

export const OwnerRoute: React.FC<Props> = ({ children }) => {
  const { user, isLoading } = useAuth();

  return (
    <OwnerTemplate
      isLoading = {
        isLoading
      }
      isOwner = {
        !!user?.IsOwner
      }
      isAdmin = {
        !!user?.IsAdmin
      }
    >
      {
        children
      }
    </OwnerTemplate>
  );
};
