import type { ImportTimelineStep } from 'features/items/components/import/strip/interfaces/import-timeline-step.interface';

export interface Props {
  step: ImportTimelineStep;
  isLast: boolean;
  filledConnector: boolean;
  activeConnector: boolean;
}
