import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import { resolveCompactCategoryColumnPresence } from './resolve-compact-category-column-presence.util';

function baseItem(overrides: Partial<Item> = {}): Item {
  return {
    Id: 'item-1',
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Name: 'Gift',
    Description: null,
    IsHiddenIdea: false,
    Category: 'electronics',
    Links: [],
    Claims: [],
    IsClaimed: false,
    ...overrides,
  };
}

describe('resolveCompactCategoryColumnPresence', () => {
  const defaultOptions = {
    allowGroupFunds: false,
    isTaggingModeActive: false,
    isOwner: true,
    currentUserId: 'user-1',
  };

  it('always reserves leading and price columns', () => {
    const presence = resolveCompactCategoryColumnPresence([baseItem()], defaultOptions);
    expect(presence.leading).toBe(true);
    expect(presence.price).toBe(true);
  });

  it('reserves select only when tagging mode is active', () => {
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], defaultOptions).select
    ).toBe(false);
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], {
        ...defaultOptions,
        isTaggingModeActive: true,
      }).select
    ).toBe(true);
  });

  it('reserves relations when any item is linked or related', () => {
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], defaultOptions).relations
    ).toBe(false);

    expect(
      resolveCompactCategoryColumnPresence(
        [baseItem({ Metadata: { LinkedItemIds: ['item-2'] } })],
        defaultOptions
      ).relations
    ).toBe(true);

    expect(
      resolveCompactCategoryColumnPresence(
        [baseItem({ Metadata: { RelatedItemIds: ['item-3'] } })],
        defaultOptions
      ).relations
    ).toBe(true);
  });

  it('reserves audience when any item has suggestion, claim, or sharing badges', () => {
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], defaultOptions).audience
    ).toBe(false);

    expect(
      resolveCompactCategoryColumnPresence(
        [baseItem({ IsSuggestion: true, SuggestedByUserId: 'u2' })],
        defaultOptions
      ).audience
    ).toBe(true);

    expect(
      resolveCompactCategoryColumnPresence(
        [
          baseItem({
            Claims: [
              {
                Id: 'c1',
                ItemId: 'item-1',
                UserId: 'other',
                Amount: null,
                ClaimedByName: 'Alex',
              },
            ],
          }),
        ],
        defaultOptions
      ).audience
    ).toBe(true);
  });

  it('reserves quantity when any multi-count item should display a badge', () => {
    expect(
      resolveCompactCategoryColumnPresence(
        [baseItem({ DesiredQuantity: 3, IsMultiCount: true })],
        defaultOptions
      ).quantity
    ).toBe(true);
  });

  it('reserves funding when group funds are on and an item has active contributions', () => {
    expect(
      resolveCompactCategoryColumnPresence(
        [
          baseItem({
            Links: [
              {
                Id: 'l1',
                ItemId: 'item-1',
                Url: 'https://example.com',
                RetailerName: null,
                ExtractedPrice: 20,
                ExtractedImageUrl: null,
              },
            ],
          }),
        ],
        { ...defaultOptions, allowGroupFunds: true }
      ).funding
    ).toBe(false);

    expect(
      resolveCompactCategoryColumnPresence(
        [
          baseItem({
            Links: [
              {
                Id: 'l1',
                ItemId: 'item-1',
                Url: 'https://example.com',
                RetailerName: null,
                ExtractedPrice: 20,
                ExtractedImageUrl: null,
              },
            ],
            Claims: [
              {
                Id: 'c1',
                ItemId: 'item-1',
                UserId: 'u2',
                Amount: 5,
                ClaimedByName: 'Pat',
              },
            ],
            TotalClaimedAmount: 5,
          }),
        ],
        { ...defaultOptions, allowGroupFunds: true }
      ).funding
    ).toBe(true);
  });

  it('reserves funding when only a substitution child has active contributions', () => {
    expect(
      resolveCompactCategoryColumnPresence(
        [
          baseItem({
            Links: [
              {
                Id: 'l1',
                ItemId: 'item-1',
                Url: 'https://example.com',
                RetailerName: null,
                ExtractedPrice: 100,
                ExtractedImageUrl: null,
              },
            ],
            FundingTarget: 100,
            TotalClaimedAmount: 0,
            SubstitutionOptions: [
              {
                Id: 'sub-1',
                Kind: 'owner_approved',
                SortOrder: 0,
                CreatedByUserId: 'u1',
                Item: {
                  Id: 'child-1',
                  Name: 'Alt',
                  Description: null,
                  Links: [
                    {
                      Id: 'l-child',
                      ItemId: 'child-1',
                      Url: 'https://example.com/alt',
                      RetailerName: null,
                      ExtractedPrice: 30,
                      ExtractedImageUrl: null,
                    },
                  ],
                  Photos: [],
                  Claims: [
                    {
                      Id: 'c-child',
                      ItemId: 'child-1',
                      UserId: 'u2',
                      Amount: 10,
                      ClaimedByName: 'Pat',
                    },
                  ],
                  IsClaimed: true,
                  FundingTarget: 30,
                  TotalClaimedAmount: 10,
                },
              },
            ],
          }),
        ],
        { ...defaultOptions, allowGroupFunds: true }
      ).funding
    ).toBe(true);
  });

  it('reserves trailing when items have links or trailing actions are allowed', () => {
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], defaultOptions).trailing
    ).toBe(false);
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], {
        ...defaultOptions,
        canShowTrailingActions: true,
      }).trailing
    ).toBe(true);
  });

  it('marks claimActions for guests with trailing actions', () => {
    expect(
      resolveCompactCategoryColumnPresence([baseItem()], {
        ...defaultOptions,
        isOwner: true,
        canShowTrailingActions: true,
      }).claimActions
    ).toBe(false);

    expect(
      resolveCompactCategoryColumnPresence([baseItem()], {
        ...defaultOptions,
        isOwner: false,
        canShowTrailingActions: true,
      }).claimActions
    ).toBe(true);
  });

  it('marks wideClaimActions when a guest can adjust a multi-count claim', () => {
    expect(
      resolveCompactCategoryColumnPresence(
        [baseItem({ DesiredQuantity: 3, IsMultiCount: true })],
        {
          ...defaultOptions,
          isOwner: false,
          canShowTrailingActions: true,
        }
      ).wideClaimActions
    ).toBe(false);

    expect(
      resolveCompactCategoryColumnPresence(
        [
          baseItem({
            DesiredQuantity: 3,
            IsMultiCount: true,
            Claims: [
              {
                Id: 'c1',
                ItemId: 'item-1',
                UserId: 'user-1',
                Amount: null,
                ClaimedByName: 'Me',
              },
            ],
          }),
        ],
        {
          ...defaultOptions,
          isOwner: false,
          canShowTrailingActions: true,
        }
      ).wideClaimActions
    ).toBe(true);
  });
});
