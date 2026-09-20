import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export interface UpdateUserPolicyPayload {
  isAdmin?: boolean;
  isDisabled?: boolean;
  isHidden?: boolean;
  forcePasswordChange?: boolean;
  loginAttemptsBeforeLockout?: number;
  policy?: Partial<GiftistryUserPolicy>;
}
