import React from 'react';
import { Search, AlertCircle, Check } from 'lucide-react';
import { Button } from 'shared/ui';
import styles from '../../../panel.module.css';
import { FriendsTabTemplateProps } from './interfaces/friends.interface';

export const FriendsTabTemplate: React.FC<FriendsTabTemplateProps> = ({
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
          No friends found. Try sending an email invite.
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
