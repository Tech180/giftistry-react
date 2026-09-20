import { OWNER_STEPS } from '../constants/owner-steps.constant';
import type { StepId } from '../interfaces/step-id.type';

export function isOwnerStep(stepId: StepId): boolean {
  return (OWNER_STEPS as readonly string[]).includes(stepId);
}
