import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { LinkedItemSquares } from 'shared/ui/linked-item-squares';
import { MiniDrawerTemplateProps } from './interfaces/mini-drawer-template-props.interface';
import styles from './mini-drawer.module.css';

export const MiniDrawerTemplate: React.FC<MiniDrawerTemplateProps> = ({
  onRemoveId,
  onItemClick,
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
      <LinkedItemSquares
        items={matchedItems}
        onRemoveId={onRemoveId}
        onItemClick={onItemClick}
        className={styles['mini-drawer-squares']}
      />
    </EnterPanel>
  );
};
