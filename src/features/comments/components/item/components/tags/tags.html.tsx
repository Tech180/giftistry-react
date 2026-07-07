import React from 'react';
import { Tag } from 'lucide-react';
import { TagsProps } from './interfaces/tags-props.interface';
import styles from './tags.module.css';

export const TagsTemplate: React.FC<TagsProps> = ({
  taggedIds,
  items,
  onItemTaggedClick,
}) => {
  if (taggedIds.length === 0) return null;

  return (
    <div className={styles['comment-tags-container']}>
      {taggedIds.map((itemId) => {
        const matchedItem = items.find((i) => i.Id === itemId);
        const itemName = matchedItem ? matchedItem.Name : 'View item';
        return (
          <button
            key={itemId}
            type="button"
            onClick={() => onItemTaggedClick?.(itemId)}
            className={styles['comment-tag-icon-btn']}
            title={itemName}
          >
            <Tag size={12} />
          </button>
        );
      })}
    </div>
  );
};
