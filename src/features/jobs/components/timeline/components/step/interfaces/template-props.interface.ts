import type { ImportTimelineStep } from 'features/items/components/import/strip/interfaces/import-timeline-step.interface';

export interface TemplateProps {
  step: ImportTimelineStep;
  isLast: boolean;
  filledConnector: boolean;
  activeConnector: boolean;
  stepClassName: string;
  railClassName: string;
  copyClassName: string;
  labelClassName: string;
  metricClassName: string;
}
