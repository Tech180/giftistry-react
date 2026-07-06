import React from 'react';

export interface PanelProps {
  listId: string;
  isOwner: boolean;
  onSuccess?: () => void;
}

export interface PanelTemplateProps {
  activeTab: 'friends' | 'email' | 'link' | 'manage';
  setActiveTab: (tab: 'friends' | 'email' | 'link' | 'manage') => void;
  isOwner: boolean;
  friendsTab: React.ReactNode;
  emailTab: React.ReactNode;
  linkTab: React.ReactNode;
  manageTab: React.ReactNode;
  manageCount: number;
}
