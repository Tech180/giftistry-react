import React from 'react';
import { MenuItemProps } from './interfaces/menu-item-props.interface';
import { MenuItemTemplate } from './menu-item.html';
import styles from './menu-item.module.css';

export type { MenuItemProps } from './interfaces/menu-item-props.interface';
export type { MenuItemVariant } from './interfaces/menu-item-variant.interface';

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  onClick,
  isActive = false,
  variant = 'default',
  className = '',
}) => {
  const itemClass = [
    styles.item,
    isActive ? styles.active : '',
    variant === 'danger' ? styles.danger : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <MenuItemTemplate
      icon={icon}
      label={label}
      onClick={onClick}
      isActive={isActive}
      variant={variant}
      itemClass={itemClass}
    />
  );
};
