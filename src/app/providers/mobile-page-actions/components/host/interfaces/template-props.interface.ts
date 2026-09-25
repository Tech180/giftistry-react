import type { FloatingAction } from 'shared/ui';

export interface TemplateProps {
  pageActions: FloatingAction[];
  ariaLabel: string;
  closedTourTarget?: string;
}
