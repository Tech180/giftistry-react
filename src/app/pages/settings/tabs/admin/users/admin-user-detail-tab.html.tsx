import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { EnterPanel, Button, Switch } from 'shared/ui';
import { getJoinedDate } from 'shared/utils/get-initials.util';
import type { GiftistryUserPolicy } from 'features/admin';
import { SettingGroup, SettingItem } from '../components';
import {
  AdminUserDetailTabKey,
  AdminUserDetailTabTemplateProps,
} from './interfaces/admin-user-detail-tab-template-props.interface';
import styles from '../admin.shared.module.css';

const DETAIL_TABS: AdminUserDetailTabKey[] = ['profile', 'permissions', 'security', 'activity'];

const PERMISSION_TOGGLES: [keyof GiftistryUserPolicy, string, string][] = [
  ['CanUseComments', 'Can use comments', 'Allow commenting on wishlists.'],
  ['CanUseAiFeatures', 'Can use AI features', 'Allow AI-powered suggestions and parsing.'],
  ['CanSharePublicLinks', 'Public sharing', 'Allow generating unauthenticated links.'],
  ['CanUploadImages', 'Can upload images', 'Allow image uploads on lists and comments.'],
  ['CanSendFriendRequests', 'Can send friend requests', 'Allow sending friend requests.'],
  ['CanUseCustomThemes', 'Can use custom themes', 'Allow personal theme customization.'],
];

