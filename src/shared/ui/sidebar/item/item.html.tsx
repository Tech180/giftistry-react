import React from 'react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './item.module.css';

export const ItemTemplate: React.FC<TemplateProps> = ({
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
