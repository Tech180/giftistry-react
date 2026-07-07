import { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export interface AdminUser {
  Id: string;
  Username: string;
  Email: string;
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

export interface AdminUserListResponse {
  Users: AdminUser[];
  Page: number;
  Total: number;
}

export interface AdminOverviewStats {
  Users: {
    total: number;
    active: number;
    disabled: number;
    unverified: number;
    admins: number;
    new_30d: number;
    active_7d: number;
    locked: number;
  };
  Lists: { total: number; active: number };
  Comments: number;
  OpenReports: number;
  MaintenanceMode: boolean;
}
