import React from 'react';
import { Check, Copy, RefreshCw, Save, Trash2 } from 'lucide-react';
import { EnterPanel, Button, NumberSelector, SelectMenu, Switch } from 'shared/ui';
import type { RegistrationInviteListStatus, SitePolicy } from 'features/admin';
import {
  DEFAULT_USER_POLICY,
  REGISTRATION_MODE_LABELS,
  REGISTRATION_MODE_MENU_TITLE,
  REGISTRATION_MODE_OPTIONS,
} from 'features/admin';
import { SettingGroup, SettingItem } from '../components';
import { AdminSitePolicyTabTemplateProps } from './interfaces/admin-site-policy-tab-template-props.interface';
import styles from '../admin.shared.module.css';

const DEFAULT_POLICY_TOGGLES: [keyof typeof DEFAULT_USER_POLICY, string, string][] = [
  ['CanCreateWishlists', 'Create wishlists', 'Allow new users to create wishlists.'],
  ['CanUseComments', 'Use comments', 'Allow commenting on wishlists.'],
  ['CanUseAiFeatures', 'Use AI features', 'Allow AI-powered features.'],
  ['CanSharePublicLinks', 'Public sharing', 'Allow public link generation.'],
  ['CanUploadImages', 'Upload images', 'Allow image uploads.'],
  ['CanSendFriendRequests', 'Send friend requests', 'Allow friend requests.'],
  ['CanUseCustomThemes', 'Use custom themes', 'Allow theme customization.'],
];

function inviteStatusLabel(
  inviteStatus: AdminSitePolicyTabTemplateProps['inviteStatus']
): string {
  if (!inviteStatus) return 'Loading invite status…';
  const activeCount = (inviteStatus.Invites ?? []).filter((i) => i.Status === 'active').length;
  if (activeCount > 0) {
    return activeCount === 1
      ? '1 active invite link'
      : `${activeCount} active invite links`;
  }
  if ((inviteStatus.Invites ?? []).length > 0) {
    return 'No active invites — generate a new link';
  }
  return 'No invite yet — generate to create a link';
}

function displayInviteUrl(inviteUrl: string | null, hasActiveInvite: boolean | undefined): string {
  if (inviteUrl) {
    return inviteUrl.replace(/^https?:\/\//, '');
  }
  if (hasActiveInvite) {
    return 'Generate a link to copy it here';
  }
  return 'No invite link yet';
}

function inviteStatusBadgeLabel(status: RegistrationInviteListStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'completed':
      return 'Completed';
    case 'expired':
      return 'Expired';
  }
}

