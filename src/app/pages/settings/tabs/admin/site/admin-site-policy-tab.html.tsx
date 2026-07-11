import React from 'react';
import { EnterPanel, Button, Switch } from 'shared/ui';
import type { SitePolicy } from 'features/admin';
import { DEFAULT_USER_POLICY } from 'features/admin';
import { SettingGroup, SettingItem } from '../components';
import { AdminSitePolicyTabTemplateProps } from './interfaces/admin-site-policy-tab-template-props.interface';
import styles from '../admin.shared.module.css';

const REGISTRATION_LABELS: Record<SitePolicy['RegistrationMode'], string> = {
  open: 'Open — anyone can register',
  invite_only: 'Invite only — registration requires an invite',
  disabled: 'Disabled — no new registrations',
};

const DEFAULT_POLICY_TOGGLES: [keyof typeof DEFAULT_USER_POLICY, string, string][] = [
  ['CanCreateWishlists', 'Create wishlists', 'Allow new users to create wishlists.'],
  ['CanUseComments', 'Use comments', 'Allow commenting on wishlists.'],
  ['CanUseAiFeatures', 'Use AI features', 'Allow AI-powered features.'],
  ['CanSharePublicLinks', 'Public sharing', 'Allow public link generation.'],
  ['CanUploadImages', 'Upload images', 'Allow image uploads.'],
  ['CanSendFriendRequests', 'Send friend requests', 'Allow friend requests.'],
  ['CanUseCustomThemes', 'Use custom themes', 'Allow theme customization.'],
];

export const AdminSitePolicyTabTemplate: React.FC<AdminSitePolicyTabTemplateProps> = ({
  isLoading,
  policy,
  domainsText,
  isSaving,
  onPolicyChange,
  onDomainsTextChange,
  onDefaultPolicyToggle,
  onSave,
}) => {
  if (isLoading || !policy) {
    return <p className={styles.empty}>Loading site policy...</p>;
  }

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['page-header']}>
        <h1 className={styles['page-title']}>Site Policy</h1>
        <p className={styles['page-subtitle']}>Global rules, registration limits, and security defaults.</p>
      </div>

      <h2 className={styles['section-title']}>Registration & access</h2>
      <SettingGroup>
        <SettingItem
          title="Registration mode"
          description={REGISTRATION_LABELS[policy.RegistrationMode]}
          layout="column"
        >
          <select
            className={styles['form-input']}
            value={policy.RegistrationMode}
            onChange={(e) =>
              onPolicyChange({ ...policy, RegistrationMode: e.target.value as SitePolicy['RegistrationMode'] })
            }
          >
            <option value="open">Open</option>
            <option value="invite_only">Invite only</option>
            <option value="disabled">Disabled</option>
          </select>
        </SettingItem>
        <SettingItem
          title="Require email verification"
          description="Accounts must verify email before accessing the platform."
        >
          <Switch
            checked={policy.RequireEmailVerification}
            onChange={(checked) => onPolicyChange({ ...policy, RequireEmailVerification: checked })}
            aria-label="Require email verification"
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
          layout="column"
        >
          <input
            className={styles['form-input']}
            value={domainsText}
            onChange={(e) => onDomainsTextChange(e.target.value)}
            placeholder="example.com, company.org"
          />
        </SettingItem>
      </SettingGroup>

      <h2 className={styles['section-title']}>Security defaults</h2>
      <SettingGroup>
        <SettingItem
          title="Login attempts before lockout"
          description="Failed attempts before the account is locked."
          layout="column"
        >
          <input
            className={styles['form-input']}
            type="number"
            min={0}
            value={policy.LoginAttemptsBeforeLockout}
            onChange={(e) => onPolicyChange({ ...policy, LoginAttemptsBeforeLockout: Number(e.target.value) })}
          />
        </SettingItem>
        <SettingItem
          title="Lockout duration (minutes)"
          description="How long accounts stay locked (0 = manual unlock only)."
          layout="column"
        >
          <input
            className={styles['form-input']}
            type="number"
            min={0}
            value={policy.LockoutDurationMinutes}
            onChange={(e) => onPolicyChange({ ...policy, LockoutDurationMinutes: Number(e.target.value) })}
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
          layout="column"
        >
          <textarea
            className={styles['form-input']}
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

      <div className={styles['actions-row']}>
        <Button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save site policy'}
        </Button>
      </div>
    </EnterPanel>
  );
};
