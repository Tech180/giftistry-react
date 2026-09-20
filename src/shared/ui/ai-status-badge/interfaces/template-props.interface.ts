import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  gradientId: string;
  isCompact: boolean;
  displayLabel: string;
  resolvedAriaLabel: string;
}
