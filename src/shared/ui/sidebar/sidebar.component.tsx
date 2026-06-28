import React from 'react';
import { SidebarProps } from './sidebar.interface';
import { SidebarTemplate } from './sidebar.html';
import styles from './sidebar.module.css';

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  position,
  title,
  onClose,
  children,
  overflowVisible = false,
  miniSidebar,
}) => {
  const sidebarClass = `${styles.sidebarWrapper} ${
    position === 'left' ? styles.left : styles.right
  } ${isOpen ? styles.active : ''} ${overflowVisible ? styles.overflowVisible : ''}`;

  return (
    <SidebarTemplate
      sidebarClass={sidebarClass}
      title={title}
      onClose={onClose}
      overflowVisible={overflowVisible}
      miniSidebar={miniSidebar}
    >
      {children}
    </SidebarTemplate>
  );
};
