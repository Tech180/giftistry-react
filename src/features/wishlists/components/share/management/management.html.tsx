import React from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { Button, SelectMenu, UserAvatar } from 'shared/ui';
import {
  SHARE_ROLE_MENU_TITLE,
  SHARE_ROLE_OPTIONS,
} from 'features/wishlists/constants/share-role-options.constant';
import type { DemotionCautionViewProps } from './interfaces/demotion-caution-view-props.interface';
import { ManagementTemplateProps } from './interfaces/management.interface';
import styles from './management.module.css';
import fabStyles from '../share-fab-panel/share-fab-panel.module.css';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

const DemotionCautionView: React.FC<DemotionCautionViewProps> = ({
  title,
  description,
  proceedPrompt,
  displayName,
  username,
  avatar,
  error,
  isConfirming,
  onConfirm,
  onCancel,
}) => {
  const initials = displayName ? getInitials(displayName) : '?';

  return (
    <div className={styles.caution} role="region" aria-labelledby="role-demotion-caution-title">
      <div className={styles['caution-body']}>
        <div className={styles['caution-header']}>
          <ShieldAlert className={styles['caution-icon']} aria-hidden />
          <h3 id="role-demotion-caution-title" className={styles['caution-title']}>
            {title}
          </h3>
        </div>
        {displayName && (
          <div className={styles['caution-person']}>
            <UserAvatar
              avatar={avatar}
              alt={displayName}
              initials={initials || displayName[0]?.toUpperCase() || '?'}
              className={styles['caution-avatar']}
              imageClassName={styles['caution-avatar-img']}
              initialsClassName={styles['caution-avatar-initials']}
            />
            <div className={styles['caution-person-text']}>
              <p className={styles['caution-subject']}>{displayName}</p>
              {username && <p className={styles['caution-username']}>@{username}</p>}
            </div>
          </div>
        )}
        <p className={styles['caution-desc']}>{description}</p>
        {error && <p className={styles['error-text']}>{error}</p>}
      </div>
      <div className={styles['caution-footer']}>
        <p className={styles['caution-proceed-prompt']}>{proceedPrompt}</p>
        <div className={styles['caution-actions']}>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={isConfirming}
            isLoading={isConfirming}
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ShareManagementTemplate: React.FC<ManagementTemplateProps> = ({
  variant = 'classic',
  ownerInfo,
  shares,
  isOwner,
  isLoading,
  error,
  updatingId,
  removingId,
  pendingDemotionShareId,
  cautionTitle,
  cautionDescription,
  cautionProceedPrompt,
  onRoleChange,
  onRemove,
  onConfirmDemotion,
  onCancelDemotion,
  getDisplayName,
}) => {
  if (pendingDemotionShareId) {
    const pendingShare = shares.find((share) => share.Id === pendingDemotionShareId) ?? null;
    return (
      <DemotionCautionView
        title={cautionTitle}
        description={cautionDescription}
        proceedPrompt={cautionProceedPrompt}
        displayName={pendingShare ? getDisplayName(pendingShare) : null}
        username={pendingShare?.Username ?? null}
        avatar={pendingShare?.Avatar ?? null}
        error={error}
        isConfirming={updatingId === pendingDemotionShareId}
        onConfirm={onConfirmDemotion}
        onCancel={onCancelDemotion}
      />
    );
  }

  if (variant === 'compact') {
    if (isLoading) {
      return <p className={fabStyles.compactStatus}>Loading collaborators...</p>;
    }

    if (error) {
      return <p className={fabStyles.compactAlert}>{error}</p>;
    }

    return (
      <ul className={fabStyles.compactList}>
        {ownerInfo && (
          <li className={fabStyles.compactListItem}>
            <div className={fabStyles.compactUserInfo}>
              <div className={`${fabStyles.compactAvatar} ${fabStyles.compactAvatarOwner}`}>
                {ownerInfo.initials}
              </div>
              <div className={fabStyles.compactUserDetails}>
                <span className={fabStyles.compactUserName}>{ownerInfo.displayName} (You)</span>
                <span className={fabStyles.compactUserSub}>Owner</span>
              </div>
            </div>
          </li>
        )}
        {shares.length === 0 && !ownerInfo ? (
          <li className={fabStyles.compactEmpty}>No collaborators yet.</li>
        ) : (
          shares.map((share) => {
            const displayName = getDisplayName(share);
            const initials = getInitials(displayName);

            return (
              <li key={share.Id} className={fabStyles.compactListItem}>
                <div className={fabStyles.compactUserInfo}>
                  <div className={fabStyles.compactAvatar}>{initials}</div>
                  <div className={fabStyles.compactUserDetails}>
                    <span className={fabStyles.compactUserName}>{displayName}</span>
                    <span className={fabStyles.compactUserSub}>
                      {share.Username ? `@${share.Username}` : share.Email || 'Collaborator'}
                    </span>
                  </div>
                </div>
                {isOwner ? (
                  <SelectMenu
                    value={share.Role}
                    options={SHARE_ROLE_OPTIONS}
                    onChange={(next) =>
                      onRoleChange(share.Id, next as 'viewer' | 'collaborator')
                    }
                    disabled={updatingId === share.Id}
                    variant="compact"
                    menuTitle={SHARE_ROLE_MENU_TITLE}
                    aria-label={`Role for ${displayName}`}
                  />
                ) : (
                  <span className={fabStyles.compactUserSub}>
                    {share.Role === 'viewer' ? 'Can View' : 'Can Edit'}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>
    );
  }

  if (isLoading) {
    return <p className={styles['status-text']}>Loading collaborators...</p>;
  }

  if (error) {
    return <p className={styles['error-text']}>{error}</p>;
  }

  if (shares.length === 0) {
    return <p className={styles['empty-text']}>No collaborators yet. Share this wishlist to get started.</p>;
  }

  return (
    <ul className={styles.list}>
      {shares.map((share) => {
        const displayName = getDisplayName(share);
        const initials = getInitials(displayName);

        return (
          <li key={share.Id} className={styles['list-item']}>
            <div className={styles['user-info']}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles['user-details']}>
                <div className={styles['user-name-group']}>
                  <span className={styles['user-name']}>{displayName}</span>
                </div>
                <span className={styles.email}>{share.Email || 'No email'}</span>
              </div>
            </div>
            {isOwner ? (
              <div className={styles.actions}>
                <SelectMenu
                  value={share.Role}
                  options={SHARE_ROLE_OPTIONS}
                  onChange={(next) =>
                    onRoleChange(share.Id, next as 'viewer' | 'collaborator')
                  }
                  disabled={updatingId === share.Id}
                  variant="compact"
                  menuTitle={SHARE_ROLE_MENU_TITLE}
                  aria-label={`Role for ${displayName}`}
                />
                <button
                  type="button"
                  className={styles['remove-btn']}
                  onClick={() => onRemove(share.Id)}
                  disabled={removingId === share.Id}
                  title="Remove access"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <span className={styles['role-badge']}>
                {share.Role === 'viewer' ? 'Can View' : 'Can Edit'}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
