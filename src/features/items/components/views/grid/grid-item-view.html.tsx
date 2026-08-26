import React from 'react';
import { Star, Link2, Layers2, Eye } from 'lucide-react';
import { ItemViewProps } from '../../../interfaces/item-view-props.interface';
import {
  TaggingOverlay,
  QuantityBadge,
  SuggestionBadge,
} from '../../item-presentation';
import { buildItemCardModifierClasses, getClaimedGrayOutClass, getUserClaimedHighlightClass } from '../shared/item-card-modifiers.util';
import { getItemPrimaryImageUrl } from '../../../utils/item-primary-image.util';
import { resolveItemClaimBadgeState } from '../../../utils/resolve-item-claim-badge-state.util';
import { resolveSuggestedByDisplayName } from '../../../utils/resolve-suggested-by-display-name.util';
import styles from './grid-item-view.module.css';

export const GridItemView: React.FC<ItemViewProps> = (props) => {
  const {
    item,
    displayItem = item,
    isOwner,
    isFullyClaimed,
    isMultiCount,
    hasVisibleClaimForGray,
    isFavorite,
    toggleFavorite,
    claimedByCurrentUser,
    isTaggingModeActive,
    isTaggedSelection,
    onSelectTag,
    isSelected,
    onSelect,
    onView,
    CategoryIcon,
    isPrivate,
    linkedItems,
    relatedItems,
    isLinkingContext,
    isRelatingContext,
    metadata,
    claimUserId,
  } = props;

  const isLinkedToItems = linkedItems.length > 0 || (isLinkingContext && isTaggedSelection);
  const isRelatedToItems = relatedItems.length > 0 || (isRelatingContext && isTaggedSelection);
  const primaryPrice = item.Links[0]?.ExtractedPrice;
  const primaryImageUrl = getItemPrimaryImageUrl(displayItem);
  const { hasVisibleClaim } = resolveItemClaimBadgeState(
    displayItem.Claims,
    claimUserId,
    claimedByCurrentUser
  );
  const isSelectable = typeof onSelect === 'function';

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
    hasVisibleClaimForGray ?? hasVisibleClaim,
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
      className={`${styles['gift-card']} ${modifierClass} ${claimedGrayClass} ${userClaimedHighlightClass} ${isSelected ? styles['is-selected'] : ''} ${isSelectable ? styles['is-selectable'] : ''}`}
      onClick={isSelectable ? onSelect : undefined}
      role={isSelectable ? 'button' : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onKeyDown={
        isSelectable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect?.();
              }
            }
          : undefined
      }
      aria-pressed={isSelectable ? isSelected : undefined}
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
        {isPrivate && (
          <span className={`${styles.badge} ${styles['badge-private']}`}>Private</span>
        )}
      </div>

      <div className={styles['card-badges-tr']}>
        {item.IsSuggestion && (
          <SuggestionBadge
            userId={item.SuggestedByUserId}
            displayName={resolveSuggestedByDisplayName(item)}
          />
        )}
        {onView ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className={styles['view-btn']}
            title="View Item"
            aria-label="View item"
          >
            <Eye size={14} />
          </button>
        ) : null}
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
        {primaryImageUrl ? (
          <img
            src={primaryImageUrl}
            alt=""
            className={styles['card-photo']}
          />
        ) : (
          <CategoryIcon size={40} className={styles['card-icon']} />
        )}
      </div>

      <div className={styles['card-content']}>
        <h4 className={styles['card-title']}>
          {isLinkedToItems && (
            <Link2 size={12} className={styles['linked-icon']} aria-hidden="true" />
          )}
          {isRelatedToItems && (
            <Layers2 size={12} className={styles['linked-icon']} aria-label="Related to other items" />
          )}
          {displayItem.Name}
        </h4>
        <div className={styles['card-price-row']}>
          <QuantityBadge item={item} metadata={metadata} isOwner={isOwner} />
          <span className={styles['card-price']}>
            {primaryPrice != null ? `$${primaryPrice}` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};
