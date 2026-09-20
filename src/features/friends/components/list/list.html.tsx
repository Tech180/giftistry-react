import React from 'react';
import { UserMinus, Gift, Sparkles, ListTree, Users } from 'lucide-react';
import { UserPreviewCard } from 'features/auth';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { formatDateTime } from 'shared/utils/format-date.util';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import { toPreviewFallback } from '../../utils/to-preview-fallback.util';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './list.module.css';

export const ListTemplate: React.FC<TemplateProps> = ({
  friends,
  onRemove,
  removingId,
  highlightedUserId,
  hoveredUserId,
  onHoverChange,
  getDisplayName,
  getFriendUserId,
  getFriendInitials,
  isBirthdayNear,
}) => {
  if (friends.length === 0) {
    return <p className={styles['list__empty']}>No friends yet. Search for users to connect!</p>;
  }

  return (
    <div className={styles['list']}>
      {friends.map((friend) => {
        const userId = getFriendUserId(friend);
        const displayName = getDisplayName(friend);
        const username = friend.Username || 'user';
        const initials = getFriendInitials(friend);
        const birthdayNear = isBirthdayNear(friend.DaysUntilBirthday);
        const status = resolveOnlineStatus(friend.LastOnline);
        const isHighlighted = highlightedUserId === userId;
        const isHovered = hoveredUserId === userId;
        const showRemove = isHovered || removingId === userId;

        return (
          <div
            key={friend.Id}
            id={`friend-user-${userId}`}
            className={[
              styles['list__card'],
              isHighlighted ? styles['list__card--highlighted'] : '',
            ].filter(Boolean).join(' ')}
            onMouseEnter={() => onHoverChange(userId)}
            onMouseLeave={() => onHoverChange(null)}
          >
            {birthdayNear ? (
              <div className={styles['list__birthday-badge']}>
                <Gift size={10} className={styles['list__gift-icon']} />
                <span>
                  {friend.DaysUntilBirthday === 0 ? 'Today' : `${friend.DaysUntilBirthday}d`}
                </span>
              </div>
            ) : null}

            <div className={styles['list__card-header']}>
              <div className={styles['list__user-info']}>
                <div className={styles['list__avatar-container']}>
                  <UserAvatar
                    avatar = {
                      friend.Avatar
                    }
                    alt = {
                      displayName
                    }
                    initials = {
                      initials
                    }
                    className = {
                      styles['list__avatar']
                    }
                    imageClassName = {
                      styles['list__avatar-img']
                    }
                    initialsClassName = {
                      styles['list__avatar-initials']
                    }
                  />
                  <span
                    className={[
                      styles['list__status-dot'],
                      status.isOnline
                        ? styles['list__status-dot--online']
                        : styles['list__status-dot--offline'],
                    ].join(' ')}
                    title={`Last online: ${formatDateTime(friend.LastOnline, 'Never')}`}
                  />
                </div>

                <div className={styles['list__name-meta']}>
                  <UserPreviewCard
                    userId = {
                      userId
                    }
                    displayName = {
                      displayName
                    }
                    isOnline = {
                      status.isOnline
                    }
                    fallbackUser = {
                      toPreviewFallback(friend)
                    }
                  >
                    <h3 className={styles['list__display-name']}>{displayName}</h3>
                  </UserPreviewCard>
                  <p className={styles['list__username']}>@{username}</p>
                </div>
              </div>

              <button
                type="button"
                className={[
                  styles['list__remove-btn'],
                  showRemove ? styles['list__remove-btn--visible'] : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onRemove(userId)}
                disabled={removingId === userId}
                title="Remove friend"
              >
                <UserMinus size={14} />
              </button>
            </div>

            <div className={styles['list__stats']}>
              <div className={styles['list__stat']}>
                <ListTree size={16} className={styles['list__stat-icon']} />
                <div className={styles['list__stat-info']}>
                  <span className={styles['list__stat-value']}>{friend.WishlistCount ?? 0}</span>
                  <span className={styles['list__stat-label']}>Lists</span>
                </div>
              </div>
              <div className={styles['list__stat']}>
                <Users size={16} className={styles['list__stat-icon']} />
                <div className={styles['list__stat-info']}>
                  <span className={styles['list__stat-value']}>{friend.MutualsCount ?? 0}</span>
                  <span className={styles['list__stat-label']}>Mutuals</span>
                </div>
              </div>
            </div>

            <div className={styles['list__footer']}>
              <div className={styles['list__activity']}>
                <Sparkles size={11} className={styles['list__sparkles']} />
                <span className={styles['list__activity-text']}>
                  {friend.RecentActivity || 'Active'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
