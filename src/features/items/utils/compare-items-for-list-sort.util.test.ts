import { describe, expect, test } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import { sortItemsForListSort } from './sort-items-for-list-sort.util';

function makeItem(overrides: Partial<Item> & Pick<Item, 'Id' | 'Name'>): Item {
  return {
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'home',
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

describe('sortItemsForListSort', () => {
  test('sorts by name ascending', () => {
    const sorted = sortItemsForListSort(
      [makeItem({ Id: 'b', Name: 'Beta' }), makeItem({ Id: 'a', Name: 'Alpha' })],
      'name-asc',
      false
    );
    expect(sorted.map((item) => item.Name)).toEqual(['Alpha', 'Beta']);
  });

  test('puts available first', () => {
    const sorted = sortItemsForListSort(
      [
        makeItem({ Id: '1', Name: 'Claimed', IsClaimed: true, IsFullyClaimed: true }),
        makeItem({ Id: '2', Name: 'Open' }),
      ],
      'available-first',
      false
    );
    expect(sorted[0].Name).toBe('Open');
  });
});
