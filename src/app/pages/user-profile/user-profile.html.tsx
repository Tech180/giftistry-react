import React from 'react';
import { ArrowLeft, Calendar, Palette } from 'lucide-react';
import { Button, LoadingState, ErrorState, UserAvatar } from 'shared/ui';
import type { UserProfileTemplateProps } from './interfaces/user-profile-template-props.interface';
import styles from './user-profile.module.css';

function formatBirthday(dateStr?: string | null): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0]!, 10);
    const month = parseInt(parts[1]!, 10) - 1;
    const day = parseInt(parts[2]!, 10);
    const d = new Date(year, month, day);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export const UserProfileTemplate: React.FC<UserProfileTemplateProps> = ({
  user,
  isLoading,
  error,
  isDisabled,
  displayName,
  userInitials,
  joinedDate,
  statusText,
  isOnline,
  onBack,
  onTryTheme,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading profile..." fullHeight />;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles['back-btn']} onClick={onBack}>
          <ArrowLeft size={14} aria-hidden />
          Back
        </button>
        <ErrorState message={error} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <button type="button" className={styles['back-btn']} onClick={onBack}>
          <ArrowLeft size={14} aria-hidden />
          Back
        </button>
        <ErrorState message="User not found." />
      </div>
    );
  }

  const joinedLabel = joinedDate.startsWith('Joined ') ? joinedDate.substring(7) : joinedDate;

  return (
    <main className={styles.page}>
      <button type="button" className={styles['back-btn']} onClick={onBack}>
        <ArrowLeft size={14} aria-hidden />
        Back
      </button>

      <section className={styles.hero} aria-label="User profile">
        <div className={styles['avatar-wrap']}>
          <UserAvatar
            avatar={user.Avatar}
            alt={user.Username || displayName}
            initials={userInitials}
            className={styles.avatar}
            imageClassName={styles['avatar-img']}
            initialsClassName={styles['avatar-initials']}
          />
          {!isDisabled && (
            <span
              className={`${styles['status-dot']} ${
                isOnline ? styles['status-online'] : styles['status-offline']
              }`}
              title={statusText}
            />
          )}
        </div>

        <div className={styles['name-block']}>
          <h1 className={styles['display-name']}>{displayName}</h1>
          <span className={styles.username}>@{user.Username}</span>
          {!isDisabled && <p className={styles['status-text']}>{statusText}</p>}
        </div>

        {isDisabled ? (
          <p className={styles['disabled-note']}>This account is unavailable.</p>
        ) : (
          <>
            <div className={styles.joined}>
              <Calendar size={12} aria-hidden />
              <span>Joined {joinedLabel}</span>
            </div>
            <p className={styles.bio}>{user.Bio?.trim() || "This user hasn't set a bio yet."}</p>
          </>
        )}
      </section>

      {!isDisabled && (
        <>
          <section className={styles.stats} aria-label="Profile stats">
            <div className={styles.stat}>
              <span className={styles['stat-value']}>
                {user.ActiveListsCount ?? user.WishlistCount ?? 0}
              </span>
              <span className={styles['stat-label']}>Active</span>
            </div>
            <div className={styles.stat}>
              <span className={styles['stat-value']}>{user.ArchivedListsCount ?? 0}</span>
              <span className={styles['stat-label']}>Archived</span>
            </div>
            <div className={styles.stat}>
              <span className={styles['stat-value']}>{user.MutualsCount ?? 0}</span>
              <span className={styles['stat-label']}>Mutuals</span>
            </div>
            {user.Birthday ? (
              <div className={styles.stat}>
                <span className={styles['stat-value']}>{formatBirthday(user.Birthday)}</span>
                <span className={styles['stat-label']}>Birthday</span>
              </div>
            ) : null}
          </section>

          {user.Theme ? (
            <div className={styles['theme-row']}>
              <span className={styles['theme-meta']}>
                <Palette size={16} aria-hidden />
                {user.Theme}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onTryTheme(user.Theme!)}
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
