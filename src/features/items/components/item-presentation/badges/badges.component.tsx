import React from 'react';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import type { Props } from './interfaces/props.interface';
import { resolveAudienceIconKind } from './utils/resolve-audience-icon-kind.util';
import { BadgesTemplate } from './badges.html';

export const Badges: React.FC<Props> = ({
  item,
  audienceLabel,
  isPrivate,
  showPriority = true,
}) => {
  const audienceIconKind = audienceLabel ? resolveAudienceIconKind(audienceLabel) : null;
  const sharedWithCount =
    audienceLabel === 'Shared with' && item.SharedWith && item.SharedWith.length > 0
      ? item.SharedWith.length
      : 0;
  const priority = hasPriorityValue(item.Priority) ? item.Priority : null;
  const showPriorityBadge = showPriority && priority !== null;

  return (
    <BadgesTemplate
      audienceLabel = {
        audienceLabel
      }
      audienceIconKind = {
        audienceIconKind
      }
      isPrivate = {
        isPrivate
      }
      sharedWithCount = {
        sharedWithCount
      }
      showPriority = {
        showPriorityBadge
      }
      priority = {
        priority
      }
    />
  );
};
