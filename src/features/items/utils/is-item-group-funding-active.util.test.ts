import { describe, expect, test } from 'vitest';
import {
  isItemGroupFundingActive,
  isItemGroupFundingActiveOnItem,
  isItemGroupFundingActiveOnItemTree,
  isItemGroupFundingFullyFunded,
  isItemGroupFundingInProgress,
  resolveActiveItemFullyClaimed,
  resolveItemFundingSnapshot,
} from './is-item-group-funding-active.util';
import type { Item } from '../interfaces/item.interface';

describe('isItemGroupFundingActive', () => {
  test('requires list flag, target, and claimed amount', () => {
    expect(
      isItemGroupFundingActive({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
      })
    ).toBe(false);
    expect(
      isItemGroupFundingActive({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 25,
      })
    ).toBe(true);
  });
});

describe('isItemGroupFundingInProgress', () => {
  test('true when active and not fully claimed', () => {
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 25,
        isFullyClaimed: false,
      })
    ).toBe(true);
  });

  test('false when fully funded by flag', () => {
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 100,
        isFullyClaimed: true,
      })
    ).toBe(false);
  });

  test('false when fully funded by amounts even if flag is false', () => {
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 100,
        isFullyClaimed: false,
      })
    ).toBe(false);
  });

  test('false when list GF off, zero target, or zero contributions', () => {
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: false,
        fundingTarget: 100,
        totalClaimedAmount: 25,
        isFullyClaimed: false,
      })
    ).toBe(false);
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: true,
        fundingTarget: 0,
        totalClaimedAmount: 25,
        isFullyClaimed: false,
      })
    ).toBe(false);
    expect(
      isItemGroupFundingInProgress({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 0,
        isFullyClaimed: false,
      })
    ).toBe(false);
  });
});

describe('isItemGroupFundingFullyFunded', () => {
  test('true when amounts meet target regardless of flag', () => {
    expect(
      isItemGroupFundingFullyFunded({
        allowGroupFunds: true,
        fundingTarget: 100,
        totalClaimedAmount: 100,
        isFullyClaimed: false,
      })
    ).toBe(true);
  });

  test('true when float drift makes total slightly below target in raw numbers', () => {
    expect(
      isItemGroupFundingFullyFunded({
        allowGroupFunds: true,
        fundingTarget: 49.99,
        totalClaimedAmount: 30 + 19.99,
        isFullyClaimed: false,
      })
    ).toBe(true);
  });
});

describe('resolveActiveItemFullyClaimed', () => {
  test('treats GF amount target as fully claimed when API flag is false', () => {
    expect(
      resolveActiveItemFullyClaimed({
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

  test('respects explicit false for non-GF items', () => {
    expect(
      resolveActiveItemFullyClaimed({
        isFullyClaimed: false,
        isClaimed: true,
        allowGroupFunds: false,
        fundingTarget: 0,
        totalClaimedAmount: 0,
        isMultiCount: false,
        claimedQuantity: 0,
        desiredQuantity: 1,
      })
    ).toBe(false);
  });
});

describe('resolveItemFundingSnapshot', () => {
  test('prefers explicit aggregates over link and claim derivation', () => {
    expect(
      resolveItemFundingSnapshot({
        FundingTarget: 80,
        TotalClaimedAmount: 20,
        Links: [
          {
            Id: 'l1',
            ItemId: 'i1',
            Url: 'https://example.com',
            RetailerName: null,
            ExtractedPrice: 50,
            ExtractedImageUrl: null,
          },
        ],
        Claims: [
          {
            Id: 'c1',
            ItemId: 'i1',
            UserId: 'u1',
            Amount: 5,
            ClaimedByName: 'A',
          },
        ],
      })
    ).toEqual({ fundingTarget: 80, totalClaimedAmount: 20 });
  });

  test('derives from links and claims when aggregates are absent', () => {
    expect(
      resolveItemFundingSnapshot({
        Links: [
          {
            Id: 'l1',
            ItemId: 'i1',
            Url: 'https://example.com',
            RetailerName: null,
            ExtractedPrice: 40,
            ExtractedImageUrl: null,
          },
        ],
        Claims: [
          {
            Id: 'c1',
            ItemId: 'i1',
            UserId: 'u1',
            Amount: 12,
            ClaimedByName: 'A',
          },
        ],
      })
    ).toEqual({ fundingTarget: 40, totalClaimedAmount: 12 });
  });
});

describe('isItemGroupFundingActiveOnItem', () => {
  test('detects active funding from claims', () => {
    const item = {
      FundingTarget: 50,
      Links: [],
      Claims: [
        {
          Id: 'c1',
          ItemId: 'i1',
          UserId: 'u1',
          Amount: 10,
          ClaimedByName: 'A',
        },
      ],
    } as Item;

    expect(isItemGroupFundingActiveOnItem(item, true)).toBe(true);
    expect(isItemGroupFundingActiveOnItem(item, false)).toBe(false);
  });
});

describe('isItemGroupFundingActiveOnItemTree', () => {
  test('true when only a substitution child has active group funding', () => {
    const item = {
      Id: 'parent-1',
      ListId: 'list-1',
      PriorityId: null,
      SuggestedByUserId: null,
      Name: 'Parent',
      Description: null,
      IsHiddenIdea: false,
      Category: 'tech',
      Links: [
        {
          Id: 'l-parent',
          ItemId: 'parent-1',
          Url: 'https://example.com/parent',
          RetailerName: null,
          ExtractedPrice: 100,
          ExtractedImageUrl: null,
        },
      ],
      Claims: [],
      IsClaimed: false,
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
    } as Item;

    expect(isItemGroupFundingActiveOnItem(item, true)).toBe(false);
    expect(isItemGroupFundingActiveOnItemTree(item, true)).toBe(true);
    expect(isItemGroupFundingActiveOnItemTree(item, false)).toBe(false);
  });
});
