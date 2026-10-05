import { describe, expect, test } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import { ITEM_LIST_DISPLAY_TIER } from '../constants/item-list-display-tier.constant';
import { resolveItemListDisplayTier } from './resolve-item-list-display-tier.util';
import { sortItemsForListDisplay } from './sort-items-for-list-display.util';

function makeItem(overrides: Partial<Item> & Pick<Item, 'Id' | 'Name'>): Item {
  return {
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'home_kitchen',
    Links: [],
    Claims: [],
    IsClaimed: false,
    DesiredQuantity: 1,
    IsMultiCount: false,
    Metadata: null,
    IsSuggestion: false,
    ...overrides,
  };
}

describe('resolveItemListDisplayTier', () => {
  test('classifies four tiers', () => {
    expect(
      resolveItemListDisplayTier(
        makeItem({
          Id: 'a',
          Name: 'a',
          Priority: 1,
          Metadata: { IsFavorite: true },
        })
      )
    ).toBe(ITEM_LIST_DISPLAY_TIER.favoritedPriority);
    expect(
      resolveItemListDisplayTier(makeItem({ Id: 'b', Name: 'b', Priority: 1 }))
    ).toBe(ITEM_LIST_DISPLAY_TIER.priorityOnly);
    expect(
      resolveItemListDisplayTier(
        makeItem({ Id: 'c', Name: 'c', Metadata: { IsFavorite: true } })
      )
    ).toBe(ITEM_LIST_DISPLAY_TIER.favoritedOnly);
    expect(resolveItemListDisplayTier(makeItem({ Id: 'd', Name: 'd' }))).toBe(
      ITEM_LIST_DISPLAY_TIER.neither
    );
  });

  test('does not treat pinned as favorite for tiering', () => {
    expect(
      resolveItemListDisplayTier(
        makeItem({ Id: 'p', Name: 'p', Metadata: { IsPinned: true } })
      )
    ).toBe(ITEM_LIST_DISPLAY_TIER.neither);
  });
});

describe('sortItemsForListDisplay', () => {
  test('orders four display tiers within same category', () => {
    const sorted = sortItemsForListDisplay([
      makeItem({ Id: '1', Name: 'Zed', Priority: 2 }),
      makeItem({
        Id: '2',
        Name: 'FavPri',
        Priority: 5,
        Metadata: { IsFavorite: true },
      }),
      makeItem({ Id: '3', Name: 'FavOnly', Metadata: { IsFavorite: true } }),
      makeItem({ Id: '4', Name: 'PriOnly', Priority: 1 }),
    ]);

    expect(sorted.map((i) => i.Name)).toEqual(['FavPri', 'PriOnly', 'Zed', 'FavOnly']);
  });

  test('priority-only sorts above favorite-only within same category', () => {
    const sorted = sortItemsForListDisplay([
      makeItem({ Id: '1', Name: 'FavOnly', Metadata: { IsFavorite: true } }),
      makeItem({ Id: '2', Name: 'PriOnly', Priority: 1 }),
    ]);

    expect(sorted.map((i) => i.Name)).toEqual(['PriOnly', 'FavOnly']);
  });
});