export const AdminUserDetailTabTemplate: React.FC<AdminUserDetailTabTemplateProps> = ({
  isLoading,
  user,
  activity,
  activeTab,
  profileForm,
  policyFlags,
  policy,
  newPassword,
  isSelf,
  onTabChange,
  onProfileFormChange,
  onPolicyFlagsChange,
  onPolicyChange,
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
  if (isLoading || !user) {
    return <p className={styles.empty}>Loading user...</p>;
  }

  const joinedLabel = user.CreatedAt ? getJoinedDate(user.CreatedAt) : 'Unknown';
  const joinedDisplay = joinedLabel.startsWith('Joined ') ? joinedLabel.slice(7) : joinedLabel;

  return (
    <EnterPanel animation="fade" className={styles['tab-pane']}>
      <div className={styles['back-row']}>
        <Link className={styles['link-btn']} to="/settings/admin/users">
          <ArrowLeft size={14} aria-hidden />
          Back to users
        </Link>
      </div>
      <div className={styles['page-header']}>
        <div className={styles['page-header-main']}>
          <h1 className={styles['page-title']}>@{user.Username}</h1>
          <p className={`${styles['page-subtitle']} ${styles['text-muted']}`}>{user.Email}</p>
        </div>
        <div className={styles['joined-badge']}>
          <div className={styles['joined-badge-header']}>
            <Calendar size={13} className={styles['joined-icon']} aria-hidden />
            <span>Joined</span>
          </div>
          <span className={styles['joined-date']}>{joinedDisplay}</span>
          <span className={styles['joined-meta']}>
            {user.WishlistCount ?? 0} lists · {user.FriendsCount ?? 0} friends
            {' · '}
            Last login: {user.LastLoginAt ? new Date(user.LastLoginAt).toLocaleString() : '—'}
            {' · '}
            Last online: {user.LastOnline ? new Date(user.LastOnline).toLocaleString() : '—'}
          </span>
        </div>
      </div>

      <div className={styles['tab-nav']}>
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`${styles['tab-btn']} ${activeTab === tab ? styles['tab-btn-active'] : ''}`}
            onClick={() => onTabChange(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className={activeTab === 'profile' ? styles['detail-pane-active'] : styles['detail-pane']}>
          <div className={styles['profile-layout']}>
            <div className={styles['profile-fields']}>
              <div className={styles['form-field']}>
                <label>Username</label>
                <input
                  className={styles['form-input']}
                  value={profileForm.username}
                  disabled={!isSelf}
                  onChange={(e) => onProfileFormChange({ username: e.target.value })}
                />
              </div>
              <div className={styles['form-field']}>
                <label>Email address</label>
                <input
                  className={styles['form-input']}
                  type="email"
                  value={profileForm.email}
                  disabled={!isSelf}
                  onChange={(e) => onProfileFormChange({ email: e.target.value })}
                />
              </div>
              <div className={styles['form-row-inline']}>
                <div className={styles['form-field']}>
                  <label>First name</label>
                  <input
                    className={styles['form-input']}
                    value={profileForm.firstName}
                    disabled={!isSelf}
                    onChange={(e) => onProfileFormChange({ firstName: e.target.value })}
                  />
                </div>
                <div className={styles['form-field']}>
                  <label>Last name</label>
                  <input
                    className={styles['form-input']}
                    value={profileForm.lastName}
                    disabled={!isSelf}
                    onChange={(e) => onProfileFormChange({ lastName: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className={styles['profile-bio']}>
              <div className={styles['form-field']}>
                <label>Bio</label>
                <textarea
                  className={`${styles['form-input']} ${styles['profile-bio-textarea']}`}
                  value={profileForm.bio}
                  disabled={!isSelf}
                  onChange={(e) => onProfileFormChange({ bio: e.target.value })}
                />
              </div>
            </div>
          </div>
          <SettingGroup>
            <SettingItem
              title="Email verified"
              description="Mark this account as having a verified email address."
            >
              <Switch
                checked={profileForm.emailVerified}
                onChange={(checked) => onProfileFormChange({ emailVerified: checked })}
                aria-label="Email verified"
              />
            </SettingItem>
          </SettingGroup>
          <div className={`${styles['actions-row']} ${styles['actions-row-split']}`}>
            <div>
              {canDeleteAccount && (
                <Button variant="danger" onClick={onDelete}>Delete account</Button>
              )}
            </div>
            <div className={styles['actions-row-group']}>
              {canTransferOwnership && (
                <Button
                  variant="secondary"
                  onClick={onTransferOwnership}
                  isLoading={isTransferringOwnership}
                >
                  Transfer ownership
                </Button>
              )}
              <Button variant="primary" onClick={onSaveProfile}>Save profile</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className={styles['detail-pane-active']}>
          <SettingGroup>
            <SettingItem
              title="Administrator access"
              description={
                <>
                  Grant full access to all settings and data.
                  {isSelf && <span style={{ color: 'var(--warning)' }}> (Disabled for your own account)</span>}
                </>
              }
            >
              <Switch
                checked={policyFlags.isAdmin}
                disabled={isSelf}
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
                disabled={isSelf}
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
                onChange={(checked) => onPolicyFlagsChange({ forcePasswordChange: checked })}
                aria-label="Require password change"
              />
            </SettingItem>
          </SettingGroup>

          <h2 className={styles['section-title']}>Feature flags</h2>
          <SettingGroup>
            <SettingItem
              title="Create wishlists"
              description="Allow user to create and manage their own lists."
            >
              <Switch
                checked={policy.CanCreateWishlists}
                onChange={(checked) => onPolicyChange('CanCreateWishlists', checked)}
                aria-label="Can create wishlists"
              />
            </SettingItem>
            <SettingItem
              title="Max active wishlists"
              description="Maximum active wishlists (0 = unlimited)."
              layout="column"
            >
              <input
                className={styles['form-input']}
                type="number"
                min={0}
                value={policy.MaxActiveWishlists}
                onChange={(e) => onPolicyChange('MaxActiveWishlists', Number(e.target.value))}
              />
            </SettingItem>
            {PERMISSION_TOGGLES.map(([key, title, description]) => (
              <SettingItem key={key} title={title} description={description}>
                <Switch
                  checked={!!policy[key]}
                  onChange={(checked) => onPolicyChange(key, checked)}
                  aria-label={title}
                />
              </SettingItem>
            ))}
          </SettingGroup>
          <div className={styles['actions-row']}>
            <Button variant="primary" onClick={onSavePolicy}>Update permissions</Button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className={styles['detail-pane-active']}>
          <SettingGroup>
            <SettingItem
              title="Authentication status"
              description={`2FA: ${user.TwoFactorEnabled ? 'Enabled' : 'Disabled'} · Passkeys: ${user.PasskeyCount ?? 0} · Failed logins: ${user.FailedLoginCount ?? 0}`}
            >
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Button variant="secondary" size="sm" onClick={onRevokeSessions}>Revoke sessions</Button>
                <Button variant="secondary" size="sm" onClick={onUnlock}>Unlock</Button>
              </div>
            </SettingItem>
          </SettingGroup>

          <h2 className={styles['section-title']}>Force password reset</h2>
          <div className={styles['form-field']}>
            <label>New password</label>
            <input
              className={styles['form-input']}
              type="password"
              value={newPassword}
              onChange={(e) => onNewPasswordChange(e.target.value)}
              minLength={6}
              placeholder="Leave blank to generate"
            />
          </div>
          <div className={styles['actions-row']}>
            <Button variant="primary" onClick={onResetPassword} disabled={!newPassword}>
              Reset password
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className={styles['detail-pane-active']}>
          <div className={styles['table-wrap']}>
            {activity.length === 0 ? (
              <p className={styles.empty}>No activity recorded.</p>
            ) : (
              <table className={styles['linear-table']}>
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((entry) => (
                    <tr key={entry.Id}>
                      <td>{entry.Action}</td>
                      <td className={styles['text-muted']}>
                        {entry.CreatedAt ? new Date(entry.CreatedAt).toLocaleString() : '—'}
                      </td>
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
