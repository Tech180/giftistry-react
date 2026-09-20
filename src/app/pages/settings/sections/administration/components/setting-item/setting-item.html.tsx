import React from 'react';
import { SettingItemTemplateProps } from './interfaces/setting-item-template-props.interface';
import styles from './setting-item.module.css';

export const SettingItemTemplate: React.FC<SettingItemTemplateProps> = ({
  title,
  description,
  children,
  layout,
  className = '',
}) => (
  <div
    className={`${styles['setting-item']} ${layout === 'column' ? styles['setting-item-column'] : ''} ${className}`.trim()}
  >
    <div className={styles['setting-item-content']}>
      <span className={styles['setting-item-title']}>{title}</span>
      {description && <span className={styles['setting-item-desc']}>{description}</span>}
    </div>
    <div
      className={`${styles['setting-item-control']} ${layout === 'column' ? styles['setting-item-control-wide'] : ''}`.trim()}
    >
      {children}
    </div>
  </div>
);
