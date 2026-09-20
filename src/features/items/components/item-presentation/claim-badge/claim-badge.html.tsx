import React from 'react';
import { UserAvatar } from 'shared/ui';
import { UserPreviewCard } from 'features/auth';
import { UserAvatarBox } from '../user-avatar-box/user-avatar-box.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './claim-badge.module.css';

export const ClaimBadgeTemplate: React.FC<TemplateProps> = ({
  mode,
  ariaLabel,
  visibleEntries,
  overflowCount,
  showAnonymousChip,
}) => {
  if (mode === 'anonymous-only') {
    return (
      <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
        <span className={styles['claim-badge__anonymous']}>Anonymous</span>
      </UserAvatarBox>
    );
  }

  return (
    <UserAvatarBox title="Claimed by" ariaLabel={ariaLabel} variant="claim">
      <div className={styles['claim-badge__avatars']}>
        {visibleEntries.map((entry, index) => (
          <UserPreviewCard
            key={entry.key}
            userId={entry.userId}
            displayName={entry.displayName}
          >
            <span
              className={[
                styles['claim-badge__avatar-wrap'],
                index === 0 ? styles['claim-badge__avatar-wrap--lead'] : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <UserAvatar
                avatar={null}
                alt={entry.displayName}
                initials={entry.initials}
                className={styles['claim-badge__avatar']}
                imageClassName={styles['claim-badge__avatar-img']}
                initialsClassName={styles['claim-badge__avatar-initials']}
              />
              {entry.anonymousMarker ? (
                <span className={styles['claim-badge__anon-marker']} aria-hidden="true">
                  a
                </span>
              ) : null}
            </span>
          </UserPreviewCard>
        ))}
        {overflowCount > 0 ? (
          <span className={styles['claim-badge__overflow']} aria-hidden="true">
            +{overflowCount}
          </span>
        ) : null}
        {showAnonymousChip ? (
          <span className={styles['claim-badge__anonymous-chip']}>Anonymous</span>
        ) : null}
      </div>
    </UserAvatarBox>
  );
};
