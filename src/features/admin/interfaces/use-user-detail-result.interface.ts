import type { AuditLogEntry } from './audit-log-entry.interface';
import type { GiftistryUserPolicy } from './giftistry-user-policy.interface';
import type { User } from './user.interface';
import type { UserDetailKey } from './user-detail-key.type';
import type { UserPolicyFlagsState } from './user-policy-flags-state.interface';
import type { UserProfileFormState } from './user-profile-form-state.interface';

export interface UseUserDetailResult {
  isLoading: boolean;
  user: User | null;
  activity: AuditLogEntry[];
  activeTab: UserDetailKey;
  profileForm: UserProfileFormState;
  policyFlags: UserPolicyFlagsState;
  policy: GiftistryUserPolicy;
  newPassword: string;
  isSelf: boolean;
  isOwnerReadOnly: boolean;
  onTabChange: (tab: UserDetailKey) => void;
  onProfileFormChange: (updates: Partial<UserProfileFormState>) => void;
  onPolicyFlagsChange: (updates: Partial<UserPolicyFlagsState>) => void;
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
