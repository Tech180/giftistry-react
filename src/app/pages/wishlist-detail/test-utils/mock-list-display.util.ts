import { vi } from 'vitest';
import {
  createDefaultListDisplayPreferences,
  resolveListFilterCapabilities,
} from 'features/items';
import type { UseListDisplayPreferencesResult } from '../interfaces/use-list-display-preferences-result.interface';

export function createMockListDisplay(
  overrides: Partial<UseListDisplayPreferencesResult> = {}
): UseListDisplayPreferencesResult {
  const appliedPreferences = createDefaultListDisplayPreferences();
  const capabilities = resolveListFilterCapabilities({
    allowGroupFunds: false,
    revealSuggestions: true,
    currentUserId: 'user-1',
    listOwnerUserId: 'owner-1',
    isOwner: true,
    canCollaborate: true,
    isPublicGuest: false,
  });

  return {
    appliedPreferences,
    draftPreferences: null,
    isOpen: false,
    setIsOpen: vi.fn(),
    capabilities,
    categoryOptions: [],
    addedByOptions: [{ id: 'all', label: 'Anyone' }],
    openDrawer: vi.fn(),
    closeDrawer: vi.fn(),
    applyDraft: vi.fn(),
    clearDraft: vi.fn(),
    resetAppliedFilters: vi.fn(),
    revertDraft: vi.fn(),
    updateDraft: vi.fn(),
    activeFilterCount: 0,
    matchingCount: 0,
    hasUnsavedDraft: false,
    ...overrides,
  };
}
