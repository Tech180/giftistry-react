import { ReactNode } from 'react';

export interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}
