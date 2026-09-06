import { describe, expect, test } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import {
  resolveBrowseSectionFullyClaimed,
  resolveDisplayItemFullyClaimed,
  resolveItemSectionFullyClaimed,
} from './resolve-item-section-fully-claimed.util';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';

describe('resolveItemSectionFullyClaimed', () => {
  test('treats GF amount target as fully claimed when IsFullyClaimed is false', () => {
    expect(
      resolveItemSectionFullyClaimed({
        isFullyClaimed: false,
        isClaimed: true,
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 100,
        isMultiCount: false,
        claimedQuantity: 0,
        desiredQuantity: 1,
      })
    ).toBe(true);
  });

  test('does not treat partial GF as fully claimed', () => {
    expect(
      resolveItemSectionFullyClaimed({
        isFullyClaimed: false,
        isClaimed: true,
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 25,
        isMultiCount: false,
        claimedQuantity: 0,
        desiredQuantity: 1,
      })
    ).toBe(false);
  });

  test('respects multi-count partial quantity', () => {
    expect(
      resolveItemSectionFullyClaimed({
        isFullyClaimed: false,
        isClaimed: true,
        allowGroupFunds: false,
        fundingTarget: 0,
        totalClaimedAmount: 0,
        isMultiCount: true,
        claimedQuantity: 1,
        desiredQuantity: 3,
      })
    ).toBe(false);
  });

  test('respects multi-count when quantity target is met', () => {
    expect(
      resolveItemSectionFullyClaimed({
        isFullyClaimed: undefined,
        isClaimed: true,
        allowGroupFunds: false,
        fundingTarget: 0,
        totalClaimedAmount: 0,
        isMultiCount: true,
        claimedQuantity: 3,
        desiredQuantity: 3,
      })
    ).toBe(true);
  });
});

describe('resolveDisplayItemFullyClaimed', () => {
  test('uses funding aggregates on display item', () => {
    const item = {
      Id: 'item-1',
      ListId: 'list-1',
      PriorityId: null,
      SuggestedByUserId: null,
      Name: 'Gift',
      Description: null,
      IsHiddenIdea: false,
      Category: 'tech',
      Links: [],
      Claims: [{ Id: 'c1', ItemId: 'item-1', UserId: 'u1', Amount: 50, ClaimedByName: 'A' }],
      IsClaimed: true,
      IsFullyClaimed: false,
      FundingTarget: 100,
      TotalClaimedAmount: 100,
    } as Item;

    expect(resolveDisplayItemFullyClaimed(item, true)).toBe(true);
    expect(resolveDisplayItemFullyClaimed(item, false)).toBe(false);
  });
});

describe('resolveBrowseSectionFullyClaimed', () => {
  const parent = (): Item => ({
    Id: 'parent-1',
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Name: 'Original',
    Description: null,
    IsHiddenIdea: false,
    Category: 'tech',
    Links: [],
    Claims: [],
    IsClaimed: false,
    IsFullyClaimed: false,
  });

  test('GF-funded substitution counts as fully claimed even when IsFullyClaimed is false', () => {
    const gfSub: ItemSubstitutionOption = {
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
            Id: 'l1',
            ItemId: 'child-1',
            Url: 'https://example.com',
            RetailerName: null,
            ExtractedPrice: 30,
            ExtractedImageUrl: null,
          },
        ],
        Photos: [],
        Claims: [
          {
            Id: 'c1',
            ItemId: 'child-1',
            UserId: 'u2',
            Amount: 30,
            ClaimedByName: 'Pat',
          },
        ],
        IsClaimed: true,
        IsFullyClaimed: false,
        FundingTarget: 30,
        TotalClaimedAmount: 30,
      },
    };
    const browse = resolveItemSubstitutionOptions(parent(), [gfSub]);

    expect(resolveBrowseSectionFullyClaimed(parent(), browse[1]!, true)).toBe(true);
    expect(resolveBrowseSectionFullyClaimed(parent(), browse[0]!, true)).toBe(false);
  });
});
