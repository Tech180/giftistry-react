import type { ReactNode } from 'react';

export interface TemplateProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  children: ReactNode;
  redirectTo: string;
  allowAuthenticated: boolean;
}
