import { ReactNode } from 'react';

export interface OwnerRouteTemplateProps {
  isLoading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  children: ReactNode;
}
