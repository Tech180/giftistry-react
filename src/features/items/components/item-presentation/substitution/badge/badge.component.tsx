import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'shared/ui/user-preview-card/user-preview-card.component';
import {
  SUBSTITUTION_COUNTER_LABEL,
  SUBSTITUTION_OWNER_APPROVED_BADGE_LABEL,
} from '../../../../constants/substitution-messages.constant';
import { UserAvatarBox } from '../../user-avatar-box/user-avatar-box.html';
import { getClaimInitials } from '../../claim-badge/utils/claim-badge-display.util';
import type { SubstitutionBadgeProps } from './interfaces/substitution-badge-props.interface';
import styles from './badge.module.css';

export const SubstitutionBadge: React.FC<SubstitutionBadgeProps> = ({
  kind,
  createdByUserId = null,
  createdByDisplayName = 'Someone',
}) => {
  if (kind === 'original') {
    return null;
  }

  if (kind === 'owner_approved') {
    return (
      <span className={`${styles.badge} ${styles['badge-owner']}`}>
        {SUBSTITUTION_OWNER_APPROVED_BADGE_LABEL}
      </span>
    );
  }

  const ariaLabel = `Substitution by ${createdByDisplayName}`;
  const avatar = (
    <UserAvatar
      avatar={null}
      alt={createdByDisplayName}
      initials={getClaimInitials(createdByDisplayName)}
      className={styles['badge-user-avatar']}
      imageClassName={styles['badge-user-avatar-img']}
      initialsClassName={styles['badge-user-avatar-initials']}
    />
  );

  return (
    <UserAvatarBox title={SUBSTITUTION_COUNTER_LABEL} ariaLabel={ariaLabel} variant="suggestion">
      {createdByUserId ? (
        <UserPreviewCard userId={createdByUserId} displayName={createdByDisplayName}>
          {avatar}
        </UserPreviewCard>
      ) : (
        avatar
      )}
    </UserAvatarBox>
  );
};
