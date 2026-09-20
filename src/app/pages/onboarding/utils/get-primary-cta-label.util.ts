import type { StepId } from '../interfaces/step-id.type';

export function getPrimaryCtaLabel(stepId: StepId): string {
  if (stepId === 'done') return 'Enter Dashboard';
  if (stepId === 'hello') return "Let's go";
  return 'Continue';
}
