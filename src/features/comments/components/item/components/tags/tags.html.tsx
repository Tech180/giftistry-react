import React from 'react';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { TagsTemplateProps } from './interfaces/tags-template-props.interface';
import { getCommentTagStackNumber } from './utils/get-comment-tag-stack-number.util';
import styles from './tags.module.css';

export const TagsTemplate: React.FC<TagsTemplateProps> = ({
  taggedIds,
  items,
  onItemTaggedClick,
  appearance = 'rail',
  listRef,
  canScroll,
  canScrollUp,
  canScrollDown,
  onScroll,
  onScrollUp,
  onScrollDown,
  onListKeyDown,
}) => {
  const isBadges = appearance === 'badges';
  const showScrollChrome = canScroll && !isBadges;
  const containerClass = [
    styles['comment-tags-container'],
    isBadges ? styles['comment-tags-container-badges'] : '',
  ]
    .filter(Boolean)
    .join(' ');
  const listClass = [
    styles['comment-tags-list'],
    isBadges ? styles['comment-tags-list-badges'] : '',
    showScrollChrome ? styles['comment-tags-list-scrollable'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass} onKeyDown={onListKeyDown}>
      {showScrollChrome && (
        <button
          type="button"
          className={styles['comment-tags-scroll-btn']}
          aria-label="Show previous tagged items"
          disabled={!canScrollUp}
          onClick={onScrollUp}
        >
          <ChevronUp size={14} className={styles['comment-tags-scroll-icon']} />
        </button>
      )}

      <div
        ref={listRef}
        className={listClass}
        onScroll={onScroll}
        tabIndex={showScrollChrome ? 0 : undefined}
        aria-label="Tagged items"
      >
        {taggedIds.map((itemId, index) => {
          const matchedItem = items.find((i) => i.Id === itemId);
          const itemName = matchedItem ? matchedItem.Name : 'View item';
          const stackNumber = getCommentTagStackNumber(index);
          return (
            <button
              key={itemId}
              type="button"
              onClick={() => onItemTaggedClick?.(itemId)}
              className={styles['comment-tag-icon-btn']}
              title={`${itemName} (${stackNumber})`}
              aria-label={`${itemName}, tag ${stackNumber} of ${taggedIds.length}`}
            >
              <Tag
                size={isBadges ? 20 : 12}
                className={styles['comment-tag-icon']}
              />
              <span className={styles['comment-tag-index']} aria-hidden="true">
                {stackNumber}
              </span>
            </button>
          );
        })}
      </div>

      {showScrollChrome && (
        <button
          type="button"
          className={styles['comment-tags-scroll-btn']}
          aria-label="Show more tagged items"
          disabled={!canScrollDown}
          onClick={onScrollDown}
        >
          <ChevronDown size={14} className={styles['comment-tags-scroll-icon']} />
        </button>
      )}
    </div>
  );
};
