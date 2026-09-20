import { useParams } from 'react-router-dom';
import { useAuth } from 'features/auth';
import { useUserDetail } from 'features/admin';
import { formatDateTime } from 'shared/utils/format-date.util';
import { getJoinedDate } from 'shared/utils/get-initials.util';
import type { SectionProps } from '../../../../interfaces/section-props.interface';
import { TABS } from '../constants/tabs.constant';
import { PERMISSION_TOGGLES } from '../constants/permission-toggles.constant';
import type { ActivityRow } from '../interfaces/activity-row.interface';
import type { PermissionToggleItem } from '../interfaces/permission-toggle-item.interface';
import type { DetailTemplateProps } from '../interfaces/template-props.interface';
import { formatJoinedDisplay } from '../utils/format-joined-display.util';
import styles from '../detail.module.css';

export function useDetail({ showToast }: SectionProps): DetailTemplateProps {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser, refreshUser } = useAuth();
  const detail = useUserDetail({ showToast, userId, currentUser, refreshUser });
  const { user, activity, policy, isOwnerReadOnly, isSelf, onPolicyChange } = detail;

  const joinedLabel = user?.CreatedAt ? getJoinedDate(user.CreatedAt) : 'Unknown';
  const switchesDisabled = isOwnerReadOnly;
  const fieldsDisabled = isOwnerReadOnly || !isSelf;

  const activityRows: ActivityRow[] = activity.map((entry) => ({
    id: entry.Id,
    action: entry.Action,
    timestampLabel: formatDateTime(entry.CreatedAt),
  }));

  const featureToggles: PermissionToggleItem[] = PERMISSION_TOGGLES.map((toggle) => ({
    key: toggle.key,
    title: toggle.title,
    description: toggle.description,
    checked: !!policy[toggle.key],
    disabled: switchesDisabled,
    onChange: (checked) => onPolicyChange(toggle.key, checked),
  }));

  return {
    isLoading: detail.isLoading,
    hasUser: !!user,
    usernameLabel: user ? `@${user.Username}` : '',
    emailLabel: user?.Email ?? '',
    joinedDisplay: formatJoinedDisplay(joinedLabel),
    metaLine: user
      ? `${user.WishlistCount ?? 0} lists · ${user.FriendsCount ?? 0} friends · Last login: ${formatDateTime(user.LastLoginAt)} · Last online: ${formatDateTime(user.LastOnline)}`
      : '',
    securityDescription: user
      ? `2FA: ${user.TwoFactorEnabled ? 'Enabled' : 'Disabled'} · Passkeys: ${user.PasskeyCount ?? 0} · Failed logins: ${user.FailedLoginCount ?? 0}`
      : '',
    fieldsDisabled,
    switchesDisabled,
    paneClassName: isOwnerReadOnly
      ? `${styles['detail__pane']} ${styles['detail__pane--readonly']}`
      : styles['detail__pane']!,
    tabs: TABS,
    activeTab: detail.activeTab,
    activityRows,
    featureToggles,
    canCreateWishlists: policy.CanCreateWishlists,
    maxActiveWishlists: policy.MaxActiveWishlists,
    onCanCreateWishlistsChange: (checked) => onPolicyChange('CanCreateWishlists', checked),
    onMaxActiveWishlistsChange: (value) => onPolicyChange('MaxActiveWishlists', value),
    profileForm: detail.profileForm,
    policyFlags: detail.policyFlags,
    newPassword: detail.newPassword,
    isSelf,
    isOwnerReadOnly,
    onTabChange: detail.onTabChange,
    onProfileFormChange: detail.onProfileFormChange,
    onPolicyFlagsChange: detail.onPolicyFlagsChange,
    onNewPasswordChange: detail.onNewPasswordChange,
    onSaveProfile: detail.onSaveProfile,
    onSavePolicy: detail.onSavePolicy,
    onResetPassword: detail.onResetPassword,
    onUnlock: detail.onUnlock,
    onRevokeSessions: detail.onRevokeSessions,
    onDelete: detail.onDelete,
    canDeleteAccount: detail.canDeleteAccount,
    canTransferOwnership: detail.canTransferOwnership,
    onTransferOwnership: detail.onTransferOwnership,
    isTransferringOwnership: detail.isTransferringOwnership,
  };
}
