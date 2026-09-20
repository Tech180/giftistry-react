import React from 'react';
import { EnterPanel } from 'shared/ui/enter-panel/enter-panel.component';
import { LinkedSquares } from '../linked-squares/linked-squares.component';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './mini-drawer.module.css';

export const MiniDrawerTemplate: React.FC<TemplateProps> = ({
  onRemoveId,
  onItemClick,
  label = 'Tags',
  drawerClass,
  matchedItems,
  position,
  edgeOffset,
  inlineOnMobile = false,
}) => {
  const style =
    edgeOffset && !inlineOnMobile && position === 'left'
      ? ({ ['--mini-drawer-edge-offset' as string]: edgeOffset } as React.CSSProperties)
      : undefined;

  return (
    <EnterPanel
      animation={position === 'right' ? 'mini-right' : 'mini-left'}
      className={drawerClass}
      style={style}
    >
      <span className={styles['mini-drawer__label']}>{label}</span>
      <LinkedSquares
        items={matchedItems}
        onRemoveId={onRemoveId}
        onItemClick={onItemClick}
        className={`${styles['mini-drawer__squares']} ${
          inlineOnMobile ? styles['mini-drawer__squares--inline'] : ''
        }`}
      />
    </EnterPanel>
  );
};
