import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';
import type { RegistrationMode } from './registration-mode.type';

export interface SitePolicy {
  RegistrationMode: RegistrationMode;
  LoginAttemptsBeforeLockout: number;
  LockoutDurationMinutes: number;
  MaintenanceMode: boolean;
  MaintenanceMessage: string;
  AllowPasswordLogin: boolean;
  RequireStrongPasswords: boolean;
  AllowedEmailDomains: string[];
  RegistrationInviteTtlHours: number;
  RegistrationInviteMaxUses: number | null;
  DefaultUserPolicy: GiftistryUserPolicy;
}
