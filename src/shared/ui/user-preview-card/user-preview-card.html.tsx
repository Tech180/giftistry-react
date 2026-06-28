import React, { forwardRef } from 'react';
import { ApiUser } from 'features/auth/interfaces/api-user.interface';
import styles from './user-preview-card.module.css';

interface UserPreviewCardTemplateProps {
  user: ApiUser | null;
  isLoading: boolean;
  placement: 'top' | 'bottom';
  style: React.CSSProperties;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  displayName: string;
  isOnline: boolean;
}

export const UserPreviewCardTemplate = forwardRef<HTMLDivElement, UserPreviewCardTemplateProps>(
  ({ user, isLoading, placement, style, onMouseEnter, onMouseLeave, displayName, isOnline }, ref) => {
    // Helper to get initials
    const getInitials = (u: ApiUser) => {
      if (u.FirstName && u.LastName) {
        return `${u.FirstName[0]}${u.LastName[0]}`.toUpperCase();
      }
      return u.Username.slice(0, 2).toUpperCase();
    };

    // Helper to get fallback display initials
    const getFallbackInitials = (nameStr: string) => {
      const parts = nameStr.trim().split(/\s+/);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return nameStr.slice(0, 2).toUpperCase();
    };

    // Helper to format join date
    const getJoinedDate = (createdAt?: string) => {
      if (!createdAt) return 'Joined recently';
      const date = new Date(createdAt);
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `Joined ${month} ${year}`;
    };

    // Construct preview classes
    const cardClass = `${styles.userProfileCard} ${
      placement === 'top' ? styles.showTop : styles.showBottom
    } ${styles.isVisible}`;

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
                {getInitials(user)}
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
              <span>{getJoinedDate(user.CreatedAt)}</span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.userProfileCardHeader}>
              <div className={styles.userProfileCardAvatar}>
                {getFallbackInitials(displayName)}
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
              <span>Unknown Join Date</span>
            </div>
          </>
        )}
      </div>
    );
  }
);

UserPreviewCardTemplate.displayName = 'UserPreviewCardTemplate';
