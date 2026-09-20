import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './owner-badge.module.css';

export const OwnerBadgeTemplate: React.FC<TemplateProps> = ({
  userId,
  displayName,
  username,
  firstName,
  avatar,
  ariaLabel,
  initials,
}) => {
  return (
    <UserAvatarBox title="Owner" ariaLabel={ariaLabel} variant="owner">
      <UserPreviewCard
        userId={userId}
        displayName={displayName}
        fallbackUser={{
          Username: username,
          FirstName: firstName,
          Avatar: avatar ?? undefined,
        }}
      >
        <UserAvatar
          avatar={avatar}
          alt={ariaLabel}
          initials={initials}
          className={styles['owner-badge-avatar']}
          imageClassName={styles['owner-badge-avatar-img']}
          initialsClassName={styles['owner-badge-avatar-initials']}
        />
      </UserPreviewCard>
    </UserAvatarBox>
  );
};
