import React from 'react';
import { SidebarItemTemplateProps } from './interfaces/sidebar-item-template-props.interface';
import styles from './sidebar-item.module.css';

export const SidebarItemTemplate: React.FC<SidebarItemTemplateProps> = ({
  icon,
  label,
  isActive,
  href,
  onClick,
  itemClass,
}) => {
  const content = (
    <>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={itemClass}
        onClick={onClick}
        aria-current={isActive ? 'page' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={itemClass} onClick={onClick}>
      {content}
    </button>
  );
};
