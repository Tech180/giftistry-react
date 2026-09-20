import { STEP_COPY } from '../constants/step-copy.constant';
import type { StepId } from '../interfaces/step-id.type';

const FALLBACK = { title: 'Welcome', subtitle: '' };

export function getStepCopy(stepId: StepId): { title: string; subtitle: string } {
  return STEP_COPY[stepId] ?? FALLBACK;
}
