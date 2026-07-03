import React from 'react';
import { X } from 'lucide-react';
import { getCategoryMeta } from 'features/items';
import { MiniDrawerTemplateProps } from './interfaces/mini-drawer-template-props.interface';
import styles from './mini-drawer.module.css';

export const MiniDrawerTemplate: React.FC<MiniDrawerTemplateProps> = ({
  onRemoveId,
  label = 'Tags',
  drawerClass,
  matchedItems,
}) => {
  return (
    <div className={drawerClass}>
      <span className={styles.miniDrawerLabel}>{label}</span>
      <div className={styles.miniDrawerSquares}>
        {matchedItems.map((matchedItem) => {
          const categoryMeta = getCategoryMeta(matchedItem.Category);
          const Icon = categoryMeta.icon;
          return (
            <div key={matchedItem.Id} className={styles.miniSquareCard}>
              <button
                type="button"
                onClick={() => onRemoveId(matchedItem.Id)}
                className={styles.miniSquareRemoveBtn}
                title={`Remove ${label}`}
              >
                <X size={10} />
              </button>
              <div className={styles.miniSquareIconWrapper}>
                <Icon size={18} />
              </div>
              <span className={styles.miniSquareTitle} title={matchedItem.Name}>
                {matchedItem.Name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
