import React from 'react';
import { SidebarItemProps } from './interfaces/sidebar-item-props.interface';
import { SidebarItemTemplate } from './sidebar-item.html';
import styles from './sidebar-item.module.css';

export type { SidebarItemProps } from './interfaces/sidebar-item-props.interface';

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  href,
  onClick,
  className = '',
}) => {
  const itemClass = [styles.item, isActive ? styles.active : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <SidebarItemTemplate
      icon={icon}
      label={label}
      isActive={isActive}
      href={href}
      onClick={onClick}
      itemClass={itemClass}
    />
  );
};
