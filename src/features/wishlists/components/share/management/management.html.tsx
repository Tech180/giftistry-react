import React from 'react';
import { X } from 'lucide-react';
import { SelectMenu } from 'shared/ui';
import { getInitialsFromDisplayName } from 'shared/utils/get-initials.util';
import {
  SHARE_ROLE_MENU_TITLE,
  SHARE_ROLE_OPTIONS,
} from 'features/wishlists/constants/share-role-options.constant';
import { DemotionCaution } from './components/demotion-caution/demotion-caution.component';
import { TemplateProps } from './interfaces/template-props.interface';
import styles from './management.module.css';
import fabStyles from '../fab-panel/fab-panel.module.css';

export const ShareManagementTemplate: React.FC<TemplateProps> = ({
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
      <DemotionCaution
        title = {
          cautionTitle
        }
        description = {
          cautionDescription
        }
        proceedPrompt = {
          cautionProceedPrompt
        }
        displayName = {
          pendingShare ? getDisplayName(pendingShare) : null
        }
        username = {
          pendingShare?.Username ?? null
        }
        avatar = {
          pendingShare?.Avatar ?? null
        }
        error = {
          error
        }
        isConfirming = {
          updatingId === pendingDemotionShareId
        }
        onConfirm = {
          onConfirmDemotion
        }
        onCancel = {
          onCancelDemotion
        }
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
            const initials = getInitialsFromDisplayName(displayName);

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
                    value = {
                      share.Role
                    }
                    options = {
                      SHARE_ROLE_OPTIONS
                    }
                    onChange = {
                      (next) =>
                                            onRoleChange(share.Id, next as 'viewer' | 'collaborator')
                    }
                    disabled = {
                      updatingId === share.Id
                    }
                    variant = {
                      'compact'
                    }
                    menuTitle = {
                      SHARE_ROLE_MENU_TITLE
                    }
                    aria-label = {
                      `Role for ${displayName}`
                    }
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
        const initials = getInitialsFromDisplayName(displayName);

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
                  value = {
                    share.Role
                  }
                  options = {
                    SHARE_ROLE_OPTIONS
                  }
                  onChange = {
                    (next) =>
                                        onRoleChange(share.Id, next as 'viewer' | 'collaborator')
                  }
                  disabled = {
                    updatingId === share.Id
                  }
                  variant = {
                    'compact'
                  }
                  menuTitle = {
                    SHARE_ROLE_MENU_TITLE
                  }
                  aria-label = {
                    `Role for ${displayName}`
                  }
                />
                <button
                  type="button"
                  className={styles['remove-btn']}
                  onClick={() => onRemove(share.Id)}
                  disabled={removingId === share.Id}
                  title="Remove access"
                >
                  <X
                    size = {
                      14
                    }
                  />
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
