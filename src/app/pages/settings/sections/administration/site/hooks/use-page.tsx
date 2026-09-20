import {
  REGISTRATION_MODE_LABELS,
  REGISTRATION_MODE_MENU_TITLE,
  REGISTRATION_MODE_OPTIONS,
  useSitePolicy,
  type RegistrationMode,
  type SitePolicy as SitePolicyModel,
} from 'features/admin';
import { formatDateTime } from 'shared/utils/format-date.util';
import type { SectionProps } from '../../interfaces/section-props.interface';
import { DEFAULT_POLICY_TOGGLES } from '../constants/default-policy-toggles.constant';
import { DEFAULT_INVITE_MAX_USES, DEFAULT_INVITE_TTL_HOURS } from '../constants/invite-defaults.constant';
import type { DefaultPolicyToggleItem } from '../interfaces/default-policy-toggle-item.interface';
import type { InviteRow } from '../interfaces/invite-row.interface';
import type { TemplateProps } from '../interfaces/template-props.interface';
import { displayInviteListUrl, displayInviteUrl } from '../utils/display-invite-url.util';
import { getInviteStatusSummary } from '../utils/get-invite-status-summary.util';
import { inviteStatusBadgeLabel } from '../utils/invite-status-badge-label.util';
import styles from '../page.module.css';

export function usePage({ showToast }: SectionProps): TemplateProps {
  const {
    isLoading,
    policy,
    domainsText,
    isSaving,
    inviteStatus,
    inviteUrl,
    inviteCopied,
    inviteCopiedId,
    isInviteLoading,
    isRegeneratingInvite,
    deletingInviteId,
    onPolicyChange,
    onDomainsTextChange,
    onDefaultPolicyToggle,
    onSave,
    onRegenerateInvite,
    onCopyInviteUrl,
    onDeleteInvite,
  } = useSitePolicy({ showToast });

  const patchPolicy = (updates: Partial<SitePolicyModel>) => {
    if (!policy) {
      return;
    }

    onPolicyChange({ ...policy, ...updates });
  };

  const inviteRows: InviteRow[] = (inviteStatus?.Invites ?? []).map((invite) => ({
    id: invite.Id,
    displayUrl: displayInviteListUrl(invite.Url),
    statusLabel: inviteStatusBadgeLabel(invite.Status),
    statusClassName: `${styles['page__invite-status']} ${styles[`page__invite-status--${invite.Status}`]}`,
    expiresLabel: `Expires ${formatDateTime(invite.ExpiresAt)}`,
    copied: inviteCopied && inviteCopiedId === invite.Id,
    canCopy: !!invite.Url,
    isDeleting: deletingInviteId === invite.Id,
    onCopy: () => {
      if (invite.Url) {
        onCopyInviteUrl(invite.Url, invite.Id);
      }
    },
    onDelete: () => onDeleteInvite(invite),
  }));

  const defaultPolicyToggles: DefaultPolicyToggleItem[] = policy
    ? DEFAULT_POLICY_TOGGLES.map((toggle) => ({
        key: toggle.key,
        title: toggle.title,
        description: toggle.description,
        checked: !!policy.DefaultUserPolicy[toggle.key],
        onChange: (checked) => onDefaultPolicyToggle(toggle.key, checked),
      }))
    : [];

  const registrationMode = policy?.RegistrationMode ?? 'open';

  return {
    isLoading,
    hasPolicy: !!policy,
    isSaving,
    showInviteControls: registrationMode === 'invite_only',
    registrationMode,
    registrationModeDescription: REGISTRATION_MODE_LABELS[registrationMode],
    registrationModeOptions: REGISTRATION_MODE_OPTIONS,
    registrationModeMenuTitle: REGISTRATION_MODE_MENU_TITLE,
    onRegistrationModeChange: (value) => {
      patchPolicy({ RegistrationMode: value as RegistrationMode });
    },
    allowPasswordLogin: !!policy?.AllowPasswordLogin,
    onAllowPasswordLoginChange: (checked) => {
      patchPolicy({ AllowPasswordLogin: checked });
    },
    domainsText,
    onDomainsTextChange,
    inviteTtlHours: policy?.RegistrationInviteTtlHours ?? DEFAULT_INVITE_TTL_HOURS,
    onInviteTtlHoursChange: (value) => {
      patchPolicy({ RegistrationInviteTtlHours: value });
    },
    inviteMaxUses: policy?.RegistrationInviteMaxUses ?? DEFAULT_INVITE_MAX_USES,
    onInviteMaxUsesChange: (value) => {
      patchPolicy({ RegistrationInviteMaxUses: value });
    },
    inviteSummaryDescription: isInviteLoading
      ? 'Loading invite status…'
      : getInviteStatusSummary(inviteStatus),
    headerInviteDisplayUrl: displayInviteUrl(inviteUrl, inviteStatus?.HasActiveInvite),
    headerInviteCopied: inviteCopied && !inviteCopiedId,
    canCopyHeaderInvite: !!inviteUrl,
    onCopyHeaderInvite: () => {
      if (inviteUrl) {
        onCopyInviteUrl(inviteUrl, null);
      }
    },
    onRegenerateInvite,
    isRegeneratingInvite,
    showInviteList: inviteRows.length > 0,
    inviteRows,
    requireStrongPasswords: !!policy?.RequireStrongPasswords,
    onRequireStrongPasswordsChange: (checked) => {
      patchPolicy({ RequireStrongPasswords: checked });
    },
    loginAttemptsBeforeLockout: policy?.LoginAttemptsBeforeLockout ?? 0,
    onLoginAttemptsChange: (value) => {
      patchPolicy({ LoginAttemptsBeforeLockout: value });
    },
    lockoutDurationMinutes: policy?.LockoutDurationMinutes ?? 0,
    onLockoutDurationChange: (value) => {
      patchPolicy({ LockoutDurationMinutes: value });
    },
    maintenanceMode: !!policy?.MaintenanceMode,
    onMaintenanceModeChange: (checked) => {
      patchPolicy({ MaintenanceMode: checked });
    },
    maintenanceMessage: policy?.MaintenanceMessage ?? '',
    onMaintenanceMessageChange: (value) => {
      patchPolicy({ MaintenanceMessage: value });
    },
    defaultPolicyToggles,
    onSave,
  };
}
