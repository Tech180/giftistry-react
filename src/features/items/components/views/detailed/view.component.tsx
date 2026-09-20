import React from 'react';
import type { Props } from './interfaces/props.interface';
import { useItemsSession } from '../../../providers/session';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../utils/item-card-modifiers.util';
import { isItemGroupFundingActive, isItemGroupFundingInProgress } from '../../../utils/is-item-group-funding-active.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { shouldShowActionButtons } from '../../item-presentation';
import {
  CLAIM_FORM_CONFIRM_LINKED,
  CLAIM_FORM_PROMPT_CLAIM_LINKED,
} from '../../item-presentation/claim-form/constants/claim-form-copy.constant';
import { ViewTemplate } from './view.html';
import styles from './view.module.css';

export const View: React.FC<Props> = (props) => {
  const {
    item,
    displayItem = item,
    substitutionOptions,
    substitutionActiveIndex,
    isOwner,
    canCollaborate,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
    isClaimUnavailable,
    totalExtractedPrice,
    totalClaimedAmount,
    showClaimForm,
    claimedByCurrentUser,
    canAdjustClaim = false,
    claimUserId,
    claimActorName,
    linkedClaimPeers = [],
    isTaggedSelection,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    isSelected,
    onView,
    audienceLabel,
  } = props;

  const { user } = useItemsSession();
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);

  const isLinkedToItems = linkedItems.length > 0 || !!(isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || !!(isRelatingContext && isTaggedSelection);
  const primaryLink = displayItem.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const sharingUsers = item.SharedWith ?? [];
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(
      displayItem.Claims,
      claimUserId,
      claimedByCurrentUser,
      claimActorName
    );
  const showActionButtons =
    !!onView ||
    shouldShowActionButtons({
      isOwner,
      canCollaborate,
      claimedByCurrentUser,
      isFullyClaimed,
      isClaimUnavailable,
      canAdjustClaim,
      isPublicGuest: props.isPublicGuest,
      canEditItem: props.canEditItem,
      isArchived: props.isArchived,
      isExpired: props.isExpired,
    });
  const showFundingWidget = isItemGroupFundingActive({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
  });
  const hasSubstitutionBrowse = (substitutionOptions?.length ?? 0) > 0;
  const substitutionTotal = (substitutionOptions?.length ?? 0) + 1;
  const substitutionIndex = Math.min(
    Math.max(substitutionActiveIndex ?? 0, 0),
    Math.max(substitutionTotal - 1, 0)
  );
  const hasPriority = hasPriorityValue(item.Priority);
  const hasMetaEnd =
    showSharingAvatars || showClaimBadge || !!item.IsSuggestion || hasPriority;
  const suggestedByDisplayName = resolveSuggestedByDisplayName(item);
  const badgesAudienceLabel = showSharingAvatars ? null : audienceLabel;
  const hasLinkedClaimPeers = linkedClaimPeers.length > 0;
  const linkedClaimTaggedIds = linkedClaimPeers.map((peer) => peer.Id);
  const claimFormPrompt = hasLinkedClaimPeers ? CLAIM_FORM_PROMPT_CLAIM_LINKED : undefined;
  const claimConfirmLabel = hasLinkedClaimPeers ? CLAIM_FORM_CONFIRM_LINKED : 'Yes';
  const showClaimDrawerContent = showClaimForm && !props.isArchived && !props.isExpired;

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
    styles.view,
    modifierClass,
    claimedGrayClass,
    groupFundingClass,
    userClaimedHighlightClass,
  ]
    .filter(Boolean)
    .join(' ');
  const drawerClassName = [
    styles['view__claim-drawer'],
    showClaimForm ? styles['view__claim-drawer--open'] : '',
    showClaimForm && claimedByCurrentUser
      ? styles['view__claim-drawer--open-user-claimed']
      : '',
  ]
    .filter(Boolean)
    .join(' ');
  const footerClassName = [
    styles['view__footer'],
    claimedByCurrentUser ? styles['view__footer--user-claimed'] : '',
    showClaimForm ? styles['view__footer--hidden'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const headerClassName = [
    styles['view__header'],
    hasSubstitutionBrowse ? styles['view__header--with-aside'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const starBtnClassName = [
    styles['view__star'],
    props.isFavorite ? styles['view__star--active'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ViewTemplate
      {...props}
      showSharingAvatars = {
        showSharingAvatars
      }
      rootClassName = {
        rootClassName
      }
      drawerClassName = {
        drawerClassName
      }
      footerClassName = {
        footerClassName
      }
      headerClassName = {
        headerClassName
      }
      starBtnClassName = {
        starBtnClassName
      }
      isLinkedToItems = {
        isLinkedToItems
      }
      isRelatedToItems = {
        isRelatedToItems
      }
      primaryImageUrl = {
        primaryImageUrl
      }
      primaryPrice = {
        primaryPrice
      }
      primaryLink = {
        primaryLink
      }
      claimBadgeEntries = {
        claimBadgeEntries
      }
      showClaimBadge = {
        showClaimBadge
      }
      showActionButtons = {
        showActionButtons
      }
      showFundingWidget = {
        showFundingWidget
      }
      hasSubstitutionBrowse = {
        hasSubstitutionBrowse
      }
      substitutionIndex = {
        substitutionIndex
      }
      substitutionTotal = {
        substitutionTotal
      }
      hasMetaEnd = {
        hasMetaEnd
      }
      hasPriority = {
        hasPriority
      }
      sharingUsers = {
        sharingUsers
      }
      suggestedByDisplayName = {
        suggestedByDisplayName
      }
      badgesAudienceLabel = {
        badgesAudienceLabel
      }
      showClaimDrawerContent = {
        showClaimDrawerContent
      }
      hasLinkedClaimPeers = {
        hasLinkedClaimPeers
      }
      linkedClaimTaggedIds = {
        linkedClaimTaggedIds
      }
      claimFormPrompt = {
        claimFormPrompt
      }
      claimConfirmLabel = {
        claimConfirmLabel
      }
    />
  );
};
