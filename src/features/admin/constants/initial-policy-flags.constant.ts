import type { UserPolicyFlagsState } from '../interfaces/user-policy-flags-state.interface';

export const INITIAL_POLICY_FLAGS: UserPolicyFlagsState = {
  isAdmin: false,
  isDisabled: false,
  isHidden: false,
  forcePasswordChange: false,
  loginAttemptsBeforeLockout: -1,
};
