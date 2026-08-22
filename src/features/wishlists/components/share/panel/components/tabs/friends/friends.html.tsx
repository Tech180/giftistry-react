import React from 'react';
import { Search, AlertCircle, Check } from 'lucide-react';
import { Button } from 'shared/ui';
import styles from '../../../panel.module.css';
import fabStyles from '../../../../share-fab-panel/share-fab-panel.module.css';
import { FriendsTabTemplateProps } from './interfaces/friends.interface';

export const FriendsTabTemplate: React.FC<FriendsTabTemplateProps> = ({
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
      <div className={fabStyles.compactRoot}>
        {errorMsg && <p className={fabStyles.compactAlert}>{errorMsg}</p>}
        {successMsg && (
          <p className={fabStyles.compactStatus} style={{ color: 'var(--success)' }}>
            {successMsg}
          </p>
        )}

        <div className={fabStyles.searchWrap}>
          <Search size={14} className={fabStyles.searchIcon} aria-hidden />
          <input
            type="search"
            placeholder="Search friends or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={fabStyles.searchInput}
            aria-label="Search friends"
          />
        </div>

        {filteredFriends.length === 0 ? (
          <p className={fabStyles.compactEmpty}>No friends found to invite.</p>
        ) : (
          <ul className={fabStyles.compactList}>
            {filteredFriends.map((friend) => {
              const displayName =
                `${friend.FirstName || ''} ${friend.LastName || ''}`.trim() || friend.Username || '';
              const initials = getInitials(friend.FirstName, friend.LastName, friend.Username);

              return (
                <li key={friend.UserId} className={fabStyles.compactListItem}>
                  <div className={fabStyles.compactUserInfo}>
                    <div className={fabStyles.compactAvatar}>{initials}</div>
                    <div className={fabStyles.compactUserDetails}>
                      <span className={fabStyles.compactUserName}>{displayName}</span>
                      <span className={fabStyles.compactUserSub}>
                        {friend.Email || `@${friend.Username}`}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleShareSingle(friend.UserId)}
                    isLoading={loadingIds[friend.UserId]}
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
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className={`${styles.alert} ${styles['alert-success']}`}>
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      <div className={styles['search-container']}>
        <Search size={14} className={styles['search-icon']} />
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
            const displayName = `${friend.FirstName || ''} ${friend.LastName || ''}`.trim() || friend.Username;
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
                  <select
                    value={friendRole}
                    onChange={(e) => setRole(friend.UserId, e.target.value as 'viewer' | 'collaborator')}
                    className={styles['minimal-select']}
                    disabled={loadingIds[friend.UserId]}
                  >
                    <option value="viewer">Can view</option>
                    <option value="collaborator">Can edit</option>
                  </select>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleShareSingle(friend.UserId)}
                    isLoading={loadingIds[friend.UserId]}
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
