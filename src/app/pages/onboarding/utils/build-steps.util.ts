import { OWNER_STEPS } from '../constants/owner-steps.constant';
import { USER_STEPS } from '../constants/user-steps.constant';
import type { StepId } from '../interfaces/step-id.type';

export function buildSteps(requiresOwnerOnboarding: boolean): StepId[] {
  const list: StepId[] = [...USER_STEPS];
  if (requiresOwnerOnboarding) list.push(...OWNER_STEPS);
  list.push('done');
  return list;
}
