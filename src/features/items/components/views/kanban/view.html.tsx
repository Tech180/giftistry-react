import React from 'react';
import { Link2, Layers2 } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  FundingWidget,
  TaggingOverlay,
  TaggingSelect,
  QuantityBadge,
  PriorityDisplay,
} from '../../item-presentation';
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
    audienceLabel,
    isPrivate,
    metadata,
    onSelect,
    onView,
    rootClassName,
    isLinkedToItems,
    isRelatedToItems,
    primaryPrice,
    showQuantity,
    claimBadgeEntries,
    showClaimBadge,
    showFundingWidget,
    suggestedByDisplayName,
    hasPriority,
  } = props;

  return (
    <div
      className={rootClassName}
      data-testid="item-card-view"
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
        isTaggingModeActive={isTaggingModeActive}
        onSelectTag={onSelectTag}
      />

      <div className={styles['view__header']}>
        {isTaggingModeActive && (
          <TaggingSelect
            isTaggingModeActive={isTaggingModeActive}
            isTaggedSelection={isTaggedSelection}
            onSelectTag={onSelectTag}
          />
        )}
        <h4 className={styles['view__title']}>
          {isLinkedToItems && (
            <Link2 size={12} className={styles['view__linked-icon']} aria-hidden="true" />
          )}
          {isRelatedToItems && (
            <Layers2 size={12} className={styles['view__linked-icon']} aria-label="Related to other items" />
          )}
          {displayItem.Name}
        </h4>
        {hasPriority && item.Priority != null && (
          <PriorityDisplay priority={item.Priority} variant="meta" />
        )}
      </div>

      <div className={styles['view__badges']}>
        <Badges
          item={item}
          audienceLabel={audienceLabel}
          isPrivate={isPrivate}
          showPriority={false}
        />
      </div>

      {showFundingWidget && (
        <FundingWidget
          totalExtractedPrice={totalExtractedPrice}
          totalClaimedAmount={totalClaimedAmount}
        />
      )}

      <div className={styles['view__meta']}>
        <span>{item.Links.length} link{item.Links.length !== 1 ? 's' : ''}</span>
        {(primaryPrice != null || showClaimBadge || showQuantity) && (
          <div className={styles['view__price-row']}>
            <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
            {primaryPrice != null && (
              <span className={styles['view__price']}>${primaryPrice}</span>
            )}
            {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
            {item.IsSuggestion && (
              <SuggestionBadge
                userId={item.SuggestedByUserId}
                displayName={suggestedByDisplayName}
              />
            )}
          </div>
        )}
      </div>

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
        substitutionAction = {
          props.substitutionAction
        }
      />
    </div>
  );
};
