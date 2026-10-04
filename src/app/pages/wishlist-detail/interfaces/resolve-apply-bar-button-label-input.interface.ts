export interface ResolveApplyBarButtonLabelInput {
  collapseDrawerWhileTagging: boolean;
  isItemFormSessionActive: boolean;
  isLinkingModeActive: boolean;
  isRelatingModeActive: boolean;
  isReplyTaggingModeActive: boolean;
  taggedItemIds: string[];
  replyTaggedItemIds: string[];
}

export type ApplyBarButtonLabel = 'Apply' | 'Cancel';
