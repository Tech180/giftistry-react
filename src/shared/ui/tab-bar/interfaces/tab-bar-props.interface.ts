import { TabDefinition } from './tab-definition.interface';

export interface TabBarProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}
