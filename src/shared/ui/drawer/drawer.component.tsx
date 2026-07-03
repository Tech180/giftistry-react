import React from 'react';
import { DrawerProps } from './interfaces/drawer-props.interface';
import { DrawerTemplate } from './drawer.html';
import styles from './drawer.module.css';

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  position,
  title,
  onClose,
  children,
  overflowVisible = false,
  miniDrawer,
}) => {
  const drawerClass = `${styles.drawerWrapper} ${
    position === 'left' ? styles.left : styles.right
  } ${isOpen ? styles.active : ''} ${overflowVisible ? styles.overflowVisible : ''}`;

  return (
    <DrawerTemplate
      drawerClass={drawerClass}
      title={title}
      onClose={onClose}
      overflowVisible={overflowVisible}
      miniDrawer={miniDrawer}
    >
      {children}
    </DrawerTemplate>
  );
};
