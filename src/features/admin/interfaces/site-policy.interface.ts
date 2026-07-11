import { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export type RegistrationMode = 'open' | 'invite_only' | 'disabled';

export interface SitePolicy {
  RegistrationMode: RegistrationMode;
  RequireEmailVerification: boolean;
  LoginAttemptsBeforeLockout: number;
  LockoutDurationMinutes: number;
  MaintenanceMode: boolean;
  MaintenanceMessage: string;
  AllowPasswordLogin: boolean;
  AllowedEmailDomains: string[];
  DefaultUserPolicy: GiftistryUserPolicy;
}
