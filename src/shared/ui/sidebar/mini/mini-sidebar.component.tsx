import React from 'react';
import { Item } from 'features/items/interfaces/item.interface';
import { MiniSidebarProps } from './mini-sidebar.interface';
import { MiniSidebarTemplate } from './mini-sidebar.html';
import styles from './mini-sidebar.module.css';

export const MiniSidebar: React.FC<MiniSidebarProps> = (props) => {
  const { isActive, selectedIds, position, items } = props;

  if (!isActive && selectedIds.length === 0) return null;

  const sidebarClass = `${styles.miniSidebar} ${
    position === 'right' ? styles.positionRight : styles.positionLeft
  }`;

  const matchedItems = selectedIds
    .map((id) => items.find((i) => i.Id === id))
    .filter((item): item is Item => !!item);

  return (
    <MiniSidebarTemplate
      {...props}
      sidebarClass={sidebarClass}
      matchedItems={matchedItems}
    />
  );
};
