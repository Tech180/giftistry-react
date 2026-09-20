export interface GetPageShellFlagsInput {
  canSuggest: boolean;
  canShowAi?: boolean;
  aiEnabled?: boolean;
  isExpired: boolean;
  isArchived: boolean;
  isAddOpen: boolean;
  hasEditingItem: boolean;
  hasViewingItem: boolean;
  isLinkingModeActive: boolean;
  isRelatingModeActive: boolean;
  isTaggingModeActive: boolean;
  isReplyTaggingModeActive: boolean;
  doesAddSidebarOverlayList: boolean;
  isCommentsOpen: boolean;
  selectedItemId: string | null;
}
