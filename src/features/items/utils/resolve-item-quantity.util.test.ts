import { describe, expect, it } from 'vitest';
import type { Claim } from '../interfaces/item-claim.interface';
import type { Item } from '../interfaces/item.interface';
import {
  formatItemQuantityBadge,
  resolveItemQuantitySummary,
} from './resolve-item-quantity.util';

const baseItem: Item = {
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Socks',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
};

function claim(partial: Partial<Claim> & Pick<Claim, 'Id' | 'UserId'>): Claim {
  return {
    ItemId: 'item-1',
    Amount: null,
    ClaimedByName: null,
    ...partial,
  };
}

describe('resolveItemQuantitySummary', () => {
  it('defaults to single quantity with no badge', () => {
    const summary = resolveItemQuantitySummary(baseItem);
    expect(summary).toMatchObject({
      desiredQuantity: 1,
      claimedQuantity: 0,
      isMultiCount: false,
      shouldDisplay: false,
      progressPercent: 0,
    });
  });

  it('uses item.DesiredQuantity and shows badge when greater than 1', () => {
    const summary = resolveItemQuantitySummary({
      ...baseItem,
      DesiredQuantity: 5,
    });
    expect(summary.desiredQuantity).toBe(5);
    expect(summary.shouldDisplay).toBe(true);
    expect(summary.isMultiCount).toBe(true);
  });

  it('prefers server TotalClaimedQuantity and DesiredQuantity over claims/metadata', () => {
    const summary = resolveItemQuantitySummary(
      {
        ...baseItem,
        DesiredQuantity: 4,
        TotalClaimedQuantity: 2,
        IsMultiCount: true,
        Claims: [claim({ Id: 'c1', UserId: 'u1', Quantity: 99 })],
      },
      { DesiredQuantity: 99, MultiCount: true }
    );
    expect(summary.desiredQuantity).toBe(4);
    expect(summary.claimedQuantity).toBe(2);
    expect(summary.progressPercent).toBe(50);
  });

  it('falls back to metadata DesiredQuantity and claim row sums', () => {
    const summary = resolveItemQuantitySummary(
      {
        ...baseItem,
        Claims: [
          claim({ Id: 'c1', UserId: 'u1', Quantity: 1 }),
          claim({ Id: 'c2', UserId: 'u2', Quantity: 2 }),
        ],
      },
      { DesiredQuantity: 3, MultiCount: true }
    );
    expect(summary.desiredQuantity).toBe(3);
    expect(summary.claimedQuantity).toBe(3);
    expect(summary.shouldDisplay).toBe(true);
    expect(summary.progressPercent).toBe(100);
  });
});

describe('formatItemQuantityBadge', () => {
  it('formats ×N when nothing claimed', () => {
    expect(
      formatItemQuantityBadge({
        isMultiCount: true,
        desiredQuantity: 3,
        claimedQuantity: 0,
        shouldDisplay: true,
        progressPercent: 0,
      })
    ).toBe('×3');
  });

  it('formats claimed/desired when claims exist', () => {
    expect(
      formatItemQuantityBadge({
        isMultiCount: true,
        desiredQuantity: 5,
        claimedQuantity: 2,
        shouldDisplay: true,
        progressPercent: 40,
      })
    ).toBe('2/5');
  });
});
