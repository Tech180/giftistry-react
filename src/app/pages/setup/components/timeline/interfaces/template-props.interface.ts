import type { Step } from './step.interface';

export interface TimelineTemplateProps {
  steps: ReadonlyArray<Step & { completed: boolean; active: boolean }>;
}
