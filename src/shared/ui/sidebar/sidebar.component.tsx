import React from 'react';
import { SidebarProps } from './interfaces/sidebar-props.interface';
import { SidebarTemplate } from './sidebar.html';
import styles from './sidebar.module.css';

export type { SidebarProps } from './interfaces/sidebar-props.interface';

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  const containerClass = [styles.sidebar, className].filter(Boolean).join(' ');

  return <SidebarTemplate containerClass={containerClass}>{children}</SidebarTemplate>;
};
