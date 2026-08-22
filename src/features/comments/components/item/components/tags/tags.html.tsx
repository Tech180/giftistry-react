import React from 'react';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { TagsTemplateProps } from './interfaces/tags-template-props.interface';
import { getCommentTagStackNumber } from './utils/get-comment-tag-stack-number.util';
import styles from './tags.module.css';

export const TagsTemplate: React.FC<TagsTemplateProps> = ({
  taggedIds,
  items,
  onItemTaggedClick,
  listRef,
  canScroll,
  canScrollUp,
  canScrollDown,
  onScroll,
  onScrollUp,
  onScrollDown,
  onListKeyDown,
}) => {
  return (
    <div className={styles['comment-tags-container']} onKeyDown={onListKeyDown}>
      {canScroll && (
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
        className={`${styles['comment-tags-list']}${canScroll ? ` ${styles['comment-tags-list-scrollable']}` : ''}`}
        onScroll={onScroll}
        tabIndex={canScroll ? 0 : undefined}
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
              <Tag size={12} className={styles['comment-tag-icon']} />
              <span className={styles['comment-tag-index']} aria-hidden="true">
                {stackNumber}
              </span>
            </button>
          );
        })}
      </div>

      {canScroll && (
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
