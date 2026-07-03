import React from 'react';
import { TabItemTemplateProps } from './interfaces/tab-item-template-props.interface';
import styles from './tab-item.module.css';

export const TabItemTemplate: React.FC<TabItemTemplateProps> = ({
  label,
  count,
  onClick,
  buttonClass,
  countClass,
}) => {
  return (
    <button type="button" className={buttonClass} onClick={onClick}>
      {label}
      {count !== undefined && (
        <span className={`${styles.tabCount} ${countClass}`}>{count}</span>
      )}
    </button>
  );
};
