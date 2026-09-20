import type { TimelineStep } from './timeline-step.interface';

export interface TimelineProps {
  steps: TimelineStep[];
  activeIndex: number;
}
