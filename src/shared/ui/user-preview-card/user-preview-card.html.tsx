import React, { forwardRef } from 'react';
import { Gift, Layers, Users, Calendar, Palette, Check } from 'lucide-react';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
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
      onTryTheme,
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
        ) : (
          <>
            <div className={styles['joined-badge']}>
              <div className={styles['joined-badge-header']}>
                <Calendar size={11} className={styles['joined-icon']} />
                <span>Joined</span>
              </div>
              <span className={styles['joined-date']}>
                {joinedDate.startsWith('Joined ') ? joinedDate.substring(7) : joinedDate}
              </span>
            </div>

            {user ? (
              <>
                {/* Popover Header */}
                <div className={styles['popover-header']}>
                  <div className={styles['avatar-group']}>
                    <div className={styles['avatar-container']}>
                      <UserAvatar
                        avatar={user.Avatar}
                        alt={user.Username || displayName}
                        initials={userInitials || fallbackInitials}
                        className={styles.avatar}
                        imageClassName={styles['avatar-img']}
                        initialsClassName={styles['avatar-initials']}
                      />
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

                {/* Popover Grid Stats */}
                <div className={styles['stats-grid']}>
                  <div className={styles['stat-box']}>
                    <span className={styles['stat-value']}>{user.ActiveListsCount ?? user.WishlistCount ?? 0}</span>
                    <span className={styles['stat-label']}>Active</span>
                  </div>
                  <div className={styles['stat-box']}>
                    <span className={styles['stat-value']}>{user.ArchivedListsCount ?? 0}</span>
                    <span className={styles['stat-label']}>Archived</span>
                  </div>
                  <div className={styles['stat-box']}>
                    <span className={styles['stat-value']}>{user.MutualsCount ?? 0}</span>
                    <span className={styles['stat-label']}>Mutuals</span>
                  </div>
                  {user.Birthday && (
                    <div className={styles['stat-box']}>
                      <span className={styles['stat-value']}>{formatBirthday(user.Birthday)}</span>
                      <span className={styles['stat-label']}>Birthday</span>
                    </div>
                  )}
                  {user.Theme && (
                    <>
                      <div className={styles['stat-divider']} />
                      <div className={`${styles['stat-box']} ${styles['theme-stat-box']}`}>
                        <Palette size={11} className={styles['theme-icon']} />
                        <span className={styles['stat-label']}>{user.Theme}</span>
                        <button
                          type="button"
                          className={styles['try-theme-btn-inline']}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTryTheme?.(user.Theme!);
                          }}
                          title="Apply this theme"
                          aria-label="Apply this theme"
                        >
                          <Check size={11} strokeWidth={3} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Popover Bio */}
                <div className={styles['bio-section']}>
                  <p className={styles.bio}>
                    {user.Bio || "This user hasn't set a bio yet."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={styles['popover-header']}>
                  <div className={styles['avatar-group']}>
                    <div className={styles['avatar-container']}>
                      <UserAvatar
                        avatar={null}
                        alt={displayName}
                        initials={fallbackInitials}
                        className={styles.avatar}
                        imageClassName={styles['avatar-img']}
                        initialsClassName={styles['avatar-initials']}
                      />
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
              </>
            )}
          </>
        )}
      </div>
    );
  }
);

UserPreviewCardTemplate.displayName = 'UserPreviewCardTemplate';
