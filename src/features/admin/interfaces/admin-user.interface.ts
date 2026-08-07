import { GiftistryUserPolicy } from './giftistry-user-policy.interface';

export interface AdminUser {
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

/** Fields returned by GET /api/admin/users (list), not full AdminUser. */
export interface AdminUserListItem {
  Id: string;
  Username: string;
  Email: string | null;
  IsOwner: boolean;
  IsAdmin: boolean;
  IsDisabled: boolean;
  LockedUntil: string | null;
  ActiveListsCount: number;
  LastLoginAt: string | null;
  LastOnline: string | null;
}

export interface AdminUserListResponse {
  Users: AdminUserListItem[];
  Page: number;
  Total: number;
}

export interface AdminOverviewStats {
  Users: {
    Total: number;
    Active: number;
    Disabled: number;
    Unverified: number;
    Admins: number;
    New30d: number;
    Active7d: number;
    Locked: number;
  };
  Lists: { Total: number; Active: number };
  Comments: number;
  OpenReports: number;
  MaintenanceMode: boolean;
}
