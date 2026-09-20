import type { ReactNode } from 'react';

export interface TemplateProps {
  title: string;
  ariaLabel: string;
  children: ReactNode;
  rootClassName: string;
  titleClassName: string;
  bodyClassName: string;
}
