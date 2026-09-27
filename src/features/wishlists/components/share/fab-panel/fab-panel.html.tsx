import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { TOUR_TARGETS } from 'features/tour';
import type { TemplateProps } from './interfaces/template-props.interface';
import styles from './fab-panel.module.css';

const FAB_TAB_TOUR: Record<string, string> = {
  link: TOUR_TARGETS.shareTabLink,
  invite: TOUR_TARGETS.shareTabFriends,
  access: TOUR_TARGETS.shareTabManage,
};

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
      <button
        type="button"
        className={styles.backBtn}
        onClick={onClose}
        aria-label="Go back"
      >
        <ChevronLeft size={18} aria-hidden />
      </button>
      <span className={styles.headerTitle}>Share Wishlist</span>
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
            data-tour={FAB_TAB_TOUR[tab.id]}
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
