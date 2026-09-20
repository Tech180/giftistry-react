import React from 'react';
import type { Item } from '../../interfaces/item.interface';
import type { Props } from './interfaces/props.interface';
import { MiniDrawerTemplate } from './mini-drawer.html';
import styles from './mini-drawer.module.css';

export const MiniDrawer: React.FC<Props> = (props) => {
  const {
    isActive,
    selectedIds,
    position,
    items,
    inlineOnMobile = false,
    edgeOffset,
  } = props;

  if (!isActive && selectedIds.length === 0) {
    return null;
  }

  const drawerClass = [
    styles['mini-drawer'],
    position === 'right' ? styles['mini-drawer--right'] : styles['mini-drawer--left'],
    inlineOnMobile ? styles['mini-drawer--inline'] : '',
    edgeOffset && !inlineOnMobile && position === 'left' ? styles['mini-drawer--edge-offset'] : '',
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
