import React from 'react';
import { Star, Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  MetadataGrid,
  FundingWidget,
  TaggingOverlay,
  TaggingSelect,
  SharingAvatars,
  QuantityBadge,
  PriorityDisplay,
  SubstitutionSwitcher,
  SubstitutionCounterBadge,
  SubstitutionBadge,
} from '../../item-presentation';
import { ClaimDrawer } from './components/claim-drawer/claim-drawer.component';
import { FooterActions } from './components/footer-actions/footer-actions.component';
import styles from './view.module.css';

export const ViewTemplate: React.FC<TemplateProps> = (props) => {
  const {
    item,
    displayItem = item,
    substitutionOptions,
    substitutionActiveIndex,
    onSubstitutionIndexChange,
    substitutionAction = null,
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
    isFavorite,
    toggleFavorite,
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
    metadata,
    metadataBadgeEmoji,
    getSiteName,
    isPrivate,
    onSelect,
    onView,
    showSharingAvatars,
    rootClassName,
    drawerClassName,
    footerClassName,
    headerClassName,
    starBtnClassName,
    isLinkedToItems,
    isRelatedToItems,
    primaryImageUrl,
    primaryPrice,
    primaryLink,
    claimBadgeEntries,
    showClaimBadge,
    showActionButtons,
    showFundingWidget,
    hasSubstitutionBrowse,
    substitutionIndex,
    substitutionTotal,
    hasMetaEnd,
    hasPriority,
    sharingUsers,
    suggestedByDisplayName,
    badgesAudienceLabel,
    showClaimDrawerContent,
    hasLinkedClaimPeers,
    linkedClaimTaggedIds,
    claimFormPrompt,
    claimConfirmLabel,
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
        isTaggingModeActive = {
          !!isTaggingModeActive
        }
        onSelectTag = {
          onSelectTag
        }
      />

      <SubstitutionSwitcher
        parent = {
          item
        }
        options = {
          substitutionOptions
        }
        userId = {
          claimUserId
        }
        activeIndex = {
          substitutionActiveIndex
        }
        onActiveIndexChange = {
          onSubstitutionIndexChange
        }
      >
        {(active) => (
          <div className={styles['view__body']}>
            {primaryImageUrl && (
              <div className={styles['view__photo']}>
                <img src={primaryImageUrl} alt="" className={styles['view__photo-img']} />
              </div>
            )}
            <div className={styles['view__content']}>
              <div className={headerClassName}>
                <div className={styles['view__header-main']}>
                  {!hasSubstitutionBrowse ? (
                    <div className={styles['view__meta-row']}>
                      {primaryLink ? (
                        <a
                          href={primaryLink.Url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles['view__brand-link']}
                        >
                          {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                          <LinkIcon size={12} aria-hidden="true" />
                        </a>
                      ) : (
                        <span />
                      )}
                      {hasMetaEnd ? (
                        <div className={styles['view__meta-end']}>
                          {showSharingAvatars && (
                            <SharingAvatars users={sharingUsers} isOwner={isOwner} />
                          )}
                          {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
                          {item.IsSuggestion && (
                            <SuggestionBadge
                              userId={item.SuggestedByUserId}
                              displayName={suggestedByDisplayName}
                            />
                          )}
                          {hasPriority && (
                            <PriorityDisplay
                              priority={item.Priority as number}
                              variant="meta"
                            />
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : primaryLink ? (
                    <a
                      href={primaryLink.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles['view__brand-link']}
                    >
                      {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                      <LinkIcon size={12} aria-hidden="true" />
                    </a>
                  ) : null}

                  <div className={styles['view__title-row']}>
                    <div className={styles['view__title-cluster']}>
                      {isTaggingModeActive && (
                        <TaggingSelect
                          isTaggingModeActive={isTaggingModeActive}
                          isTaggedSelection={isTaggedSelection}
                          onSelectTag={onSelectTag}
                        />
                      )}
                      {canCollaborate ? (
                        <button
                          type="button"
                          onClick={toggleFavorite}
                          className={starBtnClassName}
                          title="Toggle favorite"
                        >
                          <Star
                            size={18}
                            fill={isFavorite ? 'var(--warning)' : 'none'}
                            stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                          />
                        </button>
                      ) : isFavorite ? (
                        <span className={styles['view__star-display']} aria-label="Favorited">
                          <Star size={18} fill="var(--warning)" stroke="var(--warning)" />
                        </span>
                      ) : null}
                      {isLinkedToItems && (
                        <Link2
                          size={16}
                          className={styles['view__linked-icon']}
                          aria-label="Linked to other items"
                        />
                      )}
                      {isRelatedToItems && (
                        <Layers2
                          size={16}
                          className={styles['view__linked-icon']}
                          aria-label="Related to other items"
                        />
                      )}
                      <h3 className={styles['view__title']}>{displayItem.Name}</h3>
                    </div>
                    {!hasSubstitutionBrowse ? (
                      <div className={styles['view__price-row']}>
                        <QuantityBadge item={displayItem} metadata={metadata} isOwner={isOwner} />
                        {primaryPrice != null && (
                          <span className={styles['view__price']}>${primaryPrice}</span>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {hasSubstitutionBrowse && hasMetaEnd ? (
                    <div className={styles['view__meta-end']}>
                      {showSharingAvatars && (
                        <SharingAvatars users={sharingUsers} isOwner={isOwner} />
                      )}
                      {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
                      {item.IsSuggestion && (
                        <SuggestionBadge
                          userId={item.SuggestedByUserId}
                          displayName={suggestedByDisplayName}
                        />
                      )}
                      {hasPriority && (
                        <PriorityDisplay
                          priority={item.Priority as number}
                          variant="meta"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className={styles['view__badges']}>
                    <Badges
                      item={item}
                      audienceLabel={badgesAudienceLabel}
                      isPrivate={isPrivate}
                      showPriority={false}
                    />
                  </div>
                </div>

                {hasSubstitutionBrowse ? (
                  <div className={styles['view__header-aside']}>
                    <div className={styles['view__aside-badges']}>
                      {active.kind !== 'original' ? (
                        <SubstitutionBadge
                          kind={active.kind}
                          createdByUserId={active.option?.CreatedByUserId}
                        />
                      ) : null}
                      <SubstitutionCounterBadge
                        activeIndex={substitutionIndex}
                        total={substitutionTotal}
                        isOriginal={active.kind === 'original'}
                      />
                    </div>
                    <div className={styles['view__price-row']}>
                      <QuantityBadge item={displayItem} metadata={metadata} isOwner={isOwner} />
                      {primaryPrice != null && (
                        <span className={styles['view__price']}>${primaryPrice}</span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>

              {displayDescription ? (
                <p className={styles['view__desc']}>{displayDescription}</p>
              ) : null}

              <MetadataGrid
                predefinedDisplayEntries={predefinedDisplayEntries}
                userDefinedEntries={userDefinedEntries}
                metadataBadgeEmoji={metadataBadgeEmoji}
                variant="compact"
              />

              {showFundingWidget && (
                <FundingWidget
                  totalExtractedPrice={totalExtractedPrice}
                  totalClaimedAmount={totalClaimedAmount}
                />
              )}
            </div>
          </div>
        )}
      </SubstitutionSwitcher>

      <FooterActions
        showActionButtons = {
          showActionButtons
        }
        footerClassName = {
          footerClassName
        }
        showClaimForm = {
          showClaimForm
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
        isArchived = {
          props.isArchived
        }
        isExpired = {
          props.isExpired
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
        claimLoading = {
          claimLoading
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
        setShowClaimForm = {
          setShowClaimForm
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
          substitutionAction
        }
      />

      <ClaimDrawer
        drawerClassName = {
          drawerClassName
        }
        showClaimDrawerContent = {
          showClaimDrawerContent
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
    </div>
  );
};
