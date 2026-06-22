import React from 'react';
import { X } from 'lucide-react';
import { getCategoryMeta } from 'features/items/components/card/category-icons';
import { MiniSidebarTemplateProps } from './mini-sidebar.interface';
import styles from './mini-sidebar.module.css';

export const MiniSidebarTemplate: React.FC<MiniSidebarTemplateProps> = ({
  onRemoveId,
  label = 'Tags',
  sidebarClass,
  matchedItems,
}) => {
  return (
    <div className={sidebarClass}>
      <span className={styles.miniSidebarLabel}>{label}</span>
      <div className={styles.miniSidebarSquares}>
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
