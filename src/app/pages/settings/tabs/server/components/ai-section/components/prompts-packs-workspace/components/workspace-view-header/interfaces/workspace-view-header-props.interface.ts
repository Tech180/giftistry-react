import type { ReactNode } from 'react';

export interface WorkspaceViewHeaderProps {
  heading: string;
  leading?: ReactNode;
  actions?: ReactNode;
}
