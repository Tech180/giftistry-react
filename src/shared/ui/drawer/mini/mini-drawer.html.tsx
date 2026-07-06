import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { X } from 'lucide-react';
import { getCategoryMeta } from 'features/items';
import { MiniDrawerTemplateProps } from './interfaces/mini-drawer-template-props.interface';
import styles from './mini-drawer.module.css';

export const MiniDrawerTemplate: React.FC<MiniDrawerTemplateProps> = ({
  onRemoveId,
  label = 'Tags',
  drawerClass,
  matchedItems,
  position,
}) => {
  return (
    <EnterPanel
      animation={position === 'right' ? 'mini-right' : 'mini-left'}
      className={drawerClass}
    >
      <span className={styles['mini-drawer-label']}>{label}</span>
      <div className={styles['mini-drawer-squares']}>
        {matchedItems.map((matchedItem) => {
          const categoryMeta = getCategoryMeta(matchedItem.Category);
          const Icon = categoryMeta.icon;
          return (
            <div key={matchedItem.Id} className={styles['mini-square-card']}>
              <button
                type="button"
                onClick={() => onRemoveId(matchedItem.Id)}
                className={styles['mini-square-remove-btn']}
                title={`Remove ${label}`}
              >
                <X size={10} />
              </button>
              <div className={styles['mini-square-icon-wrapper']}>
                <Icon size={18} />
              </div>
              <span className={styles['mini-square-title']} title={matchedItem.Name}>
                {matchedItem.Name}
              </span>
            </div>
          );
        })}
      </div>
    </EnterPanel>
  );
};
