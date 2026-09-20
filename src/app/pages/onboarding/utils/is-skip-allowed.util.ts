import { SKIP_ALLOWED } from '../constants/skip-allowed.constant';
import type { StepId } from '../interfaces/step-id.type';

export function isSkipAllowed(stepId: StepId): boolean {
  return SKIP_ALLOWED.has(stepId);
}
