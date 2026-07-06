import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { UserPreviewCard } from 'shared/ui';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { UserSearchTemplateProps } from './interfaces/user-search-template-props.interface';
import styles from './user-search.module.css';

export const UserSearchTemplate: React.FC<UserSearchTemplateProps> = ({
  query,
  setQuery,
  searchResults,
  isSearching,
  onSendRequest,
  sendingId,
  existingFriendIds,
  pendingUserIds,
  getDisplayName,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles['search-wrapper']}>
        <Search size={14} className={styles['search-icon']} />
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles['search-input']}
        />
      </div>

      {isSearching && <p className={styles['status-text']}>Searching...</p>}

      {!isSearching && query.trim() && searchResults.length === 0 && (
        <p className={styles['status-text']}>No users found.</p>
      )}

      {!isSearching && searchResults.length > 0 && (
        <ul className={styles.list}>
          {searchResults.map((user) => {
            const isFriend = existingFriendIds.includes(user.Id);
            const isPending = pendingUserIds.includes(user.Id);
            const displayName = getDisplayName(user);
            const username = user.Username || 'user';
            const initials = (displayName.slice(0, 2)).toUpperCase();

            return (
              <li key={user.Id} className={styles['list-item']}>
                <div className={styles['user-group']}>
                  <UserAvatar
                    avatar={user.Avatar}
                    alt={displayName}
                    initials={initials}
                    className={styles.avatar}
                    imageClassName={styles['avatar-img']}
                    initialsClassName={styles['avatar-initials']}
                  />
                  <div className={styles['name-meta']}>
                    <UserPreviewCard
                      userId={user.Id}
                      displayName={displayName}
                      fallbackUser={{
                        Username: user.Username,
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Avatar: user.Avatar,
                      }}
                    >
                      <span className={styles['user-name']}>{displayName}</span>
                    </UserPreviewCard>
                    <span className={styles.username}>@{username}</span>
                  </div>
                </div>
                {isFriend ? (
                  <span className={styles['status-badge']}>Friends</span>
                ) : isPending ? (
                  <span className={styles['status-badge']}>Pending</span>
                ) : (
                  <button
                    type="button"
                    className={styles['add-btn']}
                    onClick={() => onSendRequest(user.Id)}
                    disabled={sendingId === user.Id}
                    title="Send friend request"
                  >
                    <UserPlus size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
