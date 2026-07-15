import React from 'react';
import { UserAvatar, UserPreviewCard } from 'shared/ui';
import { useAuth } from 'app/providers/auth-context';
import { ItemAudienceUser } from '../../../interfaces/item-audience-user.interface';
import {
  getAudienceDisplayName,
  getAudienceUserInitials,
} from '../../../utils/item-audience.util';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.html';
import { SharingAvatarsProps } from './interfaces/sharing-avatars-props.interface';
import styles from './sharing-avatars.module.css';

const MAX_VISIBLE_AVATARS = 4;

export const SharingAvatars: React.FC<SharingAvatarsProps> = ({ users, isOwner }) => {
  const { user: currentUser } = useAuth();

  if (users.length === 0) {
    return null;
  }

  if (isOwner) {
    const visibleUsers = users.slice(0, MAX_VISIBLE_AVATARS);
    const overflowCount = users.length - visibleUsers.length;
    const ariaLabel = `Shared with ${users.map(getAudienceDisplayName).join(', ')}`;

    return (
      <UserAvatarBox title="Shared with" ariaLabel={ariaLabel} variant="sharing">
        <div className={styles['user-avatar-box-avatars']}>
          {visibleUsers.map((user) => {
            const displayName = getAudienceDisplayName(user);
            return (
              <UserPreviewCard
                key={user.UserId}
                userId={user.UserId}
                displayName={displayName}
                fallbackUser={{
                  Username: user.Username ?? undefined,
                  FirstName: user.FirstName ?? undefined,
                  LastName: user.LastName ?? undefined,
                }}
              >
                <UserAvatar
                  avatar={null}
                  alt={displayName}
                  initials={getAudienceUserInitials(user)}
                  className={styles['sharing-avatar']}
                  imageClassName={styles['sharing-avatar-img']}
                  initialsClassName={styles['sharing-avatar-initials']}
                />
              </UserPreviewCard>
            );
          })}
          {overflowCount > 0 && (
            <span className={styles['sharing-avatar-overflow']} aria-hidden="true">
              +{overflowCount}
            </span>
          )}
        </div>
      </UserAvatarBox>
    );
  }

  // Non-owner view: show only their own avatar and count next to it
  const myUser = currentUser ? users.find((u) => u.UserId === currentUser.Id) : null;
  if (!myUser) {
    return null;
  }

  const displayName = getAudienceDisplayName(myUser);
  const ariaLabel = `Shared with you and ${users.length - 1} others`;

  return (
    <UserAvatarBox title="Shared with" ariaLabel={ariaLabel} variant="sharing">
      <div className={styles['user-avatar-box-avatars']}>
        <UserPreviewCard
          key={myUser.UserId}
          userId={myUser.UserId}
          displayName={displayName}
          fallbackUser={{
            Username: myUser.Username ?? undefined,
            FirstName: myUser.FirstName ?? undefined,
            LastName: myUser.LastName ?? undefined,
          }}
        >
          <UserAvatar
            avatar={null}
            alt={displayName}
            initials={getAudienceUserInitials(myUser)}
            className={styles['sharing-avatar']}
            imageClassName={styles['sharing-avatar-img']}
            initialsClassName={styles['sharing-avatar-initials']}
          />
        </UserPreviewCard>
        {users.length - 1 > 0 && (
          <span className={styles['sharing-avatar-count-text']}>
            +{users.length - 1}
          </span>
        )}
      </div>
    </UserAvatarBox>
  );
};
