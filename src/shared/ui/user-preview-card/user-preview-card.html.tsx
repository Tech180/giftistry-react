import React, { forwardRef } from 'react';
import { Gift, Layers, Users, Calendar } from 'lucide-react';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import { UserPreviewCardTemplateProps } from './interfaces/user-preview-card-template-props.interface';
import styles from './user-preview-card.module.css';

export const UserPreviewCardTemplate = forwardRef<HTMLDivElement, UserPreviewCardTemplateProps>(
  (
    {
      user,
      isLoading,
      style,
      onMouseEnter,
      onMouseLeave,
      displayName,
      isOnline,
      userInitials,
      fallbackInitials,
      joinedDate,
      cardClass,
    },
    ref
  ) => {
    const formatBirthday = (dateStr?: string | null) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
      return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const status = resolveOnlineStatus(user?.LastOnline, isOnline);

    return (
      <div
        ref={ref}
        className={`${cardClass} ${styles['popover-card']}`}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isLoading ? (
          <div className={styles['loading-container']}>
            <div className={styles.spinner} />
          </div>
        ) : user ? (
          <>
            {/* Popover Header */}
            <div className={styles['popover-header']}>
              <div className={styles['avatar-group']}>
                <div className={styles['avatar-container']}>
                  <div className={styles.avatar}>
                    {userInitials || fallbackInitials}
                  </div>
                  <span
                    className={`${styles['status-dot']} ${
                      status.isOnline ? styles['status-online'] : styles['status-offline']
                    }`}
                    title={status.statusText}
                  />
                </div>
                <div className={styles['name-group']}>
                  <h4 className={styles['display-name']}>
                    {user.FirstName || user.LastName
                      ? `${user.FirstName} ${user.LastName}`.trim()
                      : user.Username}
                  </h4>
                  <span className={styles.username}>@{user.Username}</span>
                </div>
              </div>
            </div>

            {/* Popover Bio */}
            <div className={styles['bio-section']}>
              <p className={styles.bio}>
                {user.Bio || "This user hasn't set a bio yet."}
              </p>
            </div>

            {/* Popover Grid Stats */}
            <div className={styles['stats-grid']}>
              <div className={styles['stat-item']}>
                <Layers size={12} className={styles['stat-icon']} />
                <span className={styles['stat-label']}>{user.WishlistCount ?? 0} Lists</span>
              </div>
              <div className={styles['stat-item']}>
                <Users size={12} className={styles['stat-icon']} />
                <span className={styles['stat-label']}>{user.MutualsCount ?? 0} Mutuals</span>
              </div>
              {user.Birthday && (
                <div className={styles['stat-item']}>
                  <Gift size={12} className={styles['stat-icon']} />
                  <span className={styles['stat-label']}>{formatBirthday(user.Birthday)}</span>
                </div>
              )}
            </div>

            {/* Popover Footer */}
            <div className={styles['popover-footer']}>
              <div className={styles['footer-joined']}>
                <Calendar size={11} />
                <span>Member since {joinedDate}</span>
              </div>
              {user.Theme && (
                <span className={styles['theme-tag']}>{user.Theme}</span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles['popover-header']}>
              <div className={styles['avatar-group']}>
                <div className={styles['avatar-container']}>
                  <div className={styles.avatar}>
                    {fallbackInitials}
                  </div>
                  <span className={`${styles['status-dot']} ${styles['status-offline']}`} />
                </div>
                <div className={styles['name-group']}>
                  <h4 className={styles['display-name']}>{displayName}</h4>
                  <span className={styles.username}>Profile Preview</span>
                </div>
              </div>
            </div>

            <div className={styles['bio-section']}>
              <p className={styles.bio}>Offline profile information is currently unavailable.</p>
            </div>

            <div className={styles['popover-footer']}>
              <div className={styles['footer-joined']}>
                <Calendar size={11} />
                <span>Member since {joinedDate}</span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

UserPreviewCardTemplate.displayName = 'UserPreviewCardTemplate';
