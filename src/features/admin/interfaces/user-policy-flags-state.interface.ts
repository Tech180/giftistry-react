export interface UserPolicyFlagsState {
  isAdmin: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  forcePasswordChange: boolean;
  loginAttemptsBeforeLockout: number;
}
