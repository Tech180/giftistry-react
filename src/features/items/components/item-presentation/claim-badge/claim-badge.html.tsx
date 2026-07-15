import React from 'react';
import { UserAvatar, UserPreviewCard } from 'shared/ui';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.html';
import { ClaimBadgeProps } from './interfaces/claim-badge-props.interface';
import styles from './claim-badge.module.css';

function getClaimInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ''}${parts[parts.length - 1]![0] ?? ''}`.toUpperCase();
  }
  return displayName.slice(0, 2).toUpperCase();
}

export const ClaimBadge: React.FC<ClaimBadgeProps> = ({
  userId,
  displayName,
  anonymous = false,
  claimedByCurrentUser = false,
}) => {
  if (anonymous) {
    const ariaLabel = claimedByCurrentUser
      ? 'You claimed this anonymously'
      : 'Claimed anonymously';

    return (
      <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
        <span className={styles['claim-badge-anonymous']}>Anonymous</span>
      </UserAvatarBox>
    );
  }

  if (!userId) {
    return null;
  }

  const ariaLabel = claimedByCurrentUser ? 'You claimed this' : `Claimed by ${displayName}`;

  return (
    <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
      <UserPreviewCard userId={userId} displayName={displayName}>
        <UserAvatar
          avatar={null}
          alt={ariaLabel}
          initials={getClaimInitials(displayName)}
          className={styles['claim-badge-avatar']}
          imageClassName={styles['claim-badge-avatar-img']}
          initialsClassName={styles['claim-badge-avatar-initials']}
        />
      </UserPreviewCard>
    </UserAvatarBox>
  );
};
