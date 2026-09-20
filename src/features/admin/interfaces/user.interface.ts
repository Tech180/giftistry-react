import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export interface User {
  Id: string;
  Username: string;
  Email: string | null;
  FirstName: string;
  LastName: string;
  Bio?: string;
  Avatar?: string | null;
  CreatedAt?: string;
  LastOnline?: string | null;
  LastLoginAt?: string | null;
  EmailVerified?: boolean;
  TwoFactorEnabled?: boolean;
  IsAdmin?: boolean;
  IsOwner?: boolean;
  IsDisabled?: boolean;
  IsHidden?: boolean;
  LockedUntil?: string | null;
  FailedLoginCount?: number;
  ForcePasswordChange?: boolean;
  LoginAttemptsBeforeLockout?: number;
  SessionVersion?: number;
  WishlistCount?: number;
  ActiveListsCount?: number;
  FriendsCount?: number;
  CommentsCount?: number;
  PasskeyCount?: number;
  Policy: GiftistryUserPolicy;
}
