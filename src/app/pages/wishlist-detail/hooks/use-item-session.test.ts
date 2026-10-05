import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import type { Item } from 'features/items';
import { useItemSession } from './use-item-session';

vi.mock('features/auth', () => ({
  useAuth: () => ({ user: { Id: 'user-1' } }),
}));

vi.mock('features/tour', () => ({
  useTourOptional: () => null,
}));

vi.mock('shared/providers/toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const baseItem = {
  Id: 'item-1',
  Name: 'Gift',
  SubstitutionOptions: [
    {
      Id: 'sub-1',
      Kind: 'claimer_custom' as const,
      SortOrder: 0,
      CreatedByUserId: 'guest-a',
      Item: {
        Id: 'sub-item-1',
        Name: 'Alt',
        Description: null,
        Links: [],
        Photos: [],
        Claims: [],
        IsClaimed: false,
      },
    },
  ],
} as Item;

const sessionOptions = () => ({
  items: [baseItem],
  wishlist: { Id: 'list-1', UserId: 'owner-1' } as never,
  canCollaborate: true,
  canSuggest: false,
  canShowAi: false,
  loadData: vi.fn(),
  softReloadItems: vi.fn(),
  refreshJob: vi.fn(),
  associationsRef: { current: { primeForItem: vi.fn() } },
});

describe('useItemSession openItemViewer', () => {
  test('stores substitution option id for viewer context', () => {
    const { result } = renderHook(() => useItemSession(sessionOptions()));

    act(() => {
      result.current.openItemViewer(baseItem, { substitutionOptionId: 'sub-1' });
    });

    expect(result.current.viewingItem?.Id).toBe('item-1');
    expect(result.current.viewingSubstitutionOptionId).toBe('sub-1');
  });

  test('clears substitution option id when opening editor', () => {
    const { result } = renderHook(() => useItemSession(sessionOptions()));

    act(() => {
      result.current.openItemViewer(baseItem, { substitutionOptionId: 'sub-1' });
      result.current.openItemEditor(baseItem);
    });

    expect(result.current.viewingItem).toBeNull();
    expect(result.current.viewingSubstitutionOptionId).toBeNull();
  });
});
