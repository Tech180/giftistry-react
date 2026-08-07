import React from 'react';
import { Item } from 'features/items';
import { MiniDrawerProps } from './interfaces/mini-drawer-props.interface';
import { MiniDrawerTemplate } from './mini-drawer.html';
import styles from './mini-drawer.module.css';

export const MiniDrawer: React.FC<MiniDrawerProps> = (props) => {
  const {
    isActive,
    selectedIds,
    position,
    items,
    inlineOnMobile = false,
    edgeOffset,
  } = props;

  if (!isActive && selectedIds.length === 0) return null;

  const drawerClass = [
    styles['mini-drawer'],
    position === 'right' ? styles['position-right'] : styles['position-left'],
    inlineOnMobile ? styles['inline-on-mobile'] : '',
    edgeOffset && !inlineOnMobile && position === 'left' ? styles['edge-offset'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const matchedItems = selectedIds
    .map((id) => items.find((i) => i.Id === id))
    .filter((item): item is Item => !!item);

  return (
    <MiniDrawerTemplate
      {...props}
      drawerClass={drawerClass}
      matchedItems={matchedItems}
    />
  );
};
