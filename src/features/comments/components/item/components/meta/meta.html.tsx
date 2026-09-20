import React from 'react';
import { MetaTemplateProps } from './interfaces/meta-template-props.interface';
import { UserPreviewCard } from 'features/auth';
import { UserAvatar } from 'shared/ui/user-avatar/user-avatar.component';
import styles from './meta.module.css';

export const MetaTemplate: React.FC<MetaTemplateProps> = ({
  comment,
  isAnonymousComment,
  isSystemComment = false,
  authorUsername,
  authorAvatar,
  authorParticipant,
  isOnline,
  isListOwnerComment,
  formatDate,
  datePart,
  timePart,
}) => {
  return (
    <div className={styles.meta}>
      <div className={styles['meta-left']}>
        {isSystemComment ? (
          <span className={`${styles.author} ${styles['system-author']}`}>System</span>
        ) : isAnonymousComment ? (
          <span className={`${styles.author} ${styles['anonymous-author']}`}>Anonymous</span>
        ) : (
          authorUsername && (
            <UserPreviewCard
              userId={comment.UserId}
              displayName={authorUsername}
              isOnline={isOnline}
              fallbackUser={
                authorParticipant
                  ? {
                      Username: authorParticipant.username,
                      FirstName: authorParticipant.displayName,
                      Avatar: authorAvatar,
                    }
                  : undefined
              }
            >
              <span className={styles['author-wrap']}>
                <UserAvatar
                  avatar={authorAvatar}
                  alt={authorUsername}
                  initials={authorUsername.slice(0, 1).toUpperCase()}
                  className={styles['author-avatar']}
                  imageClassName={styles['author-avatar-img']}
                  initialsClassName={styles['author-avatar-initials']}
                />
                <span className={styles.author}>{authorUsername}</span>
              </span>
            </UserPreviewCard>
          )
        )}

        {isListOwnerComment && (
          <span className={styles['owner-badge']} title="Wishlist owner">
            Owner
          </span>
        )}

        {comment.IsRollover && (
          <span className={styles['rollover-badge']} title="Carry-over discussion">
            Rollover
          </span>
        )}

        <div className={styles['date-badge']} title={formatDate(comment.CreatedAt)}>
          <span className={styles['date-part']}>{datePart}</span>
          <span className={styles['time-part']}>{timePart}</span>
        </div>
      </div>
    </div>
  );
};
