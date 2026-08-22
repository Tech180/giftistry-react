import React from 'react';
import { Link2, Layers2 } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  SuggestionBadge,
  ClaimPrompt,
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
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { hasPriorityValue } from '../../../utils/item-priority.util';
import styles from './kanban-item-view.module.css';

export const KanbanItemView: React.FC<ItemViewProps> = (props) => {
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
    audienceLabel,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    metadata,
    isSelected,
    onSelect,
    onView,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryPrice = item.Links[0]?.ExtractedPrice;
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
    <div
      className={`${styles['v-kanban-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}
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

      <div className={styles['v-kanban-header']}>
        {isTaggingModeActive && (
          <TaggingSelect
            isTaggingModeActive={isTaggingModeActive}
            isTaggedSelection={isTaggedSelection}
            onSelectTag={onSelectTag}
          />
        )}
        <h4 className={styles['v-kanban-title']}>
          {isLinkedToItems && (
            <Link2 size={12} className={styles['linked-icon']} aria-hidden="true" />
          )}
          {isRelatedToItems && (
            <Layers2 size={12} className={styles['linked-icon']} aria-label="Related to other items" />
          )}
          {item.Name}
        </h4>
        {hasPriorityValue(item.Priority) && (
          <PriorityDisplay priority={item.Priority} variant="meta" />
        )}
      </div>

      <div className={styles['v-kanban-badges']}>
        <Badges
          item={item}
          audienceLabel={audienceLabel}
          isPrivate={isPrivate}
          showPriority={false}
        />
      </div>

      {allowGroupFunds && totalExtractedPrice > 0 && (
        <FundingWidget
          totalExtractedPrice={totalExtractedPrice}
          totalClaimedAmount={totalClaimedAmount}
        />
      )}

      <div className={styles['v-kanban-meta']}>
        <span>{item.Links.length} link{item.Links.length !== 1 ? 's' : ''}</span>
        {(primaryPrice != null || showClaimBadge || showQuantity) && (
          <div className={styles['v-kanban-price-row']}>
            <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
            {primaryPrice != null && (
              <span className={styles['v-kanban-price']}>${primaryPrice}</span>
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
      </div>

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
        <div className={styles['v-kanban-actions']}>
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
            compact
          />
        </div>
      )}
    </div>
  );
};
