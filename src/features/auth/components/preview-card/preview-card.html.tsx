import React, { forwardRef } from 'react';
import { Calendar, Palette, Check } from 'lucide-react';
import { formatBirthday } from 'shared/utils/format-date.util';
import { getDisplayName } from 'shared/utils/get-display-name.util';
import { resolveOnlineStatus } from 'shared/utils/resolve-online-status.util';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './preview-card.module.css';

export const PreviewCardTemplate = forwardRef<HTMLDivElement, TemplateProps>(
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
    const status = resolveOnlineStatus(user?.LastOnline, isOnline);

    return (
      <div
        ref={ref}
        className={cardClass}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isLoading ? (
          <div className={styles['preview-card__loading']}>
            <div className={styles['preview-card__spinner']} />
          </div>
        ) : (
          <>
            <div className={styles['preview-card__joined']}>
              <div className={styles['preview-card__joined-header']}>
                <Calendar size={11} className={styles['preview-card__joined-icon']} />
                <span>Joined</span>
              </div>
              <span className={styles['preview-card__joined-date']}>
                {joinedDate.startsWith('Joined ') ? joinedDate.substring(7) : joinedDate}
              </span>
            </div>

            {user ? (
              <>
                <div className={styles['preview-card__header']}>
                  <div className={styles['preview-card__avatar-group']}>
                    <div className={styles['preview-card__avatar-container']}>
                      <UserAvatar
                        avatar={user.Avatar}
                        alt={user.Username || displayName}
                        initials={userInitials || fallbackInitials}
                        className={styles['preview-card__avatar']}
                        imageClassName={styles['preview-card__avatar-img']}
                        initialsClassName={styles['preview-card__avatar-initials']}
                      />
                      <span
                        className={`${styles['preview-card__status-dot']} ${
                          status.isOnline
                            ? styles['preview-card__status-dot--online']
                            : styles['preview-card__status-dot--offline']
                        }`}
                        title={status.statusText}
                      />
                    </div>
                    <div className={styles['preview-card__name-group']}>
                      <h4 className={styles['preview-card__display-name']}>{getDisplayName(user)}</h4>
                      <span className={styles['preview-card__username']}>@{user.Username}</span>
                    </div>
                  </div>
                </div>

                <div className={styles['preview-card__stats']}>
                  <div className={styles['preview-card__stat']}>
                    <span className={styles['preview-card__stat-value']}>
                      {user.ActiveListsCount ?? user.WishlistCount ?? 0}
                    </span>
                    <span className={styles['preview-card__stat-label']}>Active</span>
                  </div>
                  <div className={styles['preview-card__stat']}>
                    <span className={styles['preview-card__stat-value']}>{user.ArchivedListsCount ?? 0}</span>
                    <span className={styles['preview-card__stat-label']}>Archived</span>
                  </div>
                  <div className={styles['preview-card__stat']}>
                    <span className={styles['preview-card__stat-value']}>{user.MutualsCount ?? 0}</span>
                    <span className={styles['preview-card__stat-label']}>Mutuals</span>
                  </div>
                  {user.Birthday && (
                    <div className={styles['preview-card__stat']}>
                      <span className={styles['preview-card__stat-value']}>{formatBirthday(user.Birthday)}</span>
                      <span className={styles['preview-card__stat-label']}>Birthday</span>
                    </div>
                  )}
                  {user.Theme && (
                    <>
                      <div className={styles['preview-card__stat-divider']} />
                      <div className={`${styles['preview-card__stat']} ${styles['preview-card__stat--theme']}`}>
                        <Palette size={11} className={styles['preview-card__theme-icon']} />
                        <span
                          className={`${styles['preview-card__stat-label']} ${styles['preview-card__stat-label--theme']}`}
                        >
                          {user.Theme}
                        </span>
                        <button
                          type="button"
                          className={styles['preview-card__try-theme']}
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

                <div className={styles['preview-card__bio-section']}>
                  <p className={styles['preview-card__bio']}>
                    {user.Bio || "This user hasn't set a bio yet."}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={styles['preview-card__header']}>
                  <div className={styles['preview-card__avatar-group']}>
                    <div className={styles['preview-card__avatar-container']}>
                      <UserAvatar
                        avatar={null}
                        alt={displayName}
                        initials={fallbackInitials}
                        className={styles['preview-card__avatar']}
                        imageClassName={styles['preview-card__avatar-img']}
                        initialsClassName={styles['preview-card__avatar-initials']}
                      />
                      <span
                        className={`${styles['preview-card__status-dot']} ${styles['preview-card__status-dot--offline']}`}
                      />
                    </div>
                    <div className={styles['preview-card__name-group']}>
                      <h4 className={styles['preview-card__display-name']}>{displayName}</h4>
                      <span className={styles['preview-card__username']}>Profile Preview</span>
                    </div>
                  </div>
                </div>

                <div className={styles['preview-card__bio-section']}>
                  <p className={styles['preview-card__bio']}>
                    Offline profile information is currently unavailable.
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }
);

PreviewCardTemplate.displayName = 'PreviewCardTemplate';
