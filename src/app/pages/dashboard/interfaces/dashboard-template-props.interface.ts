import React from 'react';
import { Wishlist } from 'features/wishlists';

export interface DashboardTab {
  id: string;
  label: string;
  count: number;
}

export interface DashboardTemplateProps {
  getGreeting: () => string;
  isCreateOpen: boolean;
  setIsCreateOpen: (open: boolean) => void;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
  activeTab: 'my-lists' | 'shared' | 'archive';
  setActiveTab: (tab: 'my-lists' | 'shared' | 'archive') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tabs: DashboardTab[];
  currentLists: Wishlist[];
  isLoading: boolean;
  error: string | null;
  handleCreateSuccess: () => void;
  handleImportStarted: (result: { listId: string; jobId: string }) => void;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDesc: string;
  gridRef: (node: HTMLDivElement | null) => void;
  columns: number;
}
