import React from 'react';
import { CLAIM_BADGE_MAX_VISIBLE_AVATARS } from './constants/claim-badge-max-visible-avatars.constant';
import type { Props } from './interfaces/props.interface';
import {
  buildClaimBadgeAriaLabel,
  getClaimInitials,
} from './utils/claim-badge-display.util';
import { ClaimBadgeTemplate } from './claim-badge.html';

export const ClaimBadge: React.FC<Props> = ({ entries }) => {
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
      <ClaimBadgeTemplate
        mode = {
          'anonymous-only'
        }
        ariaLabel = {
          ariaLabel
        }
        visibleEntries = {
          []
        }
        overflowCount = {
          0
        }
        showAnonymousChip = {
          false
        }
      />
    );
  }

  const visibleEntries = visibleNamed.map((entry) => ({
    key: entry.key,
    userId: entry.userId!,
    displayName: entry.displayName,
    initials: getClaimInitials(entry.displayName),
    anonymousMarker: entry.anonymousMarker,
  }));

  return (
    <ClaimBadgeTemplate
      mode = {
        'avatars'
      }
      ariaLabel = {
        ariaLabel
      }
      visibleEntries = {
        visibleEntries
      }
      overflowCount = {
        overflowCount
      }
      showAnonymousChip = {
        !!anonymousEntry
      }
    />
  );
};
