import React from 'react';
import { Star, Link2, Layers2, Eye } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import {
  TaggingOverlay,
  QuantityBadge,
  SuggestionBadge,
} from '../../item-presentation';
import styles from './view.module.css';

export const ViewTemplate: React.FC<TemplateProps> = (props) => {
  const {
    item,
    displayItem = item,
    canCollaborate,
    isFullyClaimed,
    isFavorite,
    toggleFavorite,
    isTaggingModeActive,
    onSelectTag,
    isSelected,
    onSelect,
    onView,
    CategoryIcon,
    isPrivate,
    metadata,
    isOwner,
    rootClassName,
    iconClassName,
    isLinkedToItems,
    isRelatedToItems,
    primaryPrice,
    primaryImageUrl,
    isSelectable,
    onHoverChange,
    suggestedByDisplayName,
  } = props;

  return (
    <div
      className={rootClassName}
      data-testid="item-card-view"
      onClick={isSelectable ? onSelect : undefined}
      onMouseEnter={isSelectable ? () => onHoverChange(true) : undefined}
      onMouseLeave={isSelectable ? () => onHoverChange(false) : undefined}
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
        isTaggingModeActive = {
          !!isTaggingModeActive
        }
        onSelectTag = {
          onSelectTag
        }
      />

      <div className={styles['view__badges-tl']}>
        {isFullyClaimed && (
          <span className={`${styles['view__badge']} ${styles['view__badge--success']}`}>
            Claimed
          </span>
        )}
        {isPrivate && (
          <span className={`${styles['view__badge']} ${styles['view__badge--private']}`}>
            Private
          </span>
        )}
      </div>

      <div className={styles['view__badges-tr']}>
        {item.IsSuggestion && (
          <SuggestionBadge
            userId = {
              item.SuggestedByUserId
            }
            displayName = {
              suggestedByDisplayName
            }
          />
        )}
        {onView ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
            className={styles['view__view-btn']}
            title="View Item"
            aria-label="View item"
          >
            <Eye size={14} />
          </button>
        ) : null}
        {canCollaborate ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            className={styles['view__star']}
            title={isFavorite ? 'Remove Favorite' : 'Mark as Favorite'}
          >
            <Star
              size={14}
              fill={isFavorite ? 'var(--warning)' : 'none'}
              stroke={isFavorite ? 'var(--warning)' : 'currentColor'}
            />
          </button>
        ) : isFavorite ? (
          <span className={styles['view__star-static']}>
            <Star size={14} fill="var(--warning)" stroke="var(--warning)" />
          </span>
        ) : null}
      </div>

      <div className={styles['view__visual']}>
        {primaryImageUrl ? (
          <img
            src={primaryImageUrl}
            alt=""
            className={styles['view__photo']}
          />
        ) : (
          <CategoryIcon
            size = {
              40
            }
            className = {
              iconClassName
            }
          />
        )}
      </div>

      <div className={styles['view__content']}>
        <h4 className={styles['view__title']}>
          {isLinkedToItems && (
            <Link2 size={12} className={styles['view__linked-icon']} aria-hidden="true" />
          )}
          {isRelatedToItems && (
            <Layers2
              size={12}
              className={styles['view__linked-icon']}
              aria-label="Related to other items"
            />
          )}
          {displayItem.Name}
        </h4>
        <div className={styles['view__price-row']}>
          <QuantityBadge
            item = {
              item
            }
            metadata = {
              metadata
            }
            isOwner = {
              isOwner
            }
          />
          <span className={styles['view__price']}>
            {primaryPrice != null ? `$${primaryPrice}` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};
