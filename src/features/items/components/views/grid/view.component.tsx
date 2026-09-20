import React, { useState } from 'react';
import type { Props } from './interfaces/props.interface';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../utils/item-card-modifiers.util';
import { isItemGroupFundingInProgress } from '../../../utils/is-item-group-funding-active.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { ViewTemplate } from './view.html';
import styles from './view.module.css';

export const View: React.FC<Props> = (props) => {
  const {
    item,
    displayItem = item,
    isOwner,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
    allowGroupFunds,
    totalExtractedPrice,
    totalClaimedAmount,
    claimedByCurrentUser,
    isTaggedSelection,
    isSelected,
    onSelect,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    claimUserId,
  } = props;

  const [isHovered, setIsHovered] = useState(false);

  const isLinkedToItems = linkedItems.length > 0 || !!(isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || !!(isRelatingContext && isTaggedSelection);
  const primaryPrice = displayItem.Links[0]?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const { hasVisibleClaim } = resolveItemClaimBadgeState(
    displayItem.Claims,
    claimUserId,
    claimedByCurrentUser
  );
  const isSelectable = typeof onSelect === 'function';
  const suggestedByDisplayName = resolveSuggestedByDisplayName(item);

  const modifierClass = buildItemCardModifierClasses(
    {
      isPrivate,
      isFullyClaimed,
      claimedByCurrentUser,
      isOwner,
      isSuggestion: !!item.IsSuggestion,
      isTaggedSelection,
      isSelected,
    },
    styles
  );
  const isGroupFundingInProgress = isItemGroupFundingInProgress({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
    isFullyClaimed,
  });
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    hasVisibleClaimForGray ?? hasVisibleClaim,
    claimedByCurrentUser,
    styles,
    props.isArchived,
    isMultiCount,
    isGroupFundingInProgress
  );
  const groupFundingClass = getGroupFundingInProgressClass(isGroupFundingInProgress, styles);
  const userClaimedHighlightClass = getUserClaimedHighlightClass(claimedByCurrentUser, styles);

  const rootClassName = [
    styles['view'],
    modifierClass,
    claimedGrayClass,
    groupFundingClass,
    userClaimedHighlightClass,
    isSelected ? styles['view--selected'] : '',
    isSelectable ? styles['view--selectable'] : '',
    isSelectable && isHovered ? styles['view--hovered'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const iconClassName = [
    styles['view__icon'],
    isSelected ? styles['view__icon--selected'] : '',
    isSelectable && isHovered ? styles['view__icon--hovered'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ViewTemplate
      {...props}
      rootClassName = {
        rootClassName
      }
      iconClassName = {
        iconClassName
      }
      isLinkedToItems = {
        isLinkedToItems
      }
      isRelatedToItems = {
        isRelatedToItems
      }
      primaryPrice = {
        primaryPrice
      }
      primaryImageUrl = {
        primaryImageUrl
      }
      isSelectable = {
        isSelectable
      }
      isHovered = {
        isHovered
      }
      onHoverChange = {
        setIsHovered
      }
      suggestedByDisplayName = {
        suggestedByDisplayName
      }
    />
  );
};
