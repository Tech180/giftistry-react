import React from 'react';
import { UserAvatar, UserPreviewCard } from 'shared/ui';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.html';
import { CLAIM_BADGE_MAX_VISIBLE_AVATARS } from './constants/claim-badge-max-visible-avatars.constant';
import { ClaimBadgeProps } from './interfaces/claim-badge-props.interface';
import {
  buildClaimBadgeAriaLabel,
  getClaimInitials,
} from './utils/claim-badge-display.util';
import styles from './claim-badge.module.css';

export const ClaimBadge: React.FC<ClaimBadgeProps> = ({ entries }) => {
  if (entries.length === 0) {
    return null;
  }

  const namedEntries = entries.filter((entry) => !entry.anonymous);
  const anonymousEntry = entries.find((entry) => entry.anonymous) ?? null;
  const visibleNamed = namedEntries.slice(0, CLAIM_BADGE_MAX_VISIBLE_AVATARS);
  const overflowCount = namedEntries.length - visibleNamed.length;
  const ariaLabel = buildClaimBadgeAriaLabel(entries);

  if (namedEntries.length === 0 && anonymousEntry) {
    return (
      <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
        <span className={styles['claim-badge-anonymous']}>Anonymous</span>
      </UserAvatarBox>
    );
  }

  return (
    <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
      <div className={styles['claim-badge-avatars']}>
        {visibleNamed.map((entry) => (
          <UserPreviewCard
            key={entry.key}
            userId={entry.userId!}
            displayName={entry.displayName}
          >
            <span className={styles['claim-badge-avatar-wrap']}>
              <UserAvatar
                avatar={null}
                alt={entry.displayName}
                initials={getClaimInitials(entry.displayName)}
                className={styles['claim-badge-avatar']}
                imageClassName={styles['claim-badge-avatar-img']}
                initialsClassName={styles['claim-badge-avatar-initials']}
              />
              {entry.anonymousMarker && (
                <span className={styles['claim-badge-anon-marker']} aria-hidden="true">
                  a
                </span>
              )}
            </span>
          </UserPreviewCard>
        ))}
        {overflowCount > 0 && (
          <span className={styles['claim-badge-overflow']} aria-hidden="true">
            +{overflowCount}
          </span>
        )}
        {anonymousEntry && (
          <span className={styles['claim-badge-anonymous-chip']}>Anonymous</span>
        )}
      </div>
    </UserAvatarBox>
  );
};
