import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'shared/ui/user-preview-card/user-preview-card.component';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.html';
import { OwnerBadgeProps } from './interfaces/owner-badge-props.interface';
import styles from './owner-badge.module.css';

function getOwnerInitials(displayName: string, firstName?: string, username?: string): string {
  if (firstName?.trim()) {
    return firstName.trim()[0]!.toUpperCase();
  }
  if (username?.trim()) {
    return username.trim()[0]!.toUpperCase();
  }
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

export const OwnerBadge: React.FC<OwnerBadgeProps> = ({
  userId,
  displayName,
  username,
  firstName,
  avatar,
}) => {
  const ariaLabel = `Owner: ${displayName}`;

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
          initials={getOwnerInitials(displayName, firstName, username)}
          className={styles['owner-badge-avatar']}
          imageClassName={styles['owner-badge-avatar-img']}
          initialsClassName={styles['owner-badge-avatar-initials']}
        />
      </UserPreviewCard>
    </UserAvatarBox>
  );
};
