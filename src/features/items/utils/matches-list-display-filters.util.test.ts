import { describe, expect, test } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import type { ListFilterContext } from '../interfaces/list-filter-context.interface';
import { createDefaultListDisplayFilters } from './create-default-list-display-filters.util';
import { matchesListDisplayFilters } from './matches-list-display-filters.util';

function makeItem(overrides: Partial<Item> & Pick<Item, 'Id' | 'Name'>): Item {
  return {
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'electronics',
    CategoryKey: 'electronics',
    Links: [],
    Claims: [],
    IsClaimed: false,
    DesiredQuantity: 1,
    IsMultiCount: false,
    Metadata: null,
    IsSuggestion: false,
    FundingTarget: 100,
    ...overrides,
  };
}

const baseContext: ListFilterContext = {
  allowGroupFunds: true,
  revealSuggestions: true,
  currentUserId: 'user-me',
  listOwnerUserId: 'owner-1',
  isOwner: true,
  canCollaborate: true,
  isPublicGuest: false,
};

describe('matchesListDisplayFilters', () => {
  test('filters availability and funding', () => {
    const available = makeItem({ Id: '1', Name: 'Open', IsClaimed: false });
    const claimed = makeItem({ Id: '2', Name: 'Taken', IsClaimed: true, IsFullyClaimed: true });

    expect(
      matchesListDisplayFilters(
        available,
        { ...createDefaultListDisplayFilters(), availability: 'available' },
        baseContext
      )
    ).toBe(true);
    expect(
      matchesListDisplayFilters(
        claimed,
        { ...createDefaultListDisplayFilters(), availability: 'available' },
        baseContext
      )
    ).toBe(false);

    const gfItem = makeItem({
      Id: '3',
      Name: 'GF',
      FundingTarget: 200,
      TotalClaimedAmount: 50,
      Claims: [{
        Id: 'c1',
        ItemId: '3',
        UserId: 'u',
        Amount: 50,
        Quantity: 1,
        ClaimedByName: null,
      }],
    });

    expect(
      matchesListDisplayFilters(
        gfItem,
        { ...createDefaultListDisplayFilters(), funding: 'in_progress' },
        baseContext
      )
    ).toBe(true);
  });
});
