import type { ReactNode } from 'react';

export interface TemplateProps {
  isLoading: boolean;
  isOwner: boolean;
  isAdmin: boolean;
  children: ReactNode;
}
