import type { ReactNode } from 'react';
import type { SubstitutionBrowseOption } from '../../../../../utils/resolve-item-substitution-options.util';

export type SubstitutionSlideDirection = 'forward' | 'backward' | 'none';

export interface SubstitutionSwitcherTemplateProps {
  browse: SubstitutionBrowseOption[];
  activeIndex: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  direction?: SubstitutionSlideDirection;
  content: ReactNode;
  animationKey: string;
  className?: string;
}

