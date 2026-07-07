import { ReactNode } from 'react';

export interface AdminRouteTemplateProps {
  isLoading: boolean;
  isAdmin: boolean;
  children: ReactNode;
}
