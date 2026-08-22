import type { ReactNode } from 'react';

export interface ProcessesRailTemplateProps {
  panelTitle: string;
  panelId: string;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  children: ReactNode;
}
