import React from 'react';
import { Star, Link2, Link as LinkIcon, Pencil, Trash2, Layers2, Eye } from 'lucide-react';
import { useAuth } from 'app/providers/auth-context';
import { EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  ClaimPrompt,
  ClaimForm,
  FundingWidget,
  MetadataGrid,
  SharingAvatars,
  TaggingOverlay,
  TaggingSelect,
  QuantityBadge,
  PriorityDisplay,
  SubstitutionSwitcher,
  SubstitutionCounterBadge,
  SubstitutionBadge,
  SubstitutionClaimButton,
} from '../../item-presentation';
import { CLAIM_FORM_PROMPT_CLAIM_LINKED } from '../../item-presentation/claim-form/constants/claim-form-copy.constant';
import { Tags } from 'features/comments';
import { buildItemCardModifierClasses, getClaimedGrayOutClass, getGroupFundingInProgressClass, getUserClaimedHighlightClass } from '../shared/item-card-modifiers.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import { isItemGroupFundingActive, isItemGroupFundingInProgress } from '../../../utils/is-item-group-funding-active.util';
import type { SubstitutionBrowseOption } from '../../../utils/resolve-item-substitution-options.util';
import { useCompactColumnSyncContext } from './compact-category-list';
import styles from './compact-item-view.module.css';

function buildCompactColClass(
  styles: Record<string, string>,
  baseClass: string,
  options: { filled?: boolean; dividerAfter?: boolean; dividerBefore?: boolean } = {}
): { className: string; measure: boolean } {
  const { filled = false, dividerAfter = false, dividerBefore = false } = options;
  return {
    className: [
      styles['v-compact-col'],
      styles[baseClass],
      dividerAfter ? styles['v-compact-col-divider-after'] : '',
      dividerBefore ? styles['v-compact-col-divider-before'] : '',
    ]
      .filter(Boolean)
      .join(' '),
    measure: filled,
  };
}

