import { describe, expect, it } from 'vitest';
import type { Item } from 'features/items';
import { groupItems } from './group-items.util';

function makeItem(overrides: Partial<Item> & Pick<Item, 'Id' | 'Name'>): Item {
  return {
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'uncategorized',
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

describe('groupItems', () => {
  it('splits enriching uncategorized items into a Processing group', () => {
    const enriching = makeItem({ Id: 'e1', Name: 'Enriching', Category: 'uncategorized' });
    const settled = makeItem({ Id: 's1', Name: 'Settled', Category: 'uncategorized' });
    const groups = groupItems({
      visibleItems: [enriching, settled],
      searchQuery: '',
      itemGroups: null,
      enrichingItemIds: new Set(['e1']),
    });

    expect(groups.map((g) => g.categoryKey)).toEqual(['processing', 'uncategorized']);
    expect(groups[0].items.map((i) => i.Id)).toEqual(['e1']);
    expect(groups[1].items.map((i) => i.Id)).toEqual(['s1']);
  });

  it('filters by search query', () => {
    const camera = makeItem({ Id: '1', Name: 'Camera', Category: 'electronics' });
    const book = makeItem({ Id: '2', Name: 'Book', Category: 'books' });
    const groups = groupItems({
      visibleItems: [camera, book],
      searchQuery: 'cam',
      itemGroups: null,
      enrichingItemIds: new Set(),
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].items.map((i) => i.Id)).toEqual(['1']);
  });

  it('uses server itemGroups when provided', () => {
    const item = makeItem({ Id: '1', Name: 'Lens', Category: 'electronics' });
    const groups = groupItems({
      visibleItems: [item],
      searchQuery: '',
      itemGroups: [
        {
          CategoryKey: 'electronics',
          CategoryLabel: 'Electronics',
          Items: [item],
        },
      ],
      enrichingItemIds: new Set(),
    });

    expect(groups).toEqual([
      {
        categoryKey: 'electronics',
        label: 'Electronics',
        items: [item],
      },
    ]);
  });
});
