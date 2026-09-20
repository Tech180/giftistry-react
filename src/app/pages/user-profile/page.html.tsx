import React from 'react';
import { ArrowLeft, Calendar, Palette } from 'lucide-react';
import { Button, LoadingState, ErrorState, UserAvatar } from 'shared/ui';
import { formatBirthday } from 'shared/utils/format-date.util';
import type { PageTemplateProps } from './interfaces/page-template-props.interface';
import styles from './page.module.css';

export const PageTemplate: React.FC<PageTemplateProps> = ({
  user,
  isLoading,
  error,
  isDisabled,
  displayName,
  userInitials,
  joinedLabel,
  statusText,
  isOnline,
  onBack,
  onTryTheme,
}) => {
  if (isLoading) {
    return (
      <LoadingState
        message = {
          'Loading profile...'
        }
        fullHeight = {
          true
        }
      />
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles['page__back-btn']} onClick={onBack}>
          <ArrowLeft size={14} aria-hidden />
          Back
        </button>
        <ErrorState
          message = {
            error
          }
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles['page__back-btn']} onClick={onBack}>
          <ArrowLeft size={14} aria-hidden />
          Back
        </button>
        <ErrorState
          message = {
            'User not found.'
          }
        />
      </div>
    );
  }

  return (
    <main className={styles.page}>
      <button type="button" className={styles['page__back-btn']} onClick={onBack}>
        <ArrowLeft size={14} aria-hidden />
        Back
      </button>

      <section className={styles['page__hero']} aria-label="User profile">
        <div className={styles['page__avatar-wrap']}>
          <UserAvatar
            avatar = {
              user.Avatar
            }
            alt = {
              user.Username || displayName
            }
            initials = {
              userInitials
            }
            className = {
              styles['page__avatar']
            }
            imageClassName = {
              styles['page__avatar-img']
            }
            initialsClassName = {
              styles['page__avatar-initials']
            }
          />
          {!isDisabled && (
            <span
              className={`${styles['page__status-dot']} ${
                isOnline ? styles['page__status-dot--online'] : styles['page__status-dot--offline']
              }`}
              title={statusText}
            />
          )}
        </div>

        <div className={styles['page__name-block']}>
          <h1 className={styles['page__display-name']}>{displayName}</h1>
          <span className={styles['page__username']}>@{user.Username}</span>
          {!isDisabled && <p className={styles['page__status-text']}>{statusText}</p>}
        </div>

        {isDisabled ? (
          <p className={styles['page__disabled-note']}>This account is unavailable.</p>
        ) : (
          <>
            <div className={styles['page__joined']}>
              <Calendar size={12} aria-hidden />
              <span>Joined {joinedLabel}</span>
            </div>
            <p className={styles['page__bio']}>{user.Bio?.trim() || "This user hasn't set a bio yet."}</p>
          </>
        )}
      </section>

      {!isDisabled && (
        <>
          <section className={styles['page__stats']} aria-label="Profile stats">
            <div className={styles['page__stat']}>
              <span className={styles['page__stat-value']}>
                {user.ActiveListsCount ?? user.WishlistCount ?? 0}
              </span>
              <span className={styles['page__stat-label']}>Active</span>
            </div>
            <div className={styles['page__stat']}>
              <span className={styles['page__stat-value']}>{user.ArchivedListsCount ?? 0}</span>
              <span className={styles['page__stat-label']}>Archived</span>
            </div>
            <div className={styles['page__stat']}>
              <span className={styles['page__stat-value']}>{user.MutualsCount ?? 0}</span>
              <span className={styles['page__stat-label']}>Mutuals</span>
            </div>
            {user.Birthday ? (
              <div className={styles['page__stat']}>
                <span className={styles['page__stat-value']}>{formatBirthday(user.Birthday)}</span>
                <span className={styles['page__stat-label']}>Birthday</span>
              </div>
            ) : null}
          </section>

          {user.Theme ? (
            <div className={styles['page__theme-row']}>
              <span className={styles['page__theme-meta']}>
                <Palette size={16} aria-hidden />
                {user.Theme}
              </span>
              <Button
                type = {
                  'button'
                }
                variant = {
                  'secondary'
                }
                size = {
                  'sm'
                }
                onClick = {
                  () => onTryTheme(user.Theme!)
                }
              >
                Try theme
              </Button>
            </div>
          ) : null}
        </>
      )}
    </main>
  );
};
