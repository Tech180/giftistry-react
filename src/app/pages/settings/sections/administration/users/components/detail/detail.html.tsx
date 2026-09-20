import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { EnterPanel, Button, Switch } from 'shared/ui';
import { SettingGroup, SettingItem } from '../../../components';
import { DetailTemplateProps } from './interfaces/template-props.interface';
import shared from '../../../shared.module.css';
import styles from './detail.module.css';

export const DetailTemplate: React.FC<DetailTemplateProps> = ({
  isLoading,
  hasUser,
  usernameLabel,
  emailLabel,
  joinedDisplay,
  metaLine,
  securityDescription,
  fieldsDisabled,
  switchesDisabled,
  paneClassName,
  tabs,
  activeTab,
  activityRows,
  featureToggles,
  canCreateWishlists,
  maxActiveWishlists,
  onCanCreateWishlistsChange,
  onMaxActiveWishlistsChange,
  profileForm,
  policyFlags,
  newPassword,
  isSelf,
  isOwnerReadOnly,
  onTabChange,
  onProfileFormChange,
  onPolicyFlagsChange,
  onNewPasswordChange,
  onSaveProfile,
  onSavePolicy,
  onResetPassword,
  onUnlock,
  onRevokeSessions,
  onDelete,
  canDeleteAccount,
  canTransferOwnership,
  onTransferOwnership,
  isTransferringOwnership,
}) => {
  if (isLoading || !hasUser) {
    return <p className={shared['admin__empty']}>Loading user...</p>;
  }

  return (
    <EnterPanel animation="fade" className={shared['admin__pane']}>
      <div className={styles['detail__back']}>
        <Link className={shared['admin__link']} to="/settings/admin/users">
          <ArrowLeft size={14} aria-hidden />
          Back to users
        </Link>
      </div>
      <div className={shared['admin__page-header']}>
        <div className={shared['admin__page-header-main']}>
          <h1 className={shared['admin__page-title']}>{usernameLabel}</h1>
          <p className={`${shared['admin__page-subtitle']} ${shared['admin__text-muted']}`}>{emailLabel}</p>
          {isOwnerReadOnly && (
            <p className={styles['detail__owner-banner']}>Server owner — view only</p>
          )}
        </div>
        <div className={styles['detail__joined']}>
          <div className={styles['detail__joined-header']}>
            <Calendar size={13} className={styles['detail__joined-icon']} aria-hidden />
            <span>Joined</span>
          </div>
          <span className={styles['detail__joined-date']}>{joinedDisplay}</span>
          <span className={styles['detail__joined-meta']}>{metaLine}</span>
        </div>
      </div>

      <div className={styles['detail__tabs']}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles['detail__tab']} ${activeTab === tab.id ? styles['detail__tab--active'] : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className={paneClassName}>
          <div className={styles['detail__profile']}>
            <div className={styles['detail__profile-fields']}>
              <div className={`${shared['admin__form-field']} ${styles['detail__form-field--profile']}`}>
                <label>Username</label>
                <input
                  className={shared['admin__form-input']}
                  value={profileForm.username}
                  disabled={fieldsDisabled}
                  onChange={(e) => onProfileFormChange({ username: e.target.value })}
                />
              </div>
              <div className={`${shared['admin__form-field']} ${styles['detail__form-field--profile']}`}>
                <label>Email address</label>
                <input
                  className={shared['admin__form-input']}
                  type="email"
                  value={profileForm.email}
                  disabled={fieldsDisabled}
                  onChange={(e) => onProfileFormChange({ email: e.target.value })}
                />
              </div>
              <div className={`${shared['admin__form-row']} ${styles['detail__form-row--profile']}`}>
                <div
                  className={`${shared['admin__form-field']} ${shared['admin__form-field--inline']} ${styles['detail__form-field--profile']}`}
                >
                  <label>First name</label>
                  <input
                    className={shared['admin__form-input']}
                    value={profileForm.firstName}
                    disabled={fieldsDisabled}
                    onChange={(e) => onProfileFormChange({ firstName: e.target.value })}
                  />
                </div>
                <div
                  className={`${shared['admin__form-field']} ${shared['admin__form-field--inline']} ${styles['detail__form-field--profile']}`}
                >
                  <label>Last name</label>
                  <input
                    className={shared['admin__form-input']}
                    value={profileForm.lastName}
                    disabled={fieldsDisabled}
                    onChange={(e) => onProfileFormChange({ lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className={styles['detail__bio']}>
              <div className={`${shared['admin__form-field']} ${styles['detail__form-field--bio']}`}>
                <label>Bio</label>
                <textarea
                  className={`${shared['admin__form-input']} ${styles['detail__bio-input']}`}
                  value={profileForm.bio}
                  disabled={fieldsDisabled}
                  onChange={(e) => onProfileFormChange({ bio: e.target.value })}
                />
              </div>
            </div>
          </div>
          {!isOwnerReadOnly && (
            <div className={`${shared['admin__actions']} ${styles['detail__actions--split']}`}>
              <div>
                {canDeleteAccount && (
                  <Button variant="danger" onClick={onDelete}>
                    Delete account
                  </Button>
                )}
              </div>
              <div className={styles['detail__actions-group']}>
                {canTransferOwnership && (
                  <Button
                    variant="secondary"
                    onClick={onTransferOwnership}
                    isLoading={isTransferringOwnership}
                  >
                    Transfer ownership
                  </Button>
                )}
                {isSelf && (
                  <Button variant="primary" onClick={onSaveProfile}>
                    Save profile
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className={paneClassName}>
          <SettingGroup>
            <SettingItem
              title="Administrator access"
              description={
                <>
                  Grant full access to all settings and data.
                  {isSelf && (
                    <span style={{ color: 'var(--warning)' }}> (Disabled for your own account)</span>
                  )}
                </>
              }
            >
              <Switch
                checked={policyFlags.isAdmin}
                disabled={isSelf || switchesDisabled}
                onChange={(checked) => onPolicyFlagsChange({ isAdmin: checked })}
                aria-label="Administrator access"
              />
            </SettingItem>
            <SettingItem
              title="Disable account"
              description="Prevent the user from logging in without deleting their data."
            >
              <Switch
                checked={policyFlags.isDisabled}
                disabled={isSelf || switchesDisabled}
                onChange={(checked) => onPolicyFlagsChange({ isDisabled: checked })}
                aria-label="Disable account"
              />
            </SettingItem>
            <SettingItem
              title="Hidden from friend search"
              description="Exclude this user from friend discovery results."
            >
              <Switch
                checked={policyFlags.isHidden}
                disabled={switchesDisabled}
                onChange={(checked) => onPolicyFlagsChange({ isHidden: checked })}
                aria-label="Hidden from friend search"
              />
            </SettingItem>
            <SettingItem
              title="Require password change"
              description="Force a password reset on next login."
            >
              <Switch
                checked={policyFlags.forcePasswordChange}
                disabled={switchesDisabled}
                onChange={(checked) => onPolicyFlagsChange({ forcePasswordChange: checked })}
                aria-label="Require password change"
              />
            </SettingItem>
          </SettingGroup>

          <h2 className={shared['admin__section-title']}>Feature flags</h2>
          <SettingGroup>
            <SettingItem
              title="Create wishlists"
              description="Allow user to create and manage their own lists."
            >
              <Switch
                checked={canCreateWishlists}
                disabled={switchesDisabled}
                onChange={onCanCreateWishlistsChange}
                aria-label="Can create wishlists"
              />
            </SettingItem>
            <SettingItem
              title="Max active wishlists"
              description="Maximum active wishlists (0 = unlimited)."
              layout="column"
            >
              <input
                className={shared['admin__form-input']}
                type="number"
                min={0}
                value={maxActiveWishlists}
                disabled={switchesDisabled}
                onChange={(e) => onMaxActiveWishlistsChange(Number(e.target.value))}
              />
            </SettingItem>
            {featureToggles.map((toggle) => (
              <SettingItem key={toggle.key} title={toggle.title} description={toggle.description}>
                <Switch
                  checked={toggle.checked}
                  disabled={toggle.disabled}
                  onChange={toggle.onChange}
                  aria-label={toggle.title}
                />
              </SettingItem>
            ))}
          </SettingGroup>
          {!isOwnerReadOnly && (
            <div className={shared['admin__actions']}>
              <Button variant="primary" onClick={onSavePolicy}>
                Update permissions
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'security' && (
        <div className={paneClassName}>
          <SettingGroup>
            <SettingItem title="Authentication status" description={securityDescription}>
              {!isOwnerReadOnly ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button variant="secondary" size="sm" onClick={onRevokeSessions}>
                    Revoke sessions
                  </Button>
                  <Button variant="secondary" size="sm" onClick={onUnlock}>
                    Unlock
                  </Button>
                </div>
              ) : (
                <span className={shared['admin__text-muted']}>View only</span>
              )}
            </SettingItem>
          </SettingGroup>

          <h2 className={shared['admin__section-title']}>Force password reset</h2>
          <div className={shared['admin__form-field']}>
            <label>New password</label>
            <input
              className={shared['admin__form-input']}
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              minLength={6}
              placeholder="Leave blank to generate"
              disabled={isOwnerReadOnly}
            />
          </div>
          {!isOwnerReadOnly && (
            <div className={shared['admin__actions']}>
              <Button variant="primary" onClick={onResetPassword} disabled={!newPassword}>
                Reset password
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={styles['detail__pane']}>
          <div className={shared['admin__table-wrap']}>
            {activityRows.length === 0 ? (
              <p className={shared['admin__empty']}>No activity recorded.</p>
            ) : (
              <table className={shared['admin__table']}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activityRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.action}</td>
                      <td className={shared['admin__text-muted']}>{row.timestampLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </EnterPanel>
  );
};
