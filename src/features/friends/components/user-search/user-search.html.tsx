import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Badge } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './user-search.module.css';

export const UserSearchTemplate: React.FC<TemplateProps> = ({
  query,
  setQuery,
  searchResults,
  isSearching,
  onSendRequest,
  sendingId,
  pendingUserIds,
  getDisplayName,
}) => (
  <div className={styles['user-search']}>
    <div className={styles['user-search__wrapper']}>
      <Search size={14} className={styles['user-search__icon']} />
      <input
        type="text"
        placeholder="Search by username..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles['user-search__input']}
      />
    </div>

    {isSearching ? <p className={styles['user-search__status']}>Searching...</p> : null}

    {!isSearching && query.trim() && searchResults.length === 0 ? (
      <p className={styles['user-search__status']}>No users found.</p>
    ) : null}

    {!isSearching && searchResults.length > 0 ? (
      <ul className={styles['user-search__list']}>
        {searchResults.map((user) => {
          const isPending = pendingUserIds.includes(user.Id);
          const displayName = getDisplayName(user);
          const username = user.Username || 'user';
          const initials = displayName.slice(0, 2).toUpperCase();

          return (
            <li key={user.Id} className={styles['user-search__item']}>
              <div className={styles['user-search__user']}>
                <UserAvatar
                  avatar = {
                    user.Avatar
                  }
                  alt = {
                    displayName
                  }
                  initials = {
                    initials
                  }
                  className = {
                    styles['user-search__avatar']
                  }
                  imageClassName = {
                    styles['user-search__avatar-img']
                  }
                  initialsClassName = {
                    styles['user-search__avatar-initials']
                  }
                />
                <div className={styles['user-search__name-meta']}>
                  <UserPreviewCard
                    userId = {
                      user.Id
                    }
                    displayName = {
                      displayName
                    }
                    fallbackUser = {
                      {
                        Username: user.Username,
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Avatar: user.Avatar,
                      }
                    }
                  >
                    <span className={styles['user-search__user-name']}>{displayName}</span>
                  </UserPreviewCard>
                  <span className={styles['user-search__username']}>@{username}</span>
                </div>
              </div>
              {isPending ? (
                <Badge size="sm">Pending</Badge>
              ) : (
                <button
                  type="button"
                  className={styles['user-search__add-btn']}
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
    ) : null}
  </div>
);
