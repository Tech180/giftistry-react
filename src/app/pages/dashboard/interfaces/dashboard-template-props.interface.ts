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
  activeTab: 'my-lists' | 'shared' | 'archive';
  setActiveTab: (tab: 'my-lists' | 'shared' | 'archive') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  tabs: DashboardTab[];
  currentLists: Wishlist[];
  isLoading: boolean;
  error: string | null;
  handleCreateSuccess: () => void;
  emptyIcon: React.ReactNode;
  emptyTitle: string;
  emptyDesc: string;
}