export const AdminSitePolicyTabTemplate: React.FC<AdminSitePolicyTabTemplateProps> = ({
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
}) => {
  if (isLoading || !policy) {
    return <p className={styles.empty}>Loading site policy...</p>;
  }

  const showInviteControls = policy.RegistrationMode === 'invite_only';

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['page-header']}>
        <div className={styles['page-header-main']}>
          <h1 className={styles['page-title']}>Site Policy</h1>
          <p className={styles['page-subtitle']}>Global rules, registration limits, and security defaults.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          iconOnly
          onClick={onSave}
          disabled={isSaving}
          isLoading={isSaving}
          leftIcon={<Save size={16} />}
          aria-label={isSaving ? 'Saving site policy' : 'Save site policy'}
          title={isSaving ? 'Saving site policy' : 'Save site policy'}
        />
      </div>

      <h2 className={styles['section-title']}>Registration & access</h2>
      <SettingGroup>
        <SettingItem
          title="Registration mode"
          description={REGISTRATION_MODE_LABELS[policy.RegistrationMode]}
        >
          <SelectMenu
            className={styles['form-input-inline']}
            value={policy.RegistrationMode}
            options={REGISTRATION_MODE_OPTIONS}
            onChange={(next) =>
              onPolicyChange({
                ...policy,
                RegistrationMode: next as SitePolicy['RegistrationMode'],
              })
            }
            variant="field"
            menuTitle={REGISTRATION_MODE_MENU_TITLE}
            aria-label="Registration mode"
          />
        </SettingItem>
        <SettingItem
          title="Allow password login"
          description="Permit signing in with email and password."
        >
          <Switch
            checked={policy.AllowPasswordLogin}
            onChange={(checked) => onPolicyChange({ ...policy, AllowPasswordLogin: checked })}
            aria-label="Allow password login"
          />
        </SettingItem>
        <SettingItem
          title="Allowed email domains"
          description="Comma-separated allowlist (empty = all domains permitted)."
        >
          <input
            className={`${styles['form-input']} ${styles['form-input-inline']}`}
            value={domainsText}
            onChange={(e) => onDomainsTextChange(e.target.value)}
            placeholder="example.com, company.org"
          />
        </SettingItem>

        {showInviteControls && (
          <>
            <SettingItem
              title="Invite link lifetime (hours)"
              description="Applied the next time you regenerate the invite link. Save policy first if you change this."
            >
              <NumberSelector
                size="sm"
                value={policy.RegistrationInviteTtlHours ?? 168}
                min={1}
                max={8760}
                onChange={(next) =>
                  onPolicyChange({
                    ...policy,
                    RegistrationInviteTtlHours: next,
                  })
                }
                editLabel="Invite link lifetime in hours"
              />
            </SettingItem>
            <SettingItem
              title="Max signups per invite"
              description="After this many successful signups, the invite is marked completed."
            >
              <NumberSelector
                size="sm"
                value={policy.RegistrationInviteMaxUses ?? 1}
                min={1}
                max={1000}
                onChange={(next) =>
                  onPolicyChange({
                    ...policy,
                    RegistrationInviteMaxUses: next,
                  })
                }
                editLabel="Max signups per invite"
              />
            </SettingItem>
            <SettingItem
              title="Registration invite link"
              description={
                isInviteLoading ? 'Loading invite status…' : inviteStatusLabel(inviteStatus)
              }
            >
              <div className={styles['invite-controls']}>
                <div className={styles['invite-url-box']}>
                  <span className={styles['invite-url-text']} aria-label="Registration invite URL">
                    {displayInviteUrl(inviteUrl, inviteStatus?.HasActiveInvite)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconOnly
                    className={styles['invite-copy-btn']}
                    onClick={() => {
                      if (inviteUrl) onCopyInviteUrl(inviteUrl, null);
                    }}
                    disabled={!inviteUrl}
                    aria-label={inviteCopied && !inviteCopiedId ? 'Copied' : 'Copy invite link'}
                    title={inviteCopied && !inviteCopiedId ? 'Copied' : 'Copy invite link'}
                  >
                    {inviteCopied && !inviteCopiedId ? (
                      <Check size={16} aria-hidden />
                    ) : (
                      <Copy size={16} aria-hidden />
                    )}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onRegenerateInvite}
                  disabled={isRegeneratingInvite}
                  isLoading={isRegeneratingInvite}
                  leftIcon={<RefreshCw size={14} />}
                  aria-label="Generate invite link"
                >
                  Generate
                </Button>

                {(inviteStatus?.Invites?.length ?? 0) > 0 && (
                  <ul className={styles['invite-list']} aria-label="Generated invite links">
                    {inviteStatus!.Invites.map((invite) => {
                      const displayUrl = invite.Url
                        ? invite.Url.replace(/^https?:\/\//, '')
                        : 'Link unavailable';
                      const rowCopied = inviteCopied && inviteCopiedId === invite.Id;
                      return (
                        <li key={invite.Id} className={styles['invite-list-item']}>
                          <div className={styles['invite-list-main']}>
                            <div className={styles['invite-list-meta']}>
                              <span
                                className={`${styles['invite-status']} ${styles[`invite-status-${invite.Status}`]}`}
                              >
                                {inviteStatusBadgeLabel(invite.Status)}
                              </span>
                              <span className={styles['invite-list-expires']}>
                                Expires {new Date(invite.ExpiresAt).toLocaleString()}
                              </span>
                            </div>
                            <div className={styles['invite-url-box']}>
                              <span className={styles['invite-url-text']}>{displayUrl}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                iconOnly
                                className={styles['invite-copy-btn']}
                                onClick={() => {
                                  if (invite.Url) onCopyInviteUrl(invite.Url, invite.Id);
                                }}
                                disabled={!invite.Url}
                                aria-label={rowCopied ? 'Copied' : `Copy invite link ${invite.Id}`}
                                title={rowCopied ? 'Copied' : 'Copy invite link'}
                              >
                                {rowCopied ? (
                                  <Check size={16} aria-hidden />
                                ) : (
                                  <Copy size={16} aria-hidden />
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                iconOnly
                                className={styles['invite-delete-btn']}
                                onClick={() => onDeleteInvite(invite)}
                                disabled={deletingInviteId === invite.Id}
                                isLoading={deletingInviteId === invite.Id}
                                aria-label={`Delete invite link ${invite.Id}`}
                                title="Delete invite link"
                              >
                                <Trash2 size={16} aria-hidden />
                              </Button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </SettingItem>
          </>
        )}
      </SettingGroup>

      <h2 className={styles['section-title']}>Security defaults</h2>
      <SettingGroup>
        <SettingItem
          title="Require strong passwords"
          description="Require at least 8 characters with a letter and a number. When off, passwords only need 6 characters."
        >
          <Switch
            checked={policy.RequireStrongPasswords}
            onChange={(checked) => onPolicyChange({ ...policy, RequireStrongPasswords: checked })}
            aria-label="Require strong passwords"
          />
        </SettingItem>
        <SettingItem
          title="Login attempts before lockout"
          description="Failed attempts before the account is locked."
        >
          <NumberSelector
            size="sm"
            value={policy.LoginAttemptsBeforeLockout}
            min={0}
            onChange={(next) => onPolicyChange({ ...policy, LoginAttemptsBeforeLockout: next })}
            editLabel="Login attempts before lockout"
          />
        </SettingItem>
        <SettingItem
          title="Lockout duration (minutes)"
          description="How long accounts stay locked (0 = manual unlock only)."
        >
          <NumberSelector
            size="sm"
            value={policy.LockoutDurationMinutes}
            min={0}
            onChange={(next) => onPolicyChange({ ...policy, LockoutDurationMinutes: next })}
            editLabel="Lockout duration in minutes"
          />
        </SettingItem>
      </SettingGroup>

      <h2 className={styles['section-title']}>Maintenance</h2>
      <SettingGroup>
        <SettingItem
          title="Maintenance mode"
          description="Lock out all non-admin users. API will return 503 for non-admins."
        >
          <Switch
            checked={policy.MaintenanceMode}
            onChange={(checked) => onPolicyChange({ ...policy, MaintenanceMode: checked })}
            aria-label="Maintenance mode"
          />
        </SettingItem>
        <SettingItem
          title="Maintenance message"
          description="Message shown to users during maintenance."
        >
          <textarea
            className={`${styles['form-input']} ${styles['form-input-inline']}`}
            rows={2}
            value={policy.MaintenanceMessage}
            onChange={(e) => onPolicyChange({ ...policy, MaintenanceMessage: e.target.value })}
          />
        </SettingItem>
      </SettingGroup>

      <h2 className={styles['section-title']}>Default permissions for new users</h2>
      <SettingGroup>
        {DEFAULT_POLICY_TOGGLES.map(([key, title, description]) => (
          <SettingItem key={key} title={title} description={description}>
            <Switch
              checked={!!policy.DefaultUserPolicy[key]}
              onChange={(checked) => onDefaultPolicyToggle(key, checked)}
              aria-label={title}
            />
          </SettingItem>
        ))}
      </SettingGroup>
    </EnterPanel>
  );
};
