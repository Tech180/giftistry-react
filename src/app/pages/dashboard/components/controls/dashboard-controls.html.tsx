import React from 'react';
import { TabBar, SearchInput } from 'shared/ui';
import type { DashboardControlsTemplateProps } from './interfaces/dashboard-controls-template-props.interface';
import styles from './dashboard-controls.module.css';

export const DashboardControlsTemplate: React.FC<DashboardControlsTemplateProps> = ({
  tabs,
  activeTab,
  searchQuery,
  onTabChange,
  onSearchChange,
}) => (
  <div className={styles['dashboard-controls']}>
    <TabBar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
    <SearchInput
      value={searchQuery}
      onChange={onSearchChange}
      placeholder="Search wishlists..."
      className={styles['dashboard-controls__search']}
    />
  </div>
);
