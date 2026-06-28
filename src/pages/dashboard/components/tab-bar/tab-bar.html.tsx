import React from 'react';
import { TabBarProps } from './interfaces/tab-bar-props.interface';
import styles from './tab-bar.module.css';

export const TabBarTemplate: React.FC<TabBarProps> = ({
  activeTab,
  setActiveTab,
  myListsCount,
  sharedListsCount,
  archivedListsCount,
}) => {
  return (
    <div className={styles.tabsContainer}>
      <button
        onClick={() => setActiveTab('my-lists')}
        className={`${styles.tabButton} ${activeTab === 'my-lists' ? styles.activeTabButton : ''}`}
      >
        My Wishlists
        <span className={`${styles.tabCount} ${activeTab === 'my-lists' ? styles.activeTabCount : styles.inactiveTabCount}`}>
          {myListsCount}
        </span>
      </button>
      <button
        onClick={() => setActiveTab('shared')}
        className={`${styles.tabButton} ${activeTab === 'shared' ? styles.activeTabButton : ''}`}
      >
        Shared
        <span className={`${styles.tabCount} ${activeTab === 'shared' ? styles.activeTabCount : styles.inactiveTabCount}`}>
          {sharedListsCount}
        </span>
      </button>
      <button
        onClick={() => setActiveTab('archive')}
        className={`${styles.tabButton} ${activeTab === 'archive' ? styles.activeTabButton : ''}`}
      >
        Archived
        <span className={`${styles.tabCount} ${activeTab === 'archive' ? styles.activeTabCount : styles.inactiveTabCount}`}>
          {archivedListsCount}
        </span>
      </button>
    </div>
  );
};
