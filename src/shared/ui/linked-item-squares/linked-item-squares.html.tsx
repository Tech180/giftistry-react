import React from 'react';
import { X } from 'lucide-react';
import { getCategoryMeta } from 'features/items';
import { LinkedItemSquaresTemplateProps } from './interfaces/linked-item-squares-template-props.interface';
import styles from './linked-item-squares.module.css';

export const LinkedItemSquaresTemplate: React.FC<LinkedItemSquaresTemplateProps> = ({
  items,
  onRemoveId,
  onItemClick,
  className,
}) => {
  if (items.length === 0) return null;

  return (
    <div className={`${styles.squares} ${className || ''}`}>
      {items.map((matchedItem) => {
        const categoryMeta = getCategoryMeta(matchedItem.Category);
        const Icon = categoryMeta.icon;
        return (
          <div key={matchedItem.Id} className={styles['square-card-wrapper']}>
            {onRemoveId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveId(matchedItem.Id);
                }}
                className={styles['remove-btn']}
                title="Remove linked item"
              >
                <X size={10} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onItemClick?.(matchedItem.Id)}
              className={`${styles['square-card']} ${onItemClick ? styles['square-card-clickable'] : ''}`}
              title={matchedItem.Name}
              disabled={!onItemClick}
            >
              <div className={styles['icon-wrapper']}>
                <Icon size={18} />
              </div>
              <span className={styles.title}>
                {matchedItem.Name}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
