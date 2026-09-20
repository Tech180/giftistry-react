import type React from 'react';

export interface TemplateProps {
  activeTab: 'friends' | 'link' | 'manage';
  setActiveTab: (tab: 'friends' | 'link' | 'manage') => void;
  isOwner: boolean;
  friendsTab: React.ReactNode;
  linkTab: React.ReactNode;
  manageTab: React.ReactNode;
  manageCount: number;
}
