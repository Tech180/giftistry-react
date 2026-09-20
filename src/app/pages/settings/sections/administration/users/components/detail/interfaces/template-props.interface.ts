import type {
  UserDetailKey,
  UserPolicyFlagsState,
  UserProfileFormState,
} from 'features/admin';
import type { ActivityRow } from './activity-row.interface';
import type { PermissionToggleItem } from './permission-toggle-item.interface';
import type { Tab } from './tab.interface';

export interface DetailTemplateProps {
  isLoading: boolean;
  hasUser: boolean;
  usernameLabel: string;
  emailLabel: string;
  joinedDisplay: string;
  metaLine: string;
  securityDescription: string;
  fieldsDisabled: boolean;
  switchesDisabled: boolean;
  paneClassName: string;
  tabs: Tab[];
  activeTab: UserDetailKey;
  activityRows: ActivityRow[];
  featureToggles: PermissionToggleItem[];
  canCreateWishlists: boolean;
  maxActiveWishlists: number;
  onCanCreateWishlistsChange: (checked: boolean) => void;
  onMaxActiveWishlistsChange: (value: number) => void;
  profileForm: UserProfileFormState;
  policyFlags: UserPolicyFlagsState;
  newPassword: string;
  isSelf: boolean;
  isOwnerReadOnly: boolean;
  onTabChange: (tab: UserDetailKey) => void;
  onProfileFormChange: (updates: Partial<UserProfileFormState>) => void;
  onPolicyFlagsChange: (updates: Partial<UserPolicyFlagsState>) => void;
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
