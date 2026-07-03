import { ReactNode } from 'react';

export interface ProtectedRouteTemplateProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  children: ReactNode;
  redirectTo: string;
  allowAuthenticated: boolean;
}
