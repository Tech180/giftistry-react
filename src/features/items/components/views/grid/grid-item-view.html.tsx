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
    allowGroupFunds,
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
      className={`${styles['gift-card']} ${modifierClass} ${isSelected ? styles['is-selected'] : ''}`}
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

      <div className={styles['card-badges-tl']}>
        {isFullyClaimed && (
          <span className={`${styles.badge} ${styles['badge-success']}`}>Claimed</span>
        )}
        {!isFullyClaimed && item.Claims && item.Claims.length > 0 && (
          <span className={`${styles.badge} ${styles['badge-success']}`}>
            {allowGroupFunds ? 'Funded' : 'Claimed'}
          </span>
        )}
        {isPrivate && (
          <span className={`${styles.badge} ${styles['badge-private']}`}>Private</span>
        )}
        {item.IsSuggestion && (
          <span className={`${styles.badge} ${styles['badge-suggestion']}`}>Suggestion</span>
        )}
      </div>

      <div className={styles['card-badges-tr']}>
        {isOwner ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={styles['star-btn']}
            title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
          >
            <Star
              size={14}
              fill={isFavorite ? 'var(--warning)' : 'none'}
              stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
            />
          </button>
        ) : isFavorite ? (
          <span className={styles['star-btn-static']}>
            <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
          </span>
        ) : null}
      </div>

      <div className={styles['card-visual']}>
        <CategoryIcon size={40} className={styles['card-icon']} />
      </div>

      <div className={styles['card-content']}>
        <h4 className={styles['card-title']}>
          {isLinkedToItems && (
            <Link2 size={12} className={styles['linked-icon']} aria-hidden="true" />
          )}
          {item.Name}
        </h4>
        <span className={styles['card-price']}>
          {primaryPrice != null ? `$${primaryPrice}` : '—'}
        </span>
      </div>
    </div>
  );
};
