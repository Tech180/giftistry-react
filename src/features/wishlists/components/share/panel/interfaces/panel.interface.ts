import React from 'react';

export interface PanelProps {
  listId: string;
  isOwner: boolean;
  onSuccess?: () => void;
}

export interface PanelTemplateProps {
  activeTab: 'friends' | 'link' | 'manage';
  setActiveTab: (tab: 'friends' | 'link' | 'manage') => void;
  isOwner: boolean;
  friendsTab: React.ReactNode;
  linkTab: React.ReactNode;
  manageTab: React.ReactNode;
  manageCount: number;
}
