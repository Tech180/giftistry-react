import React from 'react';
import {
  SUBSTITUTION_COUNTER_LABEL,
  SUBSTITUTION_OWNER_APPROVED_BADGE_LABEL,
} from '../../../../constants/substitution-messages.constant';
import { getClaimInitials } from '../../claim-badge/utils/claim-badge-display.util';
import type { Props } from './interfaces/props.interface';
import { BadgeTemplate } from './badge.html';
import styles from './badge.module.css';

export const Badge: React.FC<Props> = ({
  kind,
  createdByUserId = null,
  createdByDisplayName = 'Someone',
}) => {
  if (kind === 'original') {
    return null;
  }

  if (kind === 'owner_approved') {
    return (
      <BadgeTemplate
        mode = {
          'owner-approved'
        }
        ownerApprovedLabel = {
          SUBSTITUTION_OWNER_APPROVED_BADGE_LABEL
        }
        ownerClassName = {
          `${styles.badge} ${styles['badge-owner']}`
        }
      />
    );
  }

  return (
    <BadgeTemplate
      mode = {
        'user'
      }
      counterLabel = {
        SUBSTITUTION_COUNTER_LABEL
      }
      ariaLabel = {
        `Substitution by ${createdByDisplayName}`
      }
      displayName = {
        createdByDisplayName
      }
      initials = {
        getClaimInitials(createdByDisplayName)
      }
      createdByUserId = {
        createdByUserId
      }
      avatarClassName = {
        styles['badge-user-avatar']
      }
      avatarImageClassName = {
        styles['badge-user-avatar-img']
      }
      avatarInitialsClassName = {
        styles['badge-user-avatar-initials']
      }
    />
  );
};
