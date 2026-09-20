import React from 'react';
import { Search, AlertCircle, Check } from 'lucide-react';
import { Button, SelectMenu } from 'shared/ui';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import {
  SHARE_ROLE_MENU_TITLE,
  SHARE_ROLE_OPTIONS,
} from 'features/wishlists/constants/share-role-options.constant';
import { TemplateProps } from './interfaces/template-props.interface';
import styles from './friends.module.css';

export const FriendsTabTemplate: React.FC<TemplateProps> = ({
  variant = 'classic',
  search,
  setSearch,
  roles,
  setRole,
  loadingIds,
  errorMsg,
  successMsg,
  filteredFriends,
  handleShareSingle,
  getInitials,
}) => {
  if (variant === 'compact') {
    return (
      <div className={styles.compactRoot}>
        {errorMsg && <p className={styles.compactAlert}>{errorMsg}</p>}
        {successMsg && (
          <p className={styles.compactStatus} style={{ color: 'var(--success)' }}>
            {successMsg}
          </p>
        )}

        <div className={styles.searchWrap}>
          <Search
            size = {
              14
            }
            className = {
              styles.searchIcon
            }
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search friends or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
            aria-label="Search friends"
          />
        </div>

        {filteredFriends.length === 0 ? (
          <p className={styles.compactEmpty}>No friends found to invite.</p>
        ) : (
          <ul className={styles.compactList}>
            {filteredFriends.map((friend) => {
              const displayName = getDisplayName(friend);
              const initials = getInitials(friend.FirstName, friend.LastName, friend.Username);

              return (
                <li key={friend.UserId} className={styles.compactListItem}>
                  <div className={styles.compactUserInfo}>
                    <div className={styles.compactAvatar}>{initials}</div>
                    <div className={styles.compactUserDetails}>
                      <span className={styles.compactUserName}>{displayName}</span>
                      <span className={styles.compactUserSub}>
                        {friend.Email || `@${friend.Username}`}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant = {
                      'secondary'
                    }
                    size = {
                      'sm'
                    }
                    onClick = {
                      () => handleShareSingle(friend.UserId)
                    }
                    isLoading = {
                      loadingIds[friend.UserId]
                    }
                  >
                    Invite
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={styles['friends-tab']}>
      {errorMsg && (
        <div className={`${styles.alert} ${styles['alert-error']}`}>
          <AlertCircle
            size = {
              16
            }
          />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className={`${styles.alert} ${styles['alert-success']}`}>
          <Check
            size = {
              16
            }
          />
          <span>{successMsg}</span>
        </div>
      )}

      <div className={styles['search-container']}>
        <Search
          size = {
            14
          }
          className = {
            styles['search-icon']
          }
        />
        <input
          type="text"
          placeholder="Search friends..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles['search-input']}
        />
      </div>

      {filteredFriends.length === 0 ? (
        <div className={styles['empty-text']}>
          No friends found. Add friends from your profile to invite them here.
        </div>
      ) : (
        <ul className={styles.list}>
          {filteredFriends.map(friend => {
            const displayName = getDisplayName(friend);
            const initials = getInitials(friend.FirstName, friend.LastName, friend.Username);
            const friendRole = roles[friend.UserId] || 'viewer';

            return (
              <li key={friend.UserId} className={styles['list-item']}>
                <div className={styles['user-info']}>
                  <div className={styles.avatar}>{initials}</div>
                  <div className={styles['user-details']}>
                    <span className={styles['display-name']}>{displayName}</span>
                    <span className={styles.email}>@{friend.Username}</span>
                  </div>
                </div>
                <div className={styles['item-actions']}>
                  <SelectMenu
                    value = {
                      friendRole
                    }
                    options = {
                      SHARE_ROLE_OPTIONS
                    }
                    onChange = {
                      (next) => setRole(friend.UserId, next as 'viewer' | 'collaborator')
                    }
                    disabled = {
                      loadingIds[friend.UserId]
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
                  <Button
                    variant = {
                      'secondary'
                    }
                    size = {
                      'sm'
                    }
                    onClick = {
                      () => handleShareSingle(friend.UserId)
                    }
                    isLoading = {
                      loadingIds[friend.UserId]
                    }
                  >
                    Invite
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
