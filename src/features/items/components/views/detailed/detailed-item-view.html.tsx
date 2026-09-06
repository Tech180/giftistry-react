import React from 'react';
import { Star, Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import { Button } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  ClaimPrompt,
  MetadataGrid,
  FundingWidget,
  ActionButtons,
  ClaimForm,
  TaggingOverlay,
  TaggingSelect,
  SharingAvatars,
  QuantityBadge,
  shouldShowActionButtons,
  PriorityDisplay,
  SubstitutionSwitcher,
  SubstitutionCounterBadge,
  SubstitutionBadge,
} from '../../item-presentation';
import { CLAIM_FORM_PROMPT_CLAIM_LINKED } from '../../item-presentation/claim-form/constants/claim-form-copy.constant';
import { Tags } from 'features/comments';
import {
  buildItemCardModifierClasses,
  getClaimedGrayOutClass,
  getGroupFundingInProgressClass,
  getUserClaimedHighlightClass,
} from '../shared/item-card-modifiers.util';
import { isItemGroupFundingActive, isItemGroupFundingInProgress } from '../../../utils/is-item-group-funding-active.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import { shouldShowSharingAvatars } from '../../../utils/item-audience.util';
import { useAuth } from 'app/providers/auth-context';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import styles from './detailed-item-view.module.css';

