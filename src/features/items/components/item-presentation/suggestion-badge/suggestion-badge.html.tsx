import React from 'react';
import { UserAvatar, UserPreviewCard } from 'shared/ui';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.html';
import { getClaimInitials } from '../claim-badge/utils/claim-badge-display.util';
import { SuggestionBadgeProps } from './interfaces/suggestion-badge-props.interface';
import styles from './suggestion-badge.module.css';

export const SuggestionBadge: React.FC<SuggestionBadgeProps> = ({ userId, displayName }) => {
  const ariaLabel = `Suggestion by ${displayName}`;

  return (
    <UserAvatarBox title="Suggestion" ariaLabel={ariaLabel} variant="suggestion">
      {userId ? (
        <UserPreviewCard userId={userId} displayName={displayName}>
          <UserAvatar
            avatar={null}
            alt={displayName}
            initials={getClaimInitials(displayName)}
            className={styles['suggestion-badge-avatar']}
            imageClassName={styles['suggestion-badge-avatar-img']}
            initialsClassName={styles['suggestion-badge-avatar-initials']}
          />
        </UserPreviewCard>
      ) : (
        <UserAvatar
          avatar={null}
          alt={displayName}
          initials={getClaimInitials(displayName)}
          className={styles['suggestion-badge-avatar']}
          imageClassName={styles['suggestion-badge-avatar-img']}
          initialsClassName={styles['suggestion-badge-avatar-initials']}
        />
      )}
    </UserAvatarBox>
  );
};
