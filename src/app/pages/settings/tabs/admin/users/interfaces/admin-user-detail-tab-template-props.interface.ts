import type { AdminUser, AuditLogEntry, GiftistryUserPolicy } from 'features/admin';

export type AdminUserDetailTabKey = 'profile' | 'permissions' | 'security' | 'activity';

export interface AdminUserProfileFormState {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  emailVerified: boolean;
}

export interface AdminUserPolicyFlagsState {
  isAdmin: boolean;
  isDisabled: boolean;
  isHidden: boolean;
  forcePasswordChange: boolean;
  loginAttemptsBeforeLockout: number;
}

export interface AdminUserDetailTabTemplateProps {
  isLoading: boolean;
  user: AdminUser | null;
  activity: AuditLogEntry[];
  activeTab: AdminUserDetailTabKey;
  profileForm: AdminUserProfileFormState;
  policyFlags: AdminUserPolicyFlagsState;
  policy: GiftistryUserPolicy;
  newPassword: string;
  isSelf: boolean;
  onTabChange: (tab: AdminUserDetailTabKey) => void;
  onProfileFormChange: (updates: Partial<AdminUserProfileFormState>) => void;
  onPolicyFlagsChange: (updates: Partial<AdminUserPolicyFlagsState>) => void;
  onPolicyChange: (key: keyof GiftistryUserPolicy, value: boolean | number) => void;
  onNewPasswordChange: (value: string) => void;
  onSaveProfile: () => void;
  onSavePolicy: () => void;
  onResetPassword: () => void;
  onUnlock: () => void;
  onRevokeSessions: () => void;
  onDelete: () => void;
  canDeleteAccount: boolean;
  canTransferOwnership: boolean;
  onTransferOwnership: () => void;
  isTransferringOwnership: boolean;
}
