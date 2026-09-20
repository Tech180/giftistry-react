import React from 'react';
import type { Props } from './interfaces/props.interface';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../utils/item-card-modifiers.util';
import { isItemGroupFundingActive, isItemGroupFundingInProgress } from '../../../utils/is-item-group-funding-active.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { ViewTemplate } from './view.html';
import styles from './view.module.css';

export const View: React.FC<Props> = (props) => {
  const {
    item,
    displayItem = item,
    isOwner,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
    totalExtractedPrice,
    totalClaimedAmount,
    claimedByCurrentUser,
    claimUserId,
    claimActorName,
    isTaggedSelection,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    metadata,
    isSelected,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || !!(isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || !!(isRelatingContext && isTaggedSelection);
  const primaryPrice = displayItem.Links[0]?.ExtractedPrice;
  const showQuantity = resolveItemQuantitySummary(displayItem, metadata).shouldDisplay;
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(
      displayItem.Claims,
      claimUserId,
      claimedByCurrentUser,
      claimActorName
    );

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
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );
  const rootClassName = [
    styles['view'],
    modifierClass,
    claimedGrayClass,
    groupFundingClass,
    userClaimedHighlightClass,
  ]
    .filter(Boolean)
    .join(' ');
  const showFundingWidget = isItemGroupFundingActive({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
  });
  const suggestedByDisplayName = resolveSuggestedByDisplayName(item);
  const hasPriority = hasPriorityValue(item.Priority);

  return (
    <ViewTemplate
      {...props}
      rootClassName = {
        rootClassName
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
      showQuantity = {
        showQuantity
      }
      claimBadgeEntries = {
        claimBadgeEntries
      }
      showClaimBadge = {
        showClaimBadge
      }
      showFundingWidget = {
        showFundingWidget
      }
      suggestedByDisplayName = {
        suggestedByDisplayName
      }
      hasPriority = {
        hasPriority
      }
    />
  );
};
