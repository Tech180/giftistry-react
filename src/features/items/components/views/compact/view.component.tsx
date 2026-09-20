import React, { useState } from 'react';
import type { Props } from './interfaces/props.interface';
import { useItemsSession } from '../../../providers/session';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { useColumnSyncContext } from './category-list';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../utils/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import {
  isItemGroupFundingActive,
  isItemGroupFundingInProgress,
} from '../../../utils/is-item-group-funding-active.util';
import { CLAIM_FORM_PROMPT_CLAIM_LINKED } from '../../item-presentation/claim-form/constants/claim-form-copy.constant';
import { buildColClass } from './utils/build-col-class.util';
import { ViewTemplate } from './view.html';
import styles from './view.module.css';

export const View: React.FC<Props> = (props) => {
  const { user } = useItemsSession();
  const { columnPresence, isSyncEnabled } = useColumnSyncContext();
  const showSharingAvatars = shouldShowSharingAvatars(props.item, props.isOwner, user?.Id);
  const [isHovered, setIsHovered] = useState(false);

  const {
    item,
    displayItem = item,
    substitutionOptions,
    substitutionActiveIndex,
    isOwner,
    canCollaborate,
    isPublicGuest = false,
    canEditItem,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
    totalExtractedPrice,
    totalClaimedAmount,
    showClaimForm,
    claimedByCurrentUser,
    canAdjustClaim = false,
    itemActions,
    claimUserId,
    claimActorName,
    linkedClaimPeers = [],
    hasLinkedUnclaimPeers = false,
    isTaggingModeActive,
    isTaggedSelection,
    isExpanded,
    setIsExpanded,
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadata,
    getSiteName,
    audienceLabel,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    isSelected,
    onSelect,
    onView,
    showDeleteConfirm,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || !!(isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || !!(isRelatingContext && isTaggedSelection);
  const primaryLink = displayItem.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const sharingUsers = item.SharedWith ?? [];
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(displayItem.Claims, claimUserId, claimedByCurrentUser, claimActorName);

  const hasSubstitutionBrowse = (substitutionOptions?.length ?? 0) > 0;
  const substitutionTotal = (substitutionOptions?.length ?? 0) + 1;
  const substitutionIndex = Math.min(
    Math.max(substitutionActiveIndex ?? 0, 0),
    Math.max(substitutionTotal - 1, 0)
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
  const userClaimedHighlightClass = getUserClaimedHighlightClass(claimedByCurrentUser, styles);
  const isHighlighted = !!(isExpanded || isHovered);
  const rootClassName = [
    styles.view,
    modifierClass,
    claimedGrayClass,
    groupFundingClass,
    userClaimedHighlightClass,
    hasSubstitutionBrowse ? styles['view--with-subs'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const innerClassName = [
    styles['view__inner'],
    claimedByCurrentUser && isHighlighted
      ? styles['view__inner--user-claimed-active']
      : '',
    claimedByCurrentUser && !isHighlighted ? styles['view__inner--user-claimed'] : '',
    !claimedByCurrentUser && isHighlighted ? styles['view__inner--highlighted'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const trailingSurfaceClassName = [
    styles['view__trailing'],
    claimedByCurrentUser && isHighlighted
      ? styles['view__trailing--user-claimed-active']
      : '',
    !claimedByCurrentUser && isHighlighted ? styles['view__trailing--highlighted'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const showCompactActions =
    !isPublicGuest &&
    !!(canCollaborate || !isOwner || canEditItem) &&
    !props.isArchived &&
    !props.isExpired;
  const hasPriority = hasPriorityValue(item.Priority);
  const reserveSelect = isSyncEnabled ? columnPresence.select : !!isTaggingModeActive;
  const showRelationsIcons = isLinkedToItems || isRelatedToItems;
  const reserveRelations =
    !!(isSyncEnabled && columnPresence.relations) || showRelationsIcons;
  const reserveAudienceGroup = isSyncEnabled
    ? columnPresence.audience
    : showSharingAvatars || !!item.IsSuggestion || showClaimBadge;
  const reserveFunding = isSyncEnabled
    ? columnPresence.funding
    : isItemGroupFundingActive({
        allowGroupFunds,
        fundingTarget: totalExtractedPrice,
        totalClaimedAmount,
      });
  const reserveTrailing = isSyncEnabled
    ? columnPresence.trailing
    : !!primaryLink || !!onView || showCompactActions;
  const showQuantityBadge = (() => {
    const quantity = resolveItemQuantitySummary(item, metadata);
    if (!quantity.shouldDisplay) {
      return false;
    }
    if (!isOwner) {
      return Math.max(0, quantity.desiredQuantity - quantity.claimedQuantity) > 0;
    }
    return true;
  })();
  const reserveQuantity = isSyncEnabled ? showQuantityBadge : false;
  const showSecondaryRow = reserveFunding || reserveTrailing;
  const hasPrimaryMetaAfterTitle =
    reserveRelations ||
    reserveAudienceGroup ||
    showSharingAvatars ||
    !!item.IsSuggestion ||
    showClaimBadge ||
    showQuantityBadge;
  const hasTrailingContent = !!primaryLink || !!onView || showCompactActions;
  const hasFundingContent = isItemGroupFundingActive({
    allowGroupFunds,
    fundingTarget: totalExtractedPrice,
    totalClaimedAmount,
  });
  const showGuestClaimActions = showCompactActions && !canCollaborate && !showClaimForm;
  const showWideClaimActionPair =
    !!(showGuestClaimActions && claimedByCurrentUser && canAdjustClaim);
  const syncClaimActionWidth = !!(isSyncEnabled && columnPresence.claimActions);
  const useSyncedClaimActionWidth = syncClaimActionWidth && showGuestClaimActions;
  const useSyncedConfirmButtons = !!(
    syncClaimActionWidth &&
    ((showClaimForm && !canCollaborate) || showDeleteConfirm)
  );
  const spanClaimActionWidth =
    useSyncedClaimActionWidth ||
    !!(
      isSyncEnabled &&
      columnPresence.wideClaimActions &&
      showGuestClaimActions &&
      !showWideClaimActionPair
    );
  const hasExpandableContent =
    !!primaryImageUrl ||
    !!displayDescription?.trim() ||
    predefinedDisplayEntries.length > 0 ||
    userDefinedEntries.length > 0 ||
    hasFundingContent;

  const leadingCol = buildColClass(styles, 'view__col--leading', {
    filled: true,
    dividerAfter: true,
  });
  const selectCol = buildColClass(styles, 'view__col--select', {
    filled: isTaggingModeActive,
    dividerAfter: isTaggingModeActive,
  });
  const titleCol = buildColClass(styles, 'view__col--title', {
    filled: true,
    dividerAfter: hasPrimaryMetaAfterTitle,
  });
  const relationsCol = buildColClass(styles, 'view__col--relations', {
    filled: reserveRelations,
    dividerAfter: reserveRelations,
  });
  const audienceGroupCol = buildColClass(styles, 'view__col--audience-group', {
    filled: reserveAudienceGroup,
    dividerAfter: reserveAudienceGroup,
  });
  const quantityCol = buildColClass(styles, 'view__col--quantity', {
    filled: showQuantityBadge,
    dividerAfter: showQuantityBadge,
  });
  const priceCol = buildColClass(styles, 'view__col--price', {
    filled: true,
    dividerBefore: true,
  });
  const fundingCol = buildColClass(styles, 'view__col--funding', {
    filled: hasFundingContent,
    dividerAfter: hasFundingContent && hasTrailingContent,
  });
  const trailingCol = buildColClass(styles, 'view__col--trailing', {
    filled: hasTrailingContent,
    dividerBefore: hasTrailingContent,
  });

  const rowClassName = [
    styles['view__row'],
    hasExpandableContent ? styles['view__row--expandable'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const actionsClassName = [
    styles['view__actions'],
    spanClaimActionWidth ? styles['view__actions--wide-claim'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const confirmButtonsClassName = [
    styles['view__confirm-buttons'],
    useSyncedConfirmButtons ? styles['view__confirm-buttons--synced'] : '',
    claimedByCurrentUser && isHighlighted
      ? styles['view__confirm-buttons--user-claimed-active']
      : '',
    !claimedByCurrentUser && isHighlighted
      ? styles['view__confirm-buttons--highlighted']
      : '',
  ]
    .filter(Boolean)
    .join(' ');
  const claimFormPanelClassName = canAdjustClaim
    ? styles['view__confirm-extension-stack']
    : styles['view__confirm-extension'];
  const actionBtnClassName = `${styles['view__action-btn']} ${styles['view__action-btn--trail']}`;
  const actionBtnClaimClassName = [
    actionBtnClassName,
    styles['view__action-btn--claim'],
    spanClaimActionWidth ? styles['view__action-btn--stretch'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const actionBtnDangerClassName = `${actionBtnClassName} ${styles['view__action-btn--danger']}`;
  const actionBtnClaimDangerClassName = `${actionBtnClaimClassName} ${styles['view__action-btn--danger']}`;
  const actionBtnPrimaryClassName = `${styles['view__action-btn']} ${styles['view__action-btn--primary']}`;
  const actionBtnConfirmClassName = `${styles['view__action-btn']} ${styles['view__action-btn--confirm']}`;
  const actionBtnConfirmPrimaryClassName = `${actionBtnConfirmClassName} ${styles['view__action-btn--primary']}`;
  const switcherClassName = styles['view__switcher'];
  const bodyClassName = styles['view__body'];
  const primaryClassName = styles['view__primary'];
  const starClassName = styles['view__star'];
  const starBtnClassName = styles['view__star-btn'];
  const priorityInlineClassName = styles['view__priority-inline'];
  const mainClassName = styles['view__main'];
  const titleClassName = styles['view__title'];
  const subBadgesClassName = styles['view__sub-badges'];
  const metaSubClassName = styles['view__meta-sub'];
  const linkedIconClassName = styles['view__linked-icon'];
  const priceValueClassName = styles['view__price-value'];
  const secondaryClassName = styles['view__secondary'];

  const showClaimFormWithActions = !!(
    showClaimForm &&
    itemActions &&
    !props.isArchived &&
    !props.isExpired
  );
  const showClaimFormPrompt = !!(
    showClaimForm &&
    !itemActions &&
    !canAdjustClaim &&
    !props.isArchived &&
    !props.isExpired
  );
  const showDeleteConfirmPanel = !!(
    showDeleteConfirm &&
    !props.isArchived &&
    !props.isExpired
  );
  const showExpanded = !!(hasExpandableContent && isExpanded);
  const showExpandedMetadata =
    predefinedDisplayEntries.length > 0 || userDefinedEntries.length > 0;
  const canShowEditActions = !!(showCompactActions && (canEditItem ?? canCollaborate));
  const claimActionsDivided = !!(onView || canShowEditActions);
  const claimActionsClassName = [
    styles['view__claim-actions'],
    claimActionsDivided ? styles['view__claim-actions--divided'] : '',
    spanClaimActionWidth || showWideClaimActionPair
      ? styles['view__claim-actions--wide']
      : '',
  ]
    .filter(Boolean)
    .join(' ');
  const showLinkedClaimTags = linkedClaimPeers.length > 0;
  const claimPrompt = showLinkedClaimTags ? CLAIM_FORM_PROMPT_CLAIM_LINKED : undefined;
  const claimConfirmLabel = showLinkedClaimTags ? 'Claim all' : 'Yes';
  const unclaimLabel = hasLinkedUnclaimPeers ? 'Unclaim all' : 'Unclaim';
  const linkedClaimPeerIds = linkedClaimPeers.map((peer) => peer.Id);
  const badgesAudienceLabel = showSharingAvatars ? null : audienceLabel;
  const suggestedByDisplayName = resolveSuggestedByDisplayName(item);
  const primaryPriceLabel = primaryPrice != null ? `$${primaryPrice}` : '\u2014';
  const primaryLinkTitle = primaryLink
    ? getSiteName(primaryLink.Url, primaryLink.RetailerName)
    : '';
  const primaryLinkAriaLabel = primaryLink
    ? `Open ${getSiteName(primaryLink.Url, primaryLink.RetailerName)}`
    : '';

  const handleCompactRowActivate = () => {
    onSelect?.();
    if (hasExpandableContent) {
      setIsExpanded?.(!isExpanded);
    }
  };

  const onCompactRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    handleCompactRowActivate();
  };

  const onCompactRowKeyDown = hasExpandableContent
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCompactRowActivate();
        }
      }
    : undefined;

  return (
    <ViewTemplate
      {...props}
      showSharingAvatars = {
        showSharingAvatars
      }
      columnPresence = {
        columnPresence
      }
      isSyncEnabled = {
        isSyncEnabled
      }
      rootClassName = {
        rootClassName
      }
      switcherClassName = {
        switcherClassName
      }
      innerClassName = {
        innerClassName
      }
      bodyClassName = {
        bodyClassName
      }
      primaryClassName = {
        primaryClassName
      }
      starClassName = {
        starClassName
      }
      starBtnClassName = {
        starBtnClassName
      }
      priorityInlineClassName = {
        priorityInlineClassName
      }
      mainClassName = {
        mainClassName
      }
      titleClassName = {
        titleClassName
      }
      subBadgesClassName = {
        subBadgesClassName
      }
      metaSubClassName = {
        metaSubClassName
      }
      linkedIconClassName = {
        linkedIconClassName
      }
      priceValueClassName = {
        priceValueClassName
      }
      secondaryClassName = {
        secondaryClassName
      }
      rowClassName = {
        rowClassName
      }
      actionsClassName = {
        actionsClassName
      }
      claimActionsClassName = {
        claimActionsClassName
      }
      trailingClassName = {
        trailingSurfaceClassName
      }
      confirmButtonsClassName = {
        confirmButtonsClassName
      }
      claimFormPanelClassName = {
        claimFormPanelClassName
      }
      actionBtnClassName = {
        actionBtnClassName
      }
      actionBtnClaimClassName = {
        actionBtnClaimClassName
      }
      actionBtnDangerClassName = {
        actionBtnDangerClassName
      }
      actionBtnClaimDangerClassName = {
        actionBtnClaimDangerClassName
      }
      actionBtnPrimaryClassName = {
        actionBtnPrimaryClassName
      }
      actionBtnConfirmClassName = {
        actionBtnConfirmClassName
      }
      actionBtnConfirmPrimaryClassName = {
        actionBtnConfirmPrimaryClassName
      }
      onRootMouseEnter = {
        () => setIsHovered(true)
      }
      onRootMouseLeave = {
        () => setIsHovered(false)
      }
      isLinkedToItems = {
        isLinkedToItems
      }
      isRelatedToItems = {
        isRelatedToItems
      }
      primaryLink = {
        primaryLink
      }
      primaryPrice = {
        primaryPrice
      }
      primaryPriceLabel = {
        primaryPriceLabel
      }
      primaryImageUrl = {
        primaryImageUrl
      }
      primaryLinkTitle = {
        primaryLinkTitle
      }
      primaryLinkAriaLabel = {
        primaryLinkAriaLabel
      }
      sharingUsers = {
        sharingUsers
      }
      claimBadgeEntries = {
        claimBadgeEntries
      }
      showClaimBadge = {
        showClaimBadge
      }
      hasSubstitutionBrowse = {
        hasSubstitutionBrowse
      }
      substitutionTotal = {
        substitutionTotal
      }
      substitutionIndex = {
        substitutionIndex
      }
      showCompactActions = {
        showCompactActions
      }
      hasPriority = {
        hasPriority
      }
      showRelationsIcons = {
        showRelationsIcons
      }
      reserveSelect = {
        reserveSelect
      }
      reserveRelations = {
        reserveRelations
      }
      reserveAudienceGroup = {
        reserveAudienceGroup
      }
      reserveFunding = {
        reserveFunding
      }
      reserveTrailing = {
        reserveTrailing
      }
      reserveQuantity = {
        reserveQuantity
      }
      showQuantityBadge = {
        showQuantityBadge
      }
      showSecondaryRow = {
        showSecondaryRow
      }
      hasFundingContent = {
        hasFundingContent
      }
      hasExpandableContent = {
        hasExpandableContent
      }
      showGuestClaimActions = {
        showGuestClaimActions
      }
      showWideClaimActionPair = {
        showWideClaimActionPair
      }
      useSyncedClaimActionWidth = {
        useSyncedClaimActionWidth
      }
      useSyncedConfirmButtons = {
        useSyncedConfirmButtons
      }
      spanClaimActionWidth = {
        spanClaimActionWidth
      }
      showClaimFormWithActions = {
        showClaimFormWithActions
      }
      showClaimFormPrompt = {
        showClaimFormPrompt
      }
      showDeleteConfirmPanel = {
        showDeleteConfirmPanel
      }
      showExpanded = {
        showExpanded
      }
      showExpandedMetadata = {
        showExpandedMetadata
      }
      canShowEditActions = {
        canShowEditActions
      }
      showLinkedClaimTags = {
        showLinkedClaimTags
      }
      claimPrompt = {
        claimPrompt
      }
      claimConfirmLabel = {
        claimConfirmLabel
      }
      unclaimLabel = {
        unclaimLabel
      }
      linkedClaimPeerIds = {
        linkedClaimPeerIds
      }
      badgesAudienceLabel = {
        badgesAudienceLabel
      }
      suggestedByDisplayName = {
        suggestedByDisplayName
      }
      leadingCol = {
        leadingCol
      }
      selectCol = {
        selectCol
      }
      titleCol = {
        titleCol
      }
      relationsCol = {
        relationsCol
      }
      audienceGroupCol = {
        audienceGroupCol
      }
      quantityCol = {
        quantityCol
      }
      priceCol = {
        priceCol
      }
      fundingCol = {
        fundingCol
      }
      trailingCol = {
        trailingCol
      }
      onCompactRowClick = {
        onCompactRowClick
      }
      onCompactRowKeyDown = {
        onCompactRowKeyDown
      }
      compactRowRole = {
        hasExpandableContent ? 'button' : undefined
      }
      compactRowTabIndex = {
        hasExpandableContent ? 0 : undefined
      }
    />
  );
};
