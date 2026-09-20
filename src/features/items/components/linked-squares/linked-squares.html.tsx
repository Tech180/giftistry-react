import React from 'react';
import { X } from 'lucide-react';
import { getCategoryMeta } from '../../utils/get-category-meta.util';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './linked-squares.module.css';

export const LinkedSquaresTemplate: React.FC<TemplateProps> = ({
  items,
  onRemoveId,
  onItemClick,
  className,
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`${styles['linked-squares']} ${className || ''}`}>
      {items.map((matchedItem) => {
        const categoryMeta = getCategoryMeta(matchedItem.Category);
        const Icon = categoryMeta.icon;
        return (
          <div key={matchedItem.Id} className={styles['linked-squares__wrapper']}>
            {onRemoveId && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveId(matchedItem.Id);
                }}
                className={styles['linked-squares__remove']}
                title="Remove linked item"
              >
                <X size={10} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onItemClick?.(matchedItem.Id)}
              className={`${styles['linked-squares__card']} ${
                onItemClick ? styles['linked-squares__card--clickable'] : ''
              }`}
              title={matchedItem.Name}
              disabled={!onItemClick}
            >
              <div className={styles['linked-squares__icon']}>
                <Icon size={18} />
              </div>
              <span className={styles['linked-squares__title']}>{matchedItem.Name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