export const CompactItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    displayItem = item,
    substitutionOptions,
    substitutionActiveIndex,
    onSubstitutionIndexChange,
    substitutionAction = null,
    isOwner,
    canCollaborate,
    isPublicGuest = false,
    canEditItem,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
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
    isExpanded,
    setIsExpanded,
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadataBadgeEmoji,
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
  } = props;

  const { user } = useAuth();
  const { columnPresence, isSyncEnabled } = useCompactColumnSyncContext();
  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryLink = displayItem.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
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
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );
  const showCompactActions =
    !isPublicGuest &&
    (canCollaborate || !isOwner || canEditItem) &&
    !props.isArchived &&
    !props.isExpired;
  const hasPriority = hasPriorityValue(item.Priority);
  const reserveSelect = isSyncEnabled ? columnPresence.select : isTaggingModeActive;
  const showRelationsIcons = isLinkedToItems || isRelatedToItems;
  const reserveRelations =
    (isSyncEnabled && columnPresence.relations) || showRelationsIcons;
  const reserveAudienceGroup = isSyncEnabled
    ? columnPresence.audience
    : showSharingAvatars || !!item.IsSuggestion || showClaimBadge;
  const reserveFunding =
    isSyncEnabled
      ? columnPresence.funding
      : isItemGroupFundingActive({
          allowGroupFunds,
          fundingTarget: totalExtractedPrice,
          totalClaimedAmount,
        });
  const reserveTrailing =
    isSyncEnabled
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
  const showGuestClaimActions =
    showCompactActions && !isOwner && !showClaimForm;
  const showWideClaimActionPair =
    showGuestClaimActions && claimedByCurrentUser && canAdjustClaim;
  const syncClaimActionWidth =
    isSyncEnabled && columnPresence.claimActions;
  const useSyncedClaimActionWidth = syncClaimActionWidth && showGuestClaimActions;
  const useSyncedConfirmButtons =
    syncClaimActionWidth &&
    ((showClaimForm && !isOwner) || showDeleteConfirm);
  const spanClaimActionWidth =
    useSyncedClaimActionWidth ||
    (isSyncEnabled &&
      columnPresence.wideClaimActions &&
      showGuestClaimActions &&
      !showWideClaimActionPair);
  const hasExpandableContent =
    !!primaryImageUrl ||
    !!displayDescription?.trim() ||
    predefinedDisplayEntries.length > 0 ||
    userDefinedEntries.length > 0 ||
    hasFundingContent;

  const handleCompactRowActivate = () => {
    onSelect?.();
    if (hasExpandableContent) {
      setIsExpanded?.(!isExpanded);
    }
  };

  const leadingCol = buildCompactColClass(styles, 'v-compact-col-leading', {
    filled: true,
    dividerAfter: true,
  });
  const selectCol = buildCompactColClass(styles, 'v-compact-col-select', {
    filled: isTaggingModeActive,
    dividerAfter: isTaggingModeActive,
  });
  const titleCol = buildCompactColClass(styles, 'v-compact-col-title', {
    filled: true,
    dividerAfter: hasPrimaryMetaAfterTitle,
  });
  const relationsCol = buildCompactColClass(styles, 'v-compact-col-relations', {
    filled: reserveRelations,
    dividerAfter: reserveRelations,
  });
  const audienceGroupCol = buildCompactColClass(
    styles,
    'v-compact-col-audience-group',
    {
      filled: reserveAudienceGroup,
      dividerAfter: reserveAudienceGroup,
    }
  );
  const quantityCol = buildCompactColClass(styles, 'v-compact-col-quantity', {
    filled: showQuantityBadge,
    dividerAfter: showQuantityBadge,
  });
  const priceCol = buildCompactColClass(styles, 'v-compact-col-price', {
    filled: true,
    dividerBefore: true,
  });
  const fundingCol = buildCompactColClass(styles, 'v-compact-col-funding', {
    filled: hasFundingContent,
    dividerAfter: hasFundingContent && hasTrailingContent,
  });
  const trailingCol = buildCompactColClass(styles, 'v-compact-col-trailing', {
    filled: hasTrailingContent,
    dividerBefore: hasTrailingContent,
  });

  const renderCardBody = (active: SubstitutionBrowseOption) => (
      <div className={styles['v-compact-card-inner']}>
        <div className={styles['v-compact-card-body']}>
      <div
        className={`${styles['v-compact-row']} ${hasExpandableContent ? styles['v-compact-row-expandable'] : ''}`}
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('button') || target.closest('a') || target.closest('input')) return;
          handleCompactRowActivate();
        }}
        role={hasExpandableContent ? 'button' : undefined}
        tabIndex={hasExpandableContent ? 0 : undefined}
        onKeyDown={
          hasExpandableContent
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCompactRowActivate();
                }
              }
            : undefined
        }
      >
        <div className={styles['v-compact-primary']}>
          <div
            className={leadingCol.className}
            data-compact-col="leading"
            {...(leadingCol.measure ? { 'data-compact-col-measure': 'leading' } : {})}
          >
            <div className={styles['v-compact-star']}>
              {isOwner ? (
                <button
                  type="button"
                  onClick={toggleFavorite}
                  className={styles['v-compact-star-btn']}
                  title="Toggle favorite"
                >
                  <Star
                    size={16}
                    fill={isFavorite ? 'var(--warning)' : 'none'}
                    stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                  />
                </button>
              ) : isFavorite ? (
                <Star size={16} fill="var(--warning)" stroke="var(--warning)" />
              ) : (
                <Star size={16} fill="none" stroke="currentColor" style={{ opacity: 0.3 }} />
              )}
              {hasPriority ? (
                <PriorityDisplay
                  priority={item.Priority as number}
                  variant="compact"
                  className={styles['v-compact-priority-inline']}
                />
              ) : null}
            </div>
          </div>

          {reserveSelect && (
            <div
              className={selectCol.className}
              data-compact-col="select"
              {...(selectCol.measure ? { 'data-compact-col-measure': 'select' } : {})}
            >
              {isTaggingModeActive ? (
                <TaggingSelect
                  isTaggingModeActive={isTaggingModeActive}
                  isTaggedSelection={isTaggedSelection}
                  onSelectTag={onSelectTag}
                />
              ) : null}
            </div>
          )}

          <div className={titleCol.className}>
            <div className={styles['v-compact-main']}>
              <span className={styles['v-compact-title']} title={displayItem.Name}>
                {displayItem.Name}
              </span>
              {hasSubstitutionBrowse ? (
                <div className={styles['v-compact-sub-badges']}>
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
              ) : null}
              <div className={styles['v-compact-meta-sub']}>
                <Badges
                  item={item}
                  audienceLabel={showSharingAvatars ? null : audienceLabel}
                  isPrivate={isPrivate}
                  showPriority={false}
                />
              </div>
            </div>
          </div>

          {reserveRelations && (
            <div
              className={relationsCol.className}
              data-compact-col="relations"
              {...(relationsCol.measure
                ? { 'data-compact-col-measure': 'relations' }
                : {})}
            >
              {isLinkedToItems && (
                <Link2
                  size={14}
                  className={styles['linked-icon']}
                  aria-label="Linked to other items"
                />
              )}
              {isRelatedToItems && (
                <Layers2
                  size={14}
                  className={styles['linked-icon']}
                  aria-label="Related to other items"
                />
              )}
            </div>
          )}

          {reserveAudienceGroup && (
            <div
              className={audienceGroupCol.className}
              data-compact-col="audience"
              {...(audienceGroupCol.measure
                ? { 'data-compact-col-measure': 'audience' }
                : {})}
            >
              {showSharingAvatars ? (
                <SharingAvatars users={sharingUsers} isOwner={isOwner} />
              ) : null}
              {showClaimBadge ? <ClaimBadge entries={claimBadgeEntries} /> : null}
              {item.IsSuggestion ? (
                <SuggestionBadge
                  userId={item.SuggestedByUserId}
                  displayName={resolveSuggestedByDisplayName(item)}
                />
              ) : null}
            </div>
          )}

          {reserveQuantity && (
            <div
              className={quantityCol.className}
              data-compact-col="quantity"
              {...(quantityCol.measure ? { 'data-compact-col-measure': 'quantity' } : {})}
            >
              {showQuantityBadge ? (
                <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
              ) : null}
            </div>
          )}

          <div
            className={priceCol.className}
            data-compact-col="price"
            {...(priceCol.measure ? { 'data-compact-col-measure': 'price' } : {})}
          >
            {!reserveQuantity && (
              <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
            )}
            <span className={styles['v-compact-price-value']}>
              {primaryPrice != null ? `$${primaryPrice}` : '\u2014'}
            </span>
          </div>
        </div>

        {showSecondaryRow && (
        <div className={styles['v-compact-secondary']}>
          {reserveFunding && (
            <div
              className={fundingCol.className}
              data-compact-col="funding"
              {...(fundingCol.measure ? { 'data-compact-col-measure': 'funding' } : {})}
            >
              {hasFundingContent ? (
                <FundingWidget
                  totalExtractedPrice={totalExtractedPrice}
                  totalClaimedAmount={totalClaimedAmount}
                  label=""
                />
              ) : null}
            </div>
          )}

          {reserveTrailing && (
            <div
              className={trailingCol.className}
              data-compact-col="trailing"
              {...(trailingCol.measure ? { 'data-compact-col-measure': 'trailing' } : {})}
            >
              <div className={styles['v-compact-trailing']}>
                {primaryLink && (
                  <div className={styles['v-compact-link']}>
                    <a
                      href={primaryLink.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title={getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                      aria-label={`Open ${getSiteName(primaryLink.Url, primaryLink.RetailerName)}`}
                      className={styles['v-compact-action-btn']}
                    >
                      <LinkIcon size={14} aria-hidden />
                    </a>
                  </div>
                )}

                {(onView || showCompactActions) && (
                  <div
                    className={[
                      styles['v-compact-actions'],
                      spanClaimActionWidth ? styles['v-compact-actions-has-wide-claim'] : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                  {onView && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onView();
                      }}
                      className={styles['v-compact-action-btn']}
                      title="View Item"
                      aria-label="View item"
                    >
                      <Eye size={14} />
                    </button>
                  )}
                  {showCompactActions && (canEditItem ?? canCollaborate) && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.();
                        }}
                        className={styles['v-compact-action-btn']}
                        title="Edit Item"
                        aria-label="Edit item"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirm(true);
                        }}
                        className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-danger']}`}
                        title="Delete Item"
                        aria-label="Delete item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                  {showGuestClaimActions && (
                    <div
                      className={[
                        styles['v-compact-claim-actions'],
                        spanClaimActionWidth || showWideClaimActionPair
                          ? styles['v-compact-claim-actions-wide']
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      {...(useSyncedClaimActionWidth
                        ? { 'data-compact-col-measure': 'claimActions' }
                        : {})}
                    >
                    {substitutionAction ? (
                      <SubstitutionClaimButton
                        mode={substitutionAction.mode}
                        allowSubstitutions={substitutionAction.allowSubstitutions}
                        onOpenEditor={substitutionAction.onRequest}
                        onDelete={substitutionAction.onDelete}
                        appearance="ghost-text"
                        size="sm"
                        disabled={claimLoading || showClaimForm}
                        className={styles['v-compact-action-btn']}
                      />
                    ) : null}
                    {claimedByCurrentUser && !canAdjustClaim ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnclaim();
                        }}
                        disabled={claimLoading}
                        className={styles['v-compact-action-btn']}
                      >
                        {hasLinkedUnclaimPeers ? 'Unclaim all' : 'Unclaim'}
                      </button>
                    ) : claimedByCurrentUser && canAdjustClaim ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnclaim();
                          }}
                          disabled={claimLoading}
                          className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-danger']}`}
                        >
                          Unclaim All
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowClaimForm(true);
                          }}
                          className={styles['v-compact-action-btn']}
                        >
                          Update
                        </button>
                      </>
                    ) : isClaimUnavailable ? (
                      <button
                        type="button"
                        className={styles['v-compact-action-btn']}
                        disabled
                      >
                        Unavailable
                      </button>
                    ) : isFullyClaimed ? (
                      <button
                        type="button"
                        className={styles['v-compact-action-btn']}
                        disabled
                      >
                        Claimed
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowClaimForm(true);
                        }}
                        className={styles['v-compact-action-btn']}
                      >
                        Claim
                      </button>
                    )}
                    </div>
                  )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        )}
      </div>

      {showClaimForm &&
        !!itemActions &&
        !props.isArchived &&
        !props.isExpired && (
        <EnterPanel
          animation="dropdown"
          className={
            canAdjustClaim ? styles['confirm-extension-stack'] : styles['confirm-extension']
          }
        >
          <ClaimForm
            item={displayItem}
            metadata={displayItem.Metadata}
            userId={claimUserId}
            claimedByName={claimActorName ?? null}
            itemActions={itemActions}
            anonymous={anonymous}
            onAnonymousChange={setAnonymous}
            onSubmitted={() => setShowClaimForm(false)}
            onCancel={() => setShowClaimForm(false)}
            linkedItems={linkedClaimPeers}
            wishlistItems={wishlistItemsForLinkedClaim}
            onLinkedItemClick={onLinkedClaimItemClick}
            compact
            allowGroupFunds={allowGroupFunds}
            fundingTarget={totalExtractedPrice}
            totalClaimedAmount={totalClaimedAmount}
          />
        </EnterPanel>
      )}

      {showClaimForm &&
        !itemActions &&
        !canAdjustClaim &&
        !props.isArchived &&
        !props.isExpired && (
        <EnterPanel animation="dropdown" className={styles['confirm-extension']}>
          <div className={styles['confirm-prompt']}>
            <ClaimPrompt
              anonymous={anonymous}
              onAnonymousChange={setAnonymous}
              prompt={
                linkedClaimPeers.length > 0
                  ? CLAIM_FORM_PROMPT_CLAIM_LINKED
                  : undefined
              }
            />
            {linkedClaimPeers.length > 0 && (
              <div className={styles['confirm-linked-tags']}>
                <Tags
                  appearance="badges"
                  taggedIds={linkedClaimPeers.map((peer) => peer.Id)}
                  items={wishlistItemsForLinkedClaim}
                  onItemTaggedClick={onLinkedClaimItemClick}
                />
              </div>
            )}
          </div>
          <div
            className={[
              styles['confirm-buttons'],
              useSyncedConfirmButtons ? styles['confirm-buttons-synced'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...(useSyncedConfirmButtons
              ? { 'data-compact-col-measure': 'claimActions' }
              : {})}
          >
            <button
              type="button"
              onClick={() => handleClaim()}
              disabled={claimLoading}
              className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-primary']}`}
            >
              {linkedClaimPeers.length > 0 ? 'Claim all' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => setShowClaimForm(false)}
              className={styles['v-compact-action-btn']}
            >
              Cancel
            </button>
          </div>
        </EnterPanel>
      )}

      {showDeleteConfirm && !props.isArchived && !props.isExpired && (
        <EnterPanel animation="dropdown" className={styles['confirm-extension']}>
          <div className={styles['confirm-prompt']}>
            <span>Delete this item?</span>
          </div>
          <div
            className={[
              styles['confirm-buttons'],
              useSyncedConfirmButtons ? styles['confirm-buttons-synced'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            {...(useSyncedConfirmButtons
              ? { 'data-compact-col-measure': 'claimActions' }
              : {})}
          >
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`${styles['v-compact-action-btn']} ${styles['v-compact-action-btn-primary']}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className={styles['v-compact-action-btn']}
            >
              No
            </button>
          </div>
        </EnterPanel>
      )}

      {hasExpandableContent && isExpanded && (
        <div className={styles['v-compact-expanded']}>
          <div
            className={styles['v-compact-expanded-content']}
          >
            {primaryImageUrl && (
              <div className={styles['expanded-photo-col']}>
                <img
                  src={primaryImageUrl}
                  alt=""
                  className={styles['expanded-photo']}
                />
              </div>
            )}
            <div className={styles['expanded-detail-col']}>
              {displayDescription && (
                <p className={styles['expanded-desc']}>{displayDescription}</p>
              )}
            </div>
            {(predefinedDisplayEntries.length > 0 || userDefinedEntries.length > 0) && (
              <div className={styles['v-compact-expanded-metadata']}>
                <MetadataGrid
                  predefinedDisplayEntries={predefinedDisplayEntries}
                  userDefinedEntries={userDefinedEntries}
                  metadataBadgeEmoji={metadataBadgeEmoji}
                  variant="compact"
                  compactAlign="end"
                />
              </div>
            )}
          </div>
          {hasFundingContent && (
            <div className={styles['v-compact-expanded-aside']}>
              <FundingWidget
                totalExtractedPrice={totalExtractedPrice}
                totalClaimedAmount={totalClaimedAmount}
              />
            </div>
          )}
        </div>
      )}
        </div>
      </div>
  );

  return (
    <div
      className={`${styles['v-compact-card']} ${modifierClass} ${claimedGrayClass} ${groupFundingClass} ${userClaimedHighlightClass} ${isExpanded ? styles.expanded : ''} ${isSelected ? styles['is-selected'] : ''} ${hasSubstitutionBrowse ? styles['v-compact-card-with-subs'] : ''}`}
      aria-expanded={hasExpandableContent ? isExpanded : undefined}
    >
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <SubstitutionSwitcher
        parent={item}
        options={substitutionOptions}
        userId={claimUserId}
        activeIndex={substitutionActiveIndex}
        onActiveIndexChange={onSubstitutionIndexChange}
        className={styles['v-compact-switcher']}
      >
        {(active) => renderCardBody(active)}
      </SubstitutionSwitcher>
    </div>
  );
};
