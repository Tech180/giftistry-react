import React from 'react';
import { Link2 } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  ClaimPrompt,
  FundingWidget,
  ActionButtons,
  TaggingOverlay,
  TaggingSelect,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getPrimaryClaimForBadge, getClaimedGrayOutClass, getUserClaimedHighlightClass, shouldShowClaimBadge } from '../shared/item-card-modifiers.util';
import styles from './kanban-item-view.module.css';

export const KanbanItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    canCollaborate,
    allowGroupFunds,
    isFullyClaimed,
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
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    audienceLabel,
    isPrivate,
    linkedItems,
    isLinkingContext,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const primaryClaim = getPrimaryClaimForBadge(item.Claims);
  const primaryPrice = item.Links[0]?.ExtractedPrice;

  const modifierClass = buildItemCardModifierClasses(
    {
      isPrivate,
      isFullyClaimed,
      claimedByCurrentUser,
      isOwner,
      isTaggedSelection,
    },
    styles
  );
  const showClaimBadge = shouldShowClaimBadge(primaryClaim, claimedByCurrentUser);
  const claimedGrayClass = getClaimedGrayOutClass(
    isFullyClaimed,
    primaryClaim != null,
    claimedByCurrentUser,
    styles
  );
  const userClaimedHighlightClass = getUserClaimedHighlightClass(
    claimedByCurrentUser,
    styles
  );

  return (
    <div className={`${styles['v-kanban-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}>
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
          {item.Name}
        </h4>
      </div>

      <div className={styles['v-kanban-badges']}>
        <Badges
          item={item}
          audienceLabel={audienceLabel}
          isPrivate={isPrivate}
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
        {(primaryPrice != null || showClaimBadge) && (
          <div className={styles['v-kanban-price-row']}>
            {primaryPrice != null && (
              <span className={styles['v-kanban-price']}>${primaryPrice}</span>
            )}
            {showClaimBadge && (
              <ClaimBadge
                userId={primaryClaim.userId}
                displayName={primaryClaim.displayName}
                anonymous={primaryClaim.anonymous}
              />
            )}
          </div>
        )}
      </div>

      {showClaimForm ? (
        <EnterPanel animation="dropdown" className={styles['claim-form-panel']}>
          <ClaimPrompt anonymous={anonymous} onAnonymousChange={setAnonymous} />
          <div className={styles['claim-form-actions']}>
            <Button variant="primary" size="sm" onClick={() => handleClaim()} isLoading={claimLoading}>
              Yes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowClaimForm(false)}>
              Cancel
            </Button>
          </div>
        </EnterPanel>
      ) : (
        <div className={styles['v-kanban-actions']}>
          <ActionButtons
            isOwner={isOwner}
            canCollaborate={canCollaborate}
            claimedByCurrentUser={claimedByCurrentUser}
            isFullyClaimed={isFullyClaimed}
            claimLoading={claimLoading}
            showDeleteConfirm={showDeleteConfirm}
            deleteLoading={deleteLoading}
            onEdit={onEdit}
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
