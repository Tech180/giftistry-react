import type { ImportTimelineStep } from 'features/items/components/import/import-strip/interfaces/import-timeline-step.interface';

export interface StepProps {
  step: ImportTimelineStep;
  isLast: boolean;
  filledConnector: boolean;
  activeConnector: boolean;
}
