import type { ReactNode } from 'react';

export interface TemplateProps {
  isLoading: boolean;
  isAdmin: boolean;
  children: ReactNode;
}
