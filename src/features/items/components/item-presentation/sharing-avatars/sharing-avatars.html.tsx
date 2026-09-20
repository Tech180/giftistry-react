import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './sharing-avatars.module.css';

export const SharingAvatarsTemplate: React.FC<TemplateProps> = ({
  mode,
  ariaLabel,
  visibleEntries,
  overflowCount,
  guestOtherCount,
}) => {
  return (
    <UserAvatarBox title="Shared with" ariaLabel={ariaLabel} variant="sharing">
      <div className={styles['sharing-avatars__list']}>
        {visibleEntries.map((entry, index) => (
          <UserPreviewCard
            key={entry.userId}
            userId={entry.userId}
            displayName={entry.displayName}
            fallbackUser={{
              Username: entry.username,
              FirstName: entry.firstName,
              LastName: entry.lastName,
            }}
          >
            <UserAvatar
              avatar={null}
              alt={entry.displayName}
              initials={entry.initials}
              className={[
                styles['sharing-avatars__avatar'],
                index === 0 ? styles['sharing-avatars__avatar--lead'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
              imageClassName={styles['sharing-avatars__avatar-img']}
              initialsClassName={styles['sharing-avatars__avatar-initials']}
            />
          </UserPreviewCard>
        ))}
        {mode === 'owner' && overflowCount > 0 ? (
          <span className={styles['sharing-avatars__overflow']} aria-hidden="true">
            +{overflowCount}
          </span>
        ) : null}
        {mode === 'guest' && guestOtherCount > 0 ? (
          <span className={styles['sharing-avatars__count']}>+{guestOtherCount}</span>
        ) : null}
      </div>
    </UserAvatarBox>
  );
};
