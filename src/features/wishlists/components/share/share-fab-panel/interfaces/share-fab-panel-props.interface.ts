import type React from 'react';

export interface ShareFabPanelOwnerInfo {
  displayName: string;
  initials: string;
}

export interface ShareFabPanelProps {
  listId: string;
  isOwner: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ownerInfo?: ShareFabPanelOwnerInfo;
}

export type ShareFabPanelTab = 'link' | 'invite' | 'access';

export interface ShareFabPanelTemplateProps {
  activeTab: ShareFabPanelTab;
  setActiveTab: (tab: ShareFabPanelTab) => void;
  onClose: () => void;
  hideTabs?: boolean;
  linkTab: React.ReactNode;
  inviteTab: React.ReactNode;
  accessTab: React.ReactNode;
}
