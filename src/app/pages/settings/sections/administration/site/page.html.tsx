import React from 'react';
import { Check, Copy, RefreshCw, Save, Trash2 } from 'lucide-react';
import { EnterPanel, Button, NumberSelector, SelectMenu, Switch } from 'shared/ui';
import { SettingGroup, SettingItem } from '../components';
import type { TemplateProps } from './interfaces/template-props.interface';
import shared from '../shared.module.css';
import styles from './page.module.css';

export const PageTemplate: React.FC<TemplateProps> = ({
  isLoading,
  hasPolicy,
  isSaving,
  showInviteControls,
  registrationMode,
  registrationModeDescription,
  registrationModeOptions,
  registrationModeMenuTitle,
  onRegistrationModeChange,
  allowPasswordLogin,
  onAllowPasswordLoginChange,
  domainsText,
  onDomainsTextChange,
  inviteTtlHours,
  onInviteTtlHoursChange,
  inviteMaxUses,
  onInviteMaxUsesChange,
  inviteSummaryDescription,
  headerInviteDisplayUrl,
  headerInviteCopied,
  canCopyHeaderInvite,
  onCopyHeaderInvite,
  onRegenerateInvite,
  isRegeneratingInvite,
  showInviteList,
  inviteRows,
  requireStrongPasswords,
  onRequireStrongPasswordsChange,
  loginAttemptsBeforeLockout,
  onLoginAttemptsChange,
  lockoutDurationMinutes,
  onLockoutDurationChange,
  maintenanceMode,
  onMaintenanceModeChange,
  maintenanceMessage,
  onMaintenanceMessageChange,
  defaultPolicyToggles,
  onSave,
}) => {
  if (isLoading || !hasPolicy) {
    return <p className={shared['admin__empty']}>Loading site policy...</p>;
  }

  return (
    <EnterPanel animation="fade" className={shared['admin__pane']}>
      <div className={shared['admin__page-header']}>
        <div className={shared['admin__page-header-main']}>
          <h1 className={shared['admin__page-title']}>Site Policy</h1>
          <p className={shared['admin__page-subtitle']}>
            Global rules, registration limits, and security defaults.
          </p>
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

      <h2 className={shared['admin__section-title']}>Registration & access</h2>
      <SettingGroup>
        <SettingItem title="Registration mode" description={registrationModeDescription}>
          <SelectMenu
            className={styles['page__form-input--inline']}
            value={registrationMode}
            options={registrationModeOptions}
            onChange={onRegistrationModeChange}
            variant="field"
            menuTitle={registrationModeMenuTitle}
            aria-label="Registration mode"
          />
        </SettingItem>
        <SettingItem
          title="Allow password login"
          description="Permit signing in with email and password."
        >
          <Switch
            checked={allowPasswordLogin}
            onChange={onAllowPasswordLoginChange}
            aria-label="Allow password login"
          />
        </SettingItem>
        <SettingItem
          title="Allowed email domains"
          description="Comma-separated allowlist (empty = all domains permitted)."
        >
          <input
            className={`${shared['admin__form-input']} ${styles['page__form-input--inline']}`}
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
                value={inviteTtlHours}
                min={1}
                max={8760}
                onChange={onInviteTtlHoursChange}
                editLabel="Invite link lifetime in hours"
              />
            </SettingItem>
            <SettingItem
              title="Max signups per invite"
              description="After this many successful signups, the invite is marked completed."
            >
              <NumberSelector
                size="sm"
                value={inviteMaxUses}
                min={1}
                max={1000}
                onChange={onInviteMaxUsesChange}
                editLabel="Max signups per invite"
              />
            </SettingItem>
            <SettingItem title="Registration invite link" description={inviteSummaryDescription}>
              <div className={styles['page__invite']}>
                <div className={styles['page__invite-url']}>
                  <span className={styles['page__invite-url-text']} aria-label="Registration invite URL">
                    {headerInviteDisplayUrl}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconOnly
                    className={styles['page__invite-copy']}
                    onClick={onCopyHeaderInvite}
                    disabled={!canCopyHeaderInvite}
                    aria-label={headerInviteCopied ? 'Copied' : 'Copy invite link'}
                    title={headerInviteCopied ? 'Copied' : 'Copy invite link'}
                  >
                    {headerInviteCopied ? (
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

                {showInviteList && (
                  <ul className={styles['page__invite-list']} aria-label="Generated invite links">
                    {inviteRows.map((row) => (
                      <li key={row.id} className={styles['page__invite-item']}>
                        <div className={styles['page__invite-main']}>
                          <div className={styles['page__invite-meta']}>
                            <span className={row.statusClassName}>{row.statusLabel}</span>
                            <span className={styles['page__invite-expires']}>{row.expiresLabel}</span>
                          </div>
                          <div className={styles['page__invite-url']}>
                            <span className={styles['page__invite-url-text']}>{row.displayUrl}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              iconOnly
                              className={styles['page__invite-copy']}
                              onClick={row.onCopy}
                              disabled={!row.canCopy}
                              aria-label={row.copied ? 'Copied' : `Copy invite link ${row.id}`}
                              title={row.copied ? 'Copied' : 'Copy invite link'}
                            >
                              {row.copied ? (
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
                              className={styles['page__invite-delete']}
                              onClick={row.onDelete}
                              disabled={row.isDeleting}
                              isLoading={row.isDeleting}
                              aria-label={`Delete invite link ${row.id}`}
                              title="Delete invite link"
                            >
                              <Trash2 size={16} aria-hidden />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SettingItem>
          </>
        )}
      </SettingGroup>

      <h2 className={shared['admin__section-title']}>Security defaults</h2>
      <SettingGroup>
        <SettingItem
          title="Require strong passwords"
          description="Require at least 8 characters with a letter and a number. When off, passwords only need 6 characters."
        >
          <Switch
            checked={requireStrongPasswords}
            onChange={onRequireStrongPasswordsChange}
            aria-label="Require strong passwords"
          />
        </SettingItem>
        <SettingItem
          title="Login attempts before lockout"
          description="Failed attempts before the account is locked."
        >
          <NumberSelector
            size="sm"
            value={loginAttemptsBeforeLockout}
            min={0}
            onChange={onLoginAttemptsChange}
            editLabel="Login attempts before lockout"
          />
        </SettingItem>
        <SettingItem
          title="Lockout duration (minutes)"
          description="How long accounts stay locked (0 = manual unlock only)."
        >
          <NumberSelector
            size="sm"
            value={lockoutDurationMinutes}
            min={0}
            onChange={onLockoutDurationChange}
            editLabel="Lockout duration in minutes"
          />
        </SettingItem>
      </SettingGroup>

      <h2 className={shared['admin__section-title']}>Maintenance</h2>
      <SettingGroup>
        <SettingItem
          title="Maintenance mode"
          description="Lock out all non-admin users. API will return 503 for non-admins."
        >
          <Switch
            checked={maintenanceMode}
            onChange={onMaintenanceModeChange}
            aria-label="Maintenance mode"
          />
        </SettingItem>
        <SettingItem
          title="Maintenance message"
          description="Message shown to users during maintenance."
        >
          <textarea
            className={`${shared['admin__form-input']} ${styles['page__form-input--inline']}`}
            rows={2}
            value={maintenanceMessage}
            onChange={(e) => onMaintenanceMessageChange(e.target.value)}
          />
        </SettingItem>
      </SettingGroup>

      <h2 className={shared['admin__section-title']}>Default permissions for new users</h2>
      <SettingGroup>
        {defaultPolicyToggles.map((toggle) => (
          <SettingItem key={toggle.key} title={toggle.title} description={toggle.description}>
            <Switch
              checked={toggle.checked}
              onChange={toggle.onChange}
              aria-label={toggle.title}
            />
          </SettingItem>
        ))}
      </SettingGroup>
    </EnterPanel>
  );
};
