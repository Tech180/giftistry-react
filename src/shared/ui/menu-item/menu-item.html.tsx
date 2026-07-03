import React from 'react';
import { MenuItemTemplateProps } from './interfaces/menu-item-template-props.interface';
import styles from './menu-item.module.css';

export const MenuItemTemplate: React.FC<MenuItemTemplateProps> = ({
  icon,
  label,
  onClick,
  itemClass,
}) => {
  return (
    <button type="button" className={itemClass} onClick={onClick} role="menuitem">
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </button>
  );
};
