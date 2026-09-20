import type React from 'react';
import type { Tab } from './tab.type';
import type { TabDefinition } from './tab-definition.interface';

export interface TemplateProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onClose: () => void;
  hideTabs?: boolean;
  tabs: TabDefinition[];
  linkTab: React.ReactNode;
  inviteTab: React.ReactNode;
  accessTab: React.ReactNode;
}
