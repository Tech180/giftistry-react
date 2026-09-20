import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export interface CreateUserPayload {
  username: string;
  email?: string | null;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdmin?: boolean;
  emailVerified?: boolean;
  forcePasswordChange?: boolean;
  policy?: Partial<GiftistryUserPolicy>;
}
