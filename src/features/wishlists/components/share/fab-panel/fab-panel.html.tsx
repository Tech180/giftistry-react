import React from 'react';
import { X } from 'lucide-react';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './fab-panel.module.css';

export const FabPanelTemplate: React.FC<TemplateProps> = ({
  activeTab,
  setActiveTab,
  onClose,
  hideTabs = false,
  tabs,
  linkTab,
  inviteTab,
  accessTab,
}) => (
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
