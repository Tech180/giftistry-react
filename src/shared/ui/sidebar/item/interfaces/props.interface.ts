import type { ReactNode } from 'react';

export interface Props {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/** @deprecated Prefer `Props`; kept for barrel consumers. */
export type SidebarItemProps = Props;
