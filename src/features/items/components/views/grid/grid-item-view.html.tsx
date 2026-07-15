import React from 'react';
import { Star, Link2 } from 'lucide-react';
import { Button, EnterPanel } from 'shared/ui';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  Badges,
  ClaimBadge,
  TaggingOverlay,
  TaggingSelect,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getPrimaryClaimForBadge, getClaimedGrayOutClass, getUserClaimedHighlightClass, shouldShowClaimBadge } from '../shared/item-card-modifiers.util';
import styles from './grid-item-view.module.css';

export const GridItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    isOwner,
    isFullyClaimed,
    showClaimForm,
    setShowClaimForm,
    claimLoading,
    handleClaim,
    isFavorite,
    toggleFavorite,
    claimedByCurrentUser,
    handleUnclaim,
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    isSelected,
    onSelect,
    CategoryIcon,
    displayCategoryBadge,
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
      isSelected,
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
    <div
      className={`${styles['v-grid-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect?.();
        }
      }}
      aria-pressed={isSelected}
    >
      <TaggingOverlay
        isTaggingModeActive={isTaggingModeActive}
        isTaggedSelection={isTaggedSelection}
        onSelectTag={onSelectTag}
      />

      <div className={styles['v-grid-visual']}>
        {displayCategoryBadge && (
          <span className={styles['v-grid-category-icon']}>
            <CategoryIcon size={14} />
          </span>
        )}
        <CategoryIcon size={48} style={{ opacity: 0.2, color: 'var(--text-muted)' }} />
        <div className={styles['v-grid-top-actions']}>
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
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite();
              }}
              className={styles['v-grid-star-btn']}
              title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
            >
              <Star
                size={12}
                fill={isFavorite ? 'var(--warning)' : 'none'}
                stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
              />
            </button>
          ) : isFavorite ? (
            <span className={styles['v-grid-star-btn']}>
              <Star size={12} fill="var(--warning)" stroke="var(--warning)" />
            </span>
          ) : null}
        </div>

        <div className={styles['v-grid-overlay']}>
          <div className={styles['overlay-badges']}>
            <Badges
              item={item}
              audienceLabel={audienceLabel}
              isPrivate={isPrivate}
            />
          </div>
          <button
            type="button"
            className={styles['overlay-btn']}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            Preview Details
          </button>
        </div>
      </div>

      <div className={styles['v-grid-content']}>
        <h4 className={styles['v-grid-title']}>
          {isLinkedToItems && (
            <Link2 size={11} className={styles['linked-icon']} aria-hidden="true" />
          )}
          {item.Name}
        </h4>
        <div className={styles['v-grid-price-row']}>
          <span className={styles['v-grid-price']}>
            {primaryPrice != null ? `$${primaryPrice}` : '—'}
          </span>
          {showClaimBadge && (
            <ClaimBadge
              userId={primaryClaim.userId}
              displayName={primaryClaim.displayName}
              anonymous={primaryClaim.anonymous}
            />
          )}
        </div>
      </div>

      {showClaimForm && (
        <EnterPanel
          animation="fade"
          className={styles['claim-overlay']}
          onClick={(e) => e.stopPropagation()}
        >
          <span>Claim?</span>
          <div className={styles['claim-overlay-actions']}>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClaim();
              }}
              isLoading={claimLoading}
            >
              Yes
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowClaimForm(false);
              }}
            >
              No
            </Button>
          </div>
        </EnterPanel>
      )}

      {!isOwner && !showClaimForm && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {claimedByCurrentUser ? (
            <button
              type="button"
              onClick={handleUnclaim}
              disabled={claimLoading}
              className={styles['overlay-btn']}
            >
              Unclaim
            </button>
          ) : isFullyClaimed ? (
            <span className={styles['overlay-btn']} style={{ opacity: 0.7 }}>
              Claimed
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowClaimForm(true)}
              className={styles['overlay-btn']}
            >
              Claim
            </button>
          )}
        </div>
      )}
    </div>
  );
};
