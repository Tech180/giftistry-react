import React from 'react';
import { PanelTemplateProps } from './interfaces/panel.interface';
import styles from './panel.module.css';

export const SharePanelTemplate: React.FC<PanelTemplateProps> = ({
  activeTab,
  setActiveTab,
  friendsTab,
  linkTab,
  manageTab,
  manageCount,
}) => {
  return (
    <div className={styles.panel}>
      <nav className={styles['tabs-nav']}>
        <button
          type="button"
          onClick={() => setActiveTab('friends')}
          className={`${styles['tab-btn']} ${activeTab === 'friends' ? styles['tab-btn-active'] : ''}`}
        >
          Friends
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('link')}
          className={`${styles['tab-btn']} ${activeTab === 'link' ? styles['tab-btn-active'] : ''}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={`${styles['tab-btn']} ${activeTab === 'manage' ? styles['tab-btn-active'] : ''}`}
        >
          Manage
          {manageCount > 0 && <span className={styles['manage-badge']}>{manageCount}</span>}
        </button>
      </nav>
      <div className={styles['tab-content']}>
        {activeTab === 'friends' && friendsTab}
        {activeTab === 'link' && linkTab}
        {activeTab === 'manage' && manageTab}
      </div>
    </div>
  );
};
