export interface DashboardTemplateProps {
  getGreeting: () => string;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  activeTab: 'my-lists' | 'shared' | 'archive';
  setActiveTab: (tab: 'my-lists' | 'shared' | 'archive') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  myLists: any[];
  sharedLists: any[];
  archivedLists: any[];
  currentLists: any[];
  isLoading: boolean;
  error: string | null;
  handleCreateSuccess: () => void;
}
