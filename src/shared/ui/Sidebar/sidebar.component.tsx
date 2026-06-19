import React from 'react';
import { SidebarProps } from './sidebar.interface';
import { SidebarTemplate } from './sidebar.html';
import styles from './sidebar.module.css';

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  position,
  title,
  onClose,
  children
}) => {
  const sidebarClass = `${styles.sidebarWrapper} ${
    position === 'left' ? styles.left : styles.right
  } ${isOpen ? styles.active : ''}`;

  return (
    <SidebarTemplate
      sidebarClass={sidebarClass}
      title={title}
      onClose={onClose}
    >
      {children}
    </SidebarTemplate>
  );
};
