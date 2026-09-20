import React from 'react';
import { getClaimInitials } from '../claim-badge/utils/claim-badge-display.util';
import type { Props } from './interfaces/props.interface';
import { SuggestionBadgeTemplate } from './suggestion-badge.html';
import styles from './suggestion-badge.module.css';

export const SuggestionBadge: React.FC<Props> = ({ userId, displayName }) => {
  return (
    <SuggestionBadgeTemplate
      userId = {
        userId
      }
      displayName = {
        displayName
      }
      ariaLabel = {
        `Suggestion by ${displayName}`
      }
      initials = {
        getClaimInitials(displayName)
      }
      avatarClassName = {
        styles['suggestion-badge-avatar']
      }
      avatarImageClassName = {
        styles['suggestion-badge-avatar-img']
      }
      avatarInitialsClassName = {
        styles['suggestion-badge-avatar-initials']
      }
    />
  );
};
