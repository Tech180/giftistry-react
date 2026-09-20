import type { ReactNode } from 'react';

export interface TemplateProps {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  content: ReactNode;
  animationKey: string;
  rootClassName: string;
  panelClassName: string;
  prevNavClassName: string;
  nextNavClassName: string;
  ariaLabel: string | undefined;
}
