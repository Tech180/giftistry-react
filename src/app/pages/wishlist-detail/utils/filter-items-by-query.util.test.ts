import { describe, expect, it } from 'vitest';
import type { Item } from 'features/items';
import { filterItemsByQuery } from './filter-items-by-query.util';

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

describe('filterItemsByQuery', () => {
  it('matches all items when query is empty or whitespace', () => {
    const item = makeItem({ Id: '1', Name: 'Camera' });
    expect(filterItemsByQuery(item, '')).toBe(true);
    expect(filterItemsByQuery(item, '   ')).toBe(true);
  });

  it('matches name case-insensitively', () => {
    const item = makeItem({ Id: '1', Name: 'Vintage Camera' });
    expect(filterItemsByQuery(item, 'camera')).toBe(true);
    expect(filterItemsByQuery(item, 'LENS')).toBe(false);
  });

  it('matches description when present', () => {
    const item = makeItem({ Id: '1', Name: 'Tripod', Description: 'Carbon fiber legs' });
    expect(filterItemsByQuery(item, 'carbon')).toBe(true);
    expect(filterItemsByQuery(item, 'missing')).toBe(false);
  });
});
