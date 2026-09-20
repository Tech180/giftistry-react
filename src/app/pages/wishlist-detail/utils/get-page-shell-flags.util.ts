import type { GetPageShellFlagsInput } from '../interfaces/get-page-shell-flags-input.interface';
import type { PageShellFlags } from '../interfaces/page-shell-flags.interface';

export function getPageShellFlags(input: GetPageShellFlagsInput): PageShellFlags {
  const canAutoAdd = Boolean(input.canSuggest && input.canShowAi && input.aiEnabled);
  const isLocked = input.isExpired || input.isArchived;
  const isItemFormSessionActive = input.isAddOpen || input.hasEditingItem || input.hasViewingItem;
  const isAssociationModeActive = input.isLinkingModeActive || input.isRelatingModeActive;
  const isCommentTaggingActive = input.isTaggingModeActive || input.isReplyTaggingModeActive;
  const collapseDrawerWhileLinking = isAssociationModeActive && input.doesAddSidebarOverlayList;
  const collapseDrawerWhileTagging =
    input.isCommentsOpen && isCommentTaggingActive && input.doesAddSidebarOverlayList;
  const isItemDrawerVisible = isItemFormSessionActive && !collapseDrawerWhileLinking;
  const showApplyBar =
    (isItemFormSessionActive && isAssociationModeActive) || collapseDrawerWhileTagging;
  const isInspectorOpen = input.selectedItemId !== null || input.isCommentsOpen;

  return {
    canAutoAdd,
    isLocked,
    isItemFormSessionActive,
    collapseDrawerWhileLinking,
    collapseDrawerWhileTagging,
    isItemDrawerVisible,
    showApplyBar,
    isInspectorOpen,
  };
}
