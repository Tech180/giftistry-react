import React from 'react';
import { Link2, Link as LinkIcon, Layers2 } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
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
  QuantityBadge,
  PriorityDisplay,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getClaimedGrayOutClass, getUserClaimedHighlightClass } from '../shared/item-card-modifiers.util';
import { resolveItemQuantitySummary } from '../../../utils/resolve-item-quantity.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import styles from './feed-item-view.module.css';

export const FeedItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    canCollaborate,
    allowGroupFunds,
    isFullyClaimed,
    isMultiCount,
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
  const primaryLink = item.Links[0];
  const primaryPrice = primaryLink?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(item);
  const showQuantity = resolveItemQuantitySummary(item, metadata).shouldDisplay;
  const { entries: claimBadgeEntries, showClaimBadge, hasVisibleClaim } =
    resolveItemClaimBadgeState(item.Claims, claimUserId, claimedByCurrentUser, claimActorName);

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
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    hasVisibleClaim,
    claimedByCurrentUser,
    styles,
    props.isArchived,
    isMultiCount
  );
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );

  return (
    <article className={styles['v-feed-item']}>
      <div
        className={`${styles['v-feed-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}
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

        {primaryImageUrl && (
          <div className={styles['v-feed-photo']}>
            <img src={primaryImageUrl} alt="" className={styles['v-feed-photo-img']} />
          </div>
        )}

        <header className={styles['v-feed-header']}>
          <div className={styles['v-feed-title-wrap']}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {isTaggingModeActive && (
                <TaggingSelect
                  isTaggingModeActive={isTaggingModeActive}
                  isTaggedSelection={isTaggedSelection}
                  onSelectTag={onSelectTag}
                />
              )}
              <h3 className={styles['v-feed-title']}>
                {isLinkedToItems && (
                  <Link2 size={16} className={styles['linked-icon']} aria-hidden="true" />
                )}
                {isRelatedToItems && (
                  <Layers2 size={16} className={styles['linked-icon']} aria-label="Related to other items" />
                )}
                {item.Name}
              </h3>
            </div>
            <div className={styles['v-feed-badges']}>
              <Badges
                item={item}
                audienceLabel={audienceLabel}
                isPrivate={isPrivate}
                showPriority={false}
              />
            </div>
          </div>
          <div className={styles['v-feed-header-meta']}>
            {primaryLink && (
              <a
                href={primaryLink.Url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles['v-feed-header-link']}
              >
                <LinkIcon size={14} aria-hidden="true" />
                {getSiteName(primaryLink.Url, primaryLink.RetailerName)}
              </a>
            )}
            {(primaryPrice != null || showClaimBadge || showQuantity) && (
              <div className={styles['v-feed-price-row']}>
                <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
                {primaryPrice != null && (
                  <span className={styles['v-feed-price']}>${primaryPrice}</span>
                )}
                {showClaimBadge && <ClaimBadge entries={claimBadgeEntries} />}
                {item.IsSuggestion && (
                  <SuggestionBadge
                    userId={item.SuggestedByUserId}
                    displayName={item.SuggestedByUsername || 'Collaborator'}
                  />
                )}
              </div>
            )}
            {hasPriorityValue(item.Priority) && (
              <PriorityDisplay priority={item.Priority} variant="meta" />
            )}
          </div>
        </header>

        {displayDescription && (
          <p className={styles['v-feed-desc']}>{displayDescription}</p>
        )}

        <MetadataGrid
          predefinedDisplayEntries={predefinedDisplayEntries}
          userDefinedEntries={userDefinedEntries}
          metadataBadgeEmoji={metadataBadgeEmoji}
        />

        {allowGroupFunds && totalExtractedPrice > 0 && (
          <FundingWidget
            totalExtractedPrice={totalExtractedPrice}
            totalClaimedAmount={totalClaimedAmount}
          />
        )}

        <footer className={styles['v-feed-actions']}>
          {showClaimForm && !props.isArchived && !props.isExpired ? (
            <EnterPanel animation="dropdown" className={styles['claim-form-panel']}>
              {itemActions ? (
                <ClaimForm
                  item={item}
                  metadata={item.Metadata}
                  userId={claimUserId}
                  claimedByName={claimActorName ?? null}
                  itemActions={itemActions}
                  anonymous={anonymous}
                  onAnonymousChange={setAnonymous}
                  onSubmitted={() => setShowClaimForm(false)}
                  onCancel={() => setShowClaimForm(false)}
                  compact
                />
              ) : (
                <>
                  <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
                  <div className={styles['claim-form-actions']}>
                    <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
                      Yes
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </EnterPanel>
          ) : (
            <ActionButtons
              isOwner={isOwner}
              canCollaborate={canCollaborate}
              isPublicGuest={props.isPublicGuest}
              canEditItem={props.canEditItem}
              isArchived={props.isArchived}
              isExpired={props.isExpired}
              claimedByCurrentUser={claimedByCurrentUser}
              isFullyClaimed={isFullyClaimed}
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
            />
          )}
        </footer>
      </div>
    </article>
  );
};
