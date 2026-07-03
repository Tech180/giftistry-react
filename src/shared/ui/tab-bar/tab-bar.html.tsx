import React from 'react';
import { TabBarTemplateProps } from './interfaces/tab-bar-template-props.interface';
import { TabItem } from '../tab-item/tab-item.component';
import styles from './tab-bar.module.css';

export const TabBarTemplate: React.FC<TabBarTemplateProps> = ({
  tabs,
  activeTab,
  onTabChange,
  containerClass,
}) => {
  return (
    <div className={containerClass} role="tablist">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          label={tab.label}
          count={tab.count}
          isActive={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
};
