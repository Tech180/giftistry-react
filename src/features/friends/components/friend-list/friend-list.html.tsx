import { UserMinus, Gift, Sparkles, ListTree, Users } from 'lucide-react';
import { UserPreviewCard } from 'shared/ui/user-preview-card/user-preview-card.component';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import { toPreviewFallback } from '../../utils/to-preview-fallback.util';
import { FriendListTemplateProps } from './interfaces/friend-list-template-props.interface';
import styles from './friend-list.module.css';

export const FriendListTemplate: React.FC<FriendListTemplateProps> = ({
  friends,
  onRemove,
  removingId,
  highlightedUserId,
  getDisplayName,
  getFriendUserId,
}) => {
  if (friends.length === 0) {
    return <p className={styles['empty-text']}>No friends yet. Search for users to connect!</p>;
  }

  return (
    <div className={styles.grid}>
      {friends.map((friend) => {
        const userId = getFriendUserId(friend);
        const displayName = getDisplayName(friend);
        const username = friend.Username || 'user';
        
        // Initials for avatar fallback
        const initials = (friend.FirstName
          ? `${friend.FirstName.charAt(0)}${friend.LastName ? friend.LastName.charAt(0) : ''}`
          : username.slice(0, 2)
        ).toUpperCase();

        const isBirthdayNear = friend.DaysUntilBirthday !== undefined && friend.DaysUntilBirthday <= 30;
        const status = resolveOnlineStatus(friend.LastOnline);

        return (
          <div
            key={friend.Id}
            id={`friend-user-${userId}`}
            className={`${styles.card} ${highlightedUserId === userId ? styles['card-highlighted'] : ''}`}
          >
            {/* Birthday Badge overlay */}
            {isBirthdayNear && (
              <div className={styles['birthday-badge']}>
                <Gift size={10} className={styles['gift-icon']} />
                <span>{friend.DaysUntilBirthday === 0 ? 'Today' : `${friend.DaysUntilBirthday}d`}</span>
              </div>
            )}

            {/* Card Header */}
            <div className={styles['card-header']}>
              <div className={styles['user-info-group']}>
                {/* Avatar container */}
                <div className={styles['avatar-container']}>
                  <UserAvatar
                    avatar={friend.Avatar}
                    alt={displayName}
                    initials={initials}
                    className={styles.avatar}
                    imageClassName={styles['avatar-img']}
                    initialsClassName={styles['avatar-initials']}
                  />
                  <span
                    className={`${styles['status-dot']} ${status.isOnline ? styles['status-online'] : styles['status-offline']}`}
                    title={`Last online: ${friend.LastOnline ? new Date(friend.LastOnline).toLocaleString() : 'Never'}`}
                  />
                </div>

                <div className={styles['name-meta']}>
                  <UserPreviewCard
                    userId={userId}
                    displayName={displayName}
                    isOnline={status.isOnline}
                    fallbackUser={toPreviewFallback(friend)}
                  >
                    <h3 className={styles['display-name']}>{displayName}</h3>
                  </UserPreviewCard>
                  <p className={styles.username}>@{username}</p>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                className={styles['remove-btn']}
                onClick={() => onRemove(userId)}
                disabled={removingId === userId}
                title="Remove friend"
              >
                <UserMinus size={14} />
              </button>
            </div>

            {/* Card Body - Stats Grid */}
            <div className={styles['stats-grid']}>
              <div className={styles['stat-box']}>
                <ListTree size={16} className={styles['stat-icon']} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-value']}>{friend.WishlistCount ?? 0}</span>
                  <span className={styles['stat-label']}>Lists</span>
                </div>
              </div>
              <div className={styles['stat-box']}>
                <Users size={16} className={styles['stat-icon']} />
                <div className={styles['stat-info']}>
                  <span className={styles['stat-value']}>{friend.MutualsCount ?? 0}</span>
                  <span className={styles['stat-label']}>Mutuals</span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className={styles['card-footer']}>
              <div className={styles['activity-wrapper']}>
                <Sparkles size={11} className={styles['sparkles-icon']} />
                <span className={styles['activity-text']}>
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
