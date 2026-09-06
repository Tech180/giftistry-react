import React from 'react';
import { X } from 'lucide-react';
import type { ShareFabPanelTemplateProps } from './interfaces/share-fab-panel-props.interface';
import styles from './share-fab-panel.module.css';

export const ShareFabPanelTemplate: React.FC<ShareFabPanelTemplateProps> = ({
  activeTab,
  setActiveTab,
  onClose,
  hideTabs = false,
  linkTab,
  inviteTab,
  accessTab,
}) => {
  const tabs: Array<{ id: ShareFabPanelTemplateProps['activeTab']; label: string }> = [
    { id: 'link', label: 'Link' },
    { id: 'invite', label: 'Invite' },
    { id: 'access', label: 'Access' },
  ];

  return (
    <div className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.headerTitle}>Share Wishlist</span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X size={16} aria-hidden />
        </button>
      </header>

      {!hideTabs && (
        <div className={styles.tabsNav} role="tablist" aria-label="Share options">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`share-fab-tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`share-fab-panel-${tab.id}`}
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.tabContent}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`share-fab-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={hideTabs ? undefined : `share-fab-tab-${tab.id}`}
            aria-hidden={activeTab !== tab.id}
            className={`${styles.tabPanel} ${activeTab === tab.id ? styles.tabPanelActive : ''}`}
          >
            {tab.id === 'link' && linkTab}
            {tab.id === 'invite' && inviteTab}
            {tab.id === 'access' && accessTab}
          </div>
        ))}
      </div>
    </div>
  );
};
