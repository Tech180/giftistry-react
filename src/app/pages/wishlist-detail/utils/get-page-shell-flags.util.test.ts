import { describe, expect, test } from 'vitest';
import { getPageShellFlags } from './get-page-shell-flags.util';

const base = {
  canSuggest: true,
  canShowAi: true,
  aiEnabled: true,
  isExpired: false,
  isArchived: false,
  isAddOpen: false,
  hasEditingItem: false,
  hasViewingItem: false,
  isLinkingModeActive: false,
  isRelatingModeActive: false,
  isTaggingModeActive: false,
  isReplyTaggingModeActive: false,
  doesAddSidebarOverlayList: false,
  isCommentsOpen: false,
  selectedItemId: null as string | null,
};

describe('getPageShellFlags', () => {
  test('locks when expired or archived', () => {
    expect(getPageShellFlags({ ...base, isExpired: true }).isLocked).toBe(true);
    expect(getPageShellFlags({ ...base, isArchived: true }).isLocked).toBe(true);
  });

  test('canAutoAdd requires suggest, AI entitlement, and list AI', () => {
    expect(getPageShellFlags(base).canAutoAdd).toBe(true);
    expect(getPageShellFlags({ ...base, canShowAi: false }).canAutoAdd).toBe(false);
    expect(getPageShellFlags({ ...base, aiEnabled: false }).canAutoAdd).toBe(false);
  });

  test('hides drawer while linking overlays the list', () => {
    const flags = getPageShellFlags({
      ...base,
      isAddOpen: true,
      isLinkingModeActive: true,
      doesAddSidebarOverlayList: true,
    });
    expect(flags.isItemFormSessionActive).toBe(true);
    expect(flags.collapseDrawerWhileLinking).toBe(true);
    expect(flags.isItemDrawerVisible).toBe(false);
    expect(flags.showApplyBar).toBe(true);
  });

  test('shows apply bar while comment tagging collapses the drawer', () => {
    const flags = getPageShellFlags({
      ...base,
      isCommentsOpen: true,
      isTaggingModeActive: true,
      doesAddSidebarOverlayList: true,
    });
    expect(flags.collapseDrawerWhileTagging).toBe(true);
    expect(flags.showApplyBar).toBe(true);
  });

  test('inspector opens for selection or comments', () => {
    expect(getPageShellFlags({ ...base, selectedItemId: 'i1' }).isInspectorOpen).toBe(true);
    expect(getPageShellFlags({ ...base, isCommentsOpen: true }).isInspectorOpen).toBe(true);
  });
});
