export interface TabBarProps {
  activeTab: 'my-lists' | 'shared' | 'archive';
  setActiveTab: (tab: 'my-lists' | 'shared' | 'archive') => void;
  myListsCount: number;
  sharedListsCount: number;
  archivedListsCount: number;
}