export const DetailedItemView: React.FC<ItemViewProps> = (props) => {
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
    displayDescription,
    predefinedDisplayEntries,
    userDefinedEntries,
    metadata,
    metadataBadgeEmoji,
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

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryLink = displayItem.Links[0];
  const { user } = useAuth();
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const showSharingAvatars = shouldShowSharingAvatars(item, isOwner, user?.Id);
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

  const priceAside = (
    <div className={styles['v-detailed-price-row']}>
      <QuantityBadge item={displayItem} metadata={metadata} isOwner={isOwner} />
      {primaryPrice != null && (
        <span className={styles['v-detailed-price']}>${primaryPrice}</span>
      )}
    </div>
  );

  const metaEnd = (
    <>
      {showSharingAvatars && <SharingAvatars users={sharingUsers} isOwner={isOwner} />}
      {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
      {item.IsSuggestion && (
        <SuggestionBadge
          userId={item.SuggestedByUserId}
          displayName={resolveSuggestedByDisplayName(item)}
        />
      )}
      {hasPriorityValue(item.Priority) && (
        <PriorityDisplay priority={item.Priority} variant="meta" />
      )}
    </>
  );

  const hasMetaEnd =
    showSharingAvatars ||
    showClaimBadge ||
    !!item.IsSuggestion ||
    hasPriorityValue(item.Priority);

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

  const drawerClass = [
    styles['claim-drawer'],
    showClaimForm ? styles['claim-drawer-open'] : '',
    showClaimForm && claimedByCurrentUser ? styles['claim-drawer-open-user-claimed'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const footerClass = [
    styles['card-footer'],
    claimedByCurrentUser ? styles['card-footer-user-claimed'] : '',
    showClaimForm ? styles['claim-footer-hidden'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`${styles['v-detailed-card']} ${modifierClass} ${claimedGrayClass} ${groupFundingClass} ${userClaimedHighlightClass}`}
      onClick={
        onSelect
          ? (e) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.closest('a') || target.closest('input')) return;
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
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <SubstitutionSwitcher
        parent={item}
        options={substitutionOptions}
        userId={claimUserId}
        activeIndex={substitutionActiveIndex}
        onActiveIndexChange={onSubstitutionIndexChange}
      >
        {(active) => (
          <div className={styles['v-detailed-body']}>
            {primaryImageUrl && (
              <div className={styles['v-detailed-photo']}>
                <img src={primaryImageUrl} alt="" className={styles['v-detailed-photo-img']} />
              </div>
            )}
            <div className={styles['v-detailed-content']}>
          <div
            className={[
              styles['v-detailed-header'],
              hasSubstitutionBrowse ? styles['v-detailed-header-with-aside'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles['v-detailed-header-main']}>
              {!hasSubstitutionBrowse ? (
                <div className={styles['v-detailed-meta-row']}>
                  {primaryLink ? (
                    <a
                      href={primaryLink.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles['brand-link']}
                    >
                      {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                      <LinkIcon size={12} aria-hidden="true" />
                    </a>
                  ) : (
                    <span />
                  )}
                  {hasMetaEnd ? (
                    <div className={styles['v-detailed-meta-end']}>{metaEnd}</div>
                  ) : null}
                </div>
              ) : primaryLink ? (
                <a
                  href={primaryLink.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['brand-link']}
                >
                  {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
                  <LinkIcon size={12} aria-hidden="true" />
                </a>
              ) : null}

              <div className={styles['v-detailed-title-row']}>
                <div className={styles['v-detailed-title-cluster']}>
                  {isTaggingModeActive && (
                    <TaggingSelect
                      isTaggingModeActive={isTaggingModeActive}
                      isTaggedSelection={isTaggedSelection}
                      onSelectTag={onSelectTag}
                    />
                  )}
                  {isOwner ? (
                    <button
                      type="button"
                      onClick={toggleFavorite}
                      className={`${styles['star-btn']} ${isFavorite ? styles['star-btn-active'] : ''}`}
                      title="Toggle favorite"
                    >
                      <Star
                        size={18}
                        fill={isFavorite ? 'var(--warning)' : 'none'}
                        stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
                      />
                    </button>
                  ) : isFavorite ? (
                    <span className={styles['star-display']} aria-label="Favorited">
                      <Star size={18} fill="var(--warning)" stroke="var(--warning)" />
                    </span>
                  ) : null}
                  {isLinkedToItems && (
                    <Link2
                      size={16}
                      className={styles['linked-icon']}
                      aria-label="Linked to other items"
                    />
                  )}
                  {isRelatedToItems && (
                    <Layers2
                      size={16}
                      className={styles['linked-icon']}
                      aria-label="Related to other items"
                    />
                  )}
                  <h3 className={styles['v-detailed-title']}>{displayItem.Name}</h3>
                </div>
                {!hasSubstitutionBrowse ? priceAside : null}
              </div>

              {hasSubstitutionBrowse && hasMetaEnd ? (
                <div className={styles['v-detailed-meta-end']}>{metaEnd}</div>
              ) : null}

              <div className={styles['v-detailed-badges']}>
                <Badges
                  item={item}
                  audienceLabel={showSharingAvatars ? null : audienceLabel}
                  isPrivate={isPrivate}
                  showPriority={false}
                />
              </div>
            </div>

            {hasSubstitutionBrowse ? (
              <div className={styles['v-detailed-header-aside']}>
                <div className={styles['v-detailed-aside-badges']}>
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
                {priceAside}
              </div>
            ) : null}
          </div>

          {displayDescription ? (
            <p className={styles['v-detailed-desc']}>{displayDescription}</p>
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

      {showActionButtons && (
        <footer className={footerClass} hidden={showClaimForm || undefined}>
          <div className={styles['footer-actions']}>
            <ActionButtons
            isOwner={isOwner}
            canCollaborate={canCollaborate}
            isPublicGuest={props.isPublicGuest}
            canEditItem={props.canEditItem}
            isArchived={props.isArchived}
            isExpired={props.isExpired}
            claimedByCurrentUser={claimedByCurrentUser}
              isFullyClaimed={isFullyClaimed}
              isClaimUnavailable={isClaimUnavailable}
              canAdjustClaim={canAdjustClaim}
              claimLoading={claimLoading}
              showDeleteConfirm={showDeleteConfirm}
              deleteLoading={deleteLoading}
              onEdit={onEdit}
              onView={onView}
              onClaim={() => setShowClaimForm(true)}
              onUnclaim={handleUnclaim}
              onDeleteRequest={() => setShowDeleteConfirm(true)}
              onDeleteConfirm={handleDelete}
              onDeleteCancel={() => setShowDeleteConfirm(false)}
              splitOnMobile
              unclaimDisabled={showClaimForm}
              hasLinkedUnclaimPeers={hasLinkedUnclaimPeers}
              substitutionAction={substitutionAction}
            />
          </div>
        </footer>
      )}

      <div className={drawerClass}>
        <div className={styles['claim-drawer-inner']}>
          {showClaimForm &&
            !props.isArchived &&
            !props.isExpired &&
            (itemActions ? (
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
                allowGroupFunds={allowGroupFunds}
                fundingTarget={totalExtractedPrice}
                totalClaimedAmount={totalClaimedAmount}
              />
            ) : (
              <div className={styles['claim-fallback']}>
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
                  <Tags
                    appearance="badges"
                    taggedIds={linkedClaimPeers.map((peer) => peer.Id)}
                    items={wishlistItemsForLinkedClaim}
                    onItemTaggedClick={onLinkedClaimItemClick}
                  />
                )}
                <div className={styles['claim-fallback-actions']}>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleClaim()}
                    isLoading={claimLoading}
                  >
                    {linkedClaimPeers.length > 0 ? 'Claim all' : 'Yes'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
