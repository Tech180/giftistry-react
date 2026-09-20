import type { MouseEvent, ReactNode } from 'react';

export interface GlowCardTemplateProps {
  selected: boolean;
  as: 'button' | 'div';
  type?: 'button' | 'submit';
  onClick?: () => void;
  onMouseMove?: (event: MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  className?: string;
  role?: string;
  contentPassive?: boolean;
}
