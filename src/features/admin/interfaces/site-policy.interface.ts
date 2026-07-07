import { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export type RegistrationMode = 'open' | 'invite_only' | 'disabled';

export interface SitePolicy {
  registrationMode: RegistrationMode;
  requireEmailVerification: boolean;
  loginAttemptsBeforeLockout: number;
  lockoutDurationMinutes: number;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowPasswordLogin: boolean;
  allowedEmailDomains: string[];
  defaultUserPolicy: GiftistryUserPolicy;
}
