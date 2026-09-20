import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import {
  MetadataGrid,
  FundingWidget,
  TaggingOverlay,
} from '../../item-presentation';
import { Header } from './components/header/header.component';
import { ClaimSection } from './components/claim-section/claim-section.component';
import styles from './view.module.css';

export const ViewTemplate: React.FC<TemplateProps> = (props) => {
  const {
    item,
    displayItem = item,
    isOwner,
    canCollaborate,
    allowGroupFunds,
    isFullyClaimed,
    isClaimUnavailable,
    totalExtractedPrice,
    totalClaimedAmount,
    showClaimForm,
    setShowClaimForm,
    anonymous,
    setAnonymous,
    claimLoading,
    handleClaim,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteLoading,
    handleDelete,
    onEdit,
    claimedByCurrentUser,
    handleUnclaim,
    canAdjustClaim = false,
    itemActions,
    claimUserId,
    claimActorName,
    linkedClaimPeers = [],
    hasLinkedUnclaimPeers = false,
    wishlistItemsForLinkedClaim = [],
    onLinkedClaimItemClick,
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadataBadgeEmoji,
    metadata,
    getSiteName,
    audienceLabel,
    isPrivate,
    onSelect,
    onView,
    rootClassName,
    itemClassName,
    elevateAboveWash,
    isLinkedToItems,
    isRelatedToItems,
    primaryLink,
    primaryPrice,
    primaryImageUrl,
    showQuantity,
    claimBadgeEntries,
    showClaimBadge,
    showFundingWidget,
    suggestedByDisplayName,
    hasPriority,
  } = props;

  return (
    <article className={itemClassName} data-testid="item-card-view">
      <div
        className={rootClassName}
        onClick={
          onSelect
            ? (e) => {
                const target = e.target as HTMLElement;
                if (target.closest('button') || target.closest('a') || target.closest('input')) {
                  return;
                }
                onSelect();
              }
            : undefined
        }
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect();
                }
              }
            : undefined
        }
      >
        <TaggingOverlay
          isTaggingModeActive = {
            !!isTaggingModeActive
          }
          onSelectTag = {
            onSelectTag
          }
        />

        {primaryImageUrl ? (
          <div className={styles['view__photo']}>
            <img src={primaryImageUrl} alt="" className={styles['view__photo-img']} />
          </div>
        ) : null}

        <Header
          item = {
            item
          }
          displayItem = {
            displayItem
          }
          isOwner = {
            isOwner
          }
          audienceLabel = {
            audienceLabel
          }
          isPrivate = {
            isPrivate
          }
          isTaggingModeActive = {
            isTaggingModeActive
          }
          isTaggedSelection = {
            isTaggedSelection
          }
          onSelectTag = {
            onSelectTag
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
          showQuantity = {
            showQuantity
          }
          claimBadgeEntries = {
            claimBadgeEntries
          }
          showClaimBadge = {
            showClaimBadge
          }
          suggestedByDisplayName = {
            suggestedByDisplayName
          }
          hasPriority = {
            hasPriority
          }
          metadata = {
            metadata
          }
          getSiteName = {
            getSiteName
          }
          elevateAboveWash = {
            elevateAboveWash
          }
        />

        {displayDescription ? (
          <p className={styles['view__desc']}>{displayDescription}</p>
        ) : null}

        <MetadataGrid
          predefinedDisplayEntries = {
            predefinedDisplayEntries
          }
          userDefinedEntries = {
            userDefinedEntries
          }
          metadataBadgeEmoji = {
            metadataBadgeEmoji
          }
        />

        {showFundingWidget ? (
          <FundingWidget
            totalExtractedPrice = {
              totalExtractedPrice
            }
            totalClaimedAmount = {
              totalClaimedAmount
            }
          />
        ) : null}

        <ClaimSection
          showClaimForm = {
            showClaimForm
          }
          isArchived = {
            props.isArchived
          }
          isExpired = {
            props.isExpired
          }
          displayItem = {
            displayItem
          }
          claimUserId = {
            claimUserId
          }
          claimActorName = {
            claimActorName
          }
          itemActions = {
            itemActions
          }
          anonymous = {
            anonymous
          }
          setAnonymous = {
            setAnonymous
          }
          setShowClaimForm = {
            setShowClaimForm
          }
          linkedClaimPeers = {
            linkedClaimPeers
          }
          wishlistItemsForLinkedClaim = {
            wishlistItemsForLinkedClaim
          }
          onLinkedClaimItemClick = {
            onLinkedClaimItemClick
          }
          allowGroupFunds = {
            allowGroupFunds
          }
          totalExtractedPrice = {
            totalExtractedPrice
          }
          totalClaimedAmount = {
            totalClaimedAmount
          }
          handleClaim = {
            () => handleClaim()
          }
          claimLoading = {
            claimLoading
          }
          isOwner = {
            isOwner
          }
          canCollaborate = {
            canCollaborate
          }
          isPublicGuest = {
            props.isPublicGuest
          }
          canEditItem = {
            props.canEditItem
          }
          claimedByCurrentUser = {
            claimedByCurrentUser
          }
          isFullyClaimed = {
            isFullyClaimed
          }
          isClaimUnavailable = {
            isClaimUnavailable
          }
          canAdjustClaim = {
            canAdjustClaim
          }
          showDeleteConfirm = {
            showDeleteConfirm
          }
          deleteLoading = {
            deleteLoading
          }
          onEdit = {
            onEdit
          }
          onView = {
            onView
          }
          handleUnclaim = {
            handleUnclaim
          }
          setShowDeleteConfirm = {
            setShowDeleteConfirm
          }
          handleDelete = {
            handleDelete
          }
          hasLinkedUnclaimPeers = {
            hasLinkedUnclaimPeers
          }
          elevateAboveWash = {
            elevateAboveWash
          }
          substitutionAction = {
            props.substitutionAction
          }
        />
      </div>
    </article>
  );
};
