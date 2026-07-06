import React from 'react';
import { TabItemProps } from './interfaces/tab-item-props.interface';
import { TabItemTemplate } from './tab-item.html';
import styles from './tab-item.module.css';

export type { TabItemProps } from './interfaces/tab-item-props.interface';

export const TabItem: React.FC<TabItemProps> = ({
  label,
  count,
  isActive,
  onClick,
}) => {
  const buttonClass = [styles['tab-button'], isActive ? styles['active-tab-button'] : '']
    .filter(Boolean)
    .join(' ');

  const countClass = isActive ? styles['active-tab-count'] : styles['inactive-tab-count'];

  return (
    <TabItemTemplate
      label={label}
      count={count}
      isActive={isActive}
      onClick={onClick}
      buttonClass={buttonClass}
      countClass={countClass}
    />
  );
};
