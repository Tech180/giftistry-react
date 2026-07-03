import React, { forwardRef } from 'react';
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
    return (
      <div
        ref={ref}
        className={cardClass}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
          </div>
        ) : user ? (
          <>
            <div className={styles.userProfileCardHeader}>
              <div className={styles.userProfileCardAvatar}>
                {userInitials}
              </div>
              <div className={styles.userProfileCardStatus}>
                <span
                  className={`${styles.statusDot} ${
                    isOnline ? styles.statusOnline : styles.statusOffline
                  }`}
                  title={isOnline ? 'Online' : 'Offline'}
                />
                <span className={styles.userProfileCardTheme} title="Selected Theme">
                  {user.Theme ? `Current Theme: ${user.Theme}` : 'No Theme Selected'}
                </span>
              </div>
            </div>
            <div className={styles.userProfileCardBody}>
              <h4 className={styles.userProfileCardDisplayName}>
                {user.FirstName || user.LastName
                  ? `${user.FirstName} ${user.LastName}`.trim()
                  : user.Username}
              </h4>
              <span className={styles.userProfileCardUsername}>@{user.Username}</span>
              <p className={styles.userProfileCardBio}>
                {user.Bio || 'This user hasn\'t set a bio yet.'}
              </p>
            </div>
            <div className={styles.userProfileCardFooter}>
              <span>{joinedDate}</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.userProfileCardHeader}>
              <div className={styles.userProfileCardAvatar}>
                {fallbackInitials}
              </div>
              <div className={styles.userProfileCardStatus}>
                <span
                  className={`${styles.statusDot} ${
                    isOnline ? styles.statusOnline : styles.statusOffline
                  }`}
                  title={isOnline ? 'Online' : 'Offline'}
                />
                <span className={styles.userProfileCardTheme}>Offline Profile</span>
              </div>
            </div>
            <div className={styles.userProfileCardBody}>
              <h4 className={styles.userProfileCardDisplayName}>{displayName}</h4>
              <span className={styles.userProfileCardUsername}>Profile preview unavailable</span>
              <p className={styles.userProfileCardBio}>Could not fetch user details.</p>
            </div>
            <div className={styles.userProfileCardFooter}>
              <span>{joinedDate}</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

UserPreviewCardTemplate.displayName = 'UserPreviewCardTemplate';
