import React from 'react';
import { TabBarProps } from './interfaces/tab-bar-props.interface';
import { TabBarTemplate } from './tab-bar.html';
import styles from './tab-bar.module.css';

export type { TabBarProps } from './interfaces/tab-bar-props.interface';
export type { TabDefinition } from './interfaces/tab-definition.interface';

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const containerClass = [styles.tabsContainer, className].filter(Boolean).join(' ');

  return (
    <TabBarTemplate
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
      containerClass={containerClass}
    />
  );
};
