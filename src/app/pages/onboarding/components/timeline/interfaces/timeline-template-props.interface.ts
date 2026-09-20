import type { TimelineStep } from './timeline-step.interface';

export interface TimelineTemplateProps {
  steps: TimelineStep[];
  activeIndex: number;
}
