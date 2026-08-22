import { describe, expect, it } from 'vitest';
import type { Claim } from '../interfaces/item-claim.interface';
import type { Item } from '../interfaces/item.interface';
import {
  buildInitialClaimDraft,
  clampClaimQuantity,
  isClaimQuantityLineVisible,
  itemNeedsClaimQuantityUi,
  resolveClaimQuantityLines,
  unclaimedUnitsOnClaimQuantityLine,
} from './resolve-claim-quantity-lines.util';

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

describe('itemNeedsClaimQuantityUi', () => {
  it('is false for a single-quantity item', () => {
    expect(itemNeedsClaimQuantityUi(baseItem)).toBe(false);
  });

  it('is true when desired quantity is greater than 1', () => {
    expect(itemNeedsClaimQuantityUi({ ...baseItem, DesiredQuantity: 4 })).toBe(true);
  });

  it('is true when IsMultiCount is set even without metadata.MultiCount', () => {
    expect(
      itemNeedsClaimQuantityUi({ ...baseItem, IsMultiCount: true, DesiredQuantity: 3 })
    ).toBe(true);
  });

  it('is true when variations exist', () => {
    expect(
      itemNeedsClaimQuantityUi(baseItem, {
        Variations: [{ Name: 'Red', Quantity: 2 }],
      })
    ).toBe(true);
  });
});

describe('resolveClaimQuantityLines', () => {
  it('builds a single quantity line from desired quantity', () => {
    const lines = resolveClaimQuantityLines(
      { ...baseItem, DesiredQuantity: 5, IsMultiCount: true },
      null,
      'u1'
    );
    expect(lines).toEqual([
      {
        selection: null,
        name: 'Quantity',
        claimedByUser: 0,
        claimedByOthers: 0,
        capacity: 5,
        maxForUser: 5,
      },
    ]);
  });

  it('defaults missing claim Quantity to 1 and splits self vs others', () => {
    const lines = resolveClaimQuantityLines(
      {
        ...baseItem,
        DesiredQuantity: 5,
        IsMultiCount: true,
        Claims: [
          claim({ Id: 'c1', UserId: 'u1' }),
          claim({ Id: 'c2', UserId: 'u2', Quantity: 2 }),
        ],
      },
      null,
      'u1'
    );
    expect(lines[0]).toMatchObject({
      claimedByUser: 1,
      claimedByOthers: 2,
      maxForUser: 3,
    });
  });

  it('builds per-variation lines and caps to remaining after others', () => {
    const lines = resolveClaimQuantityLines(
      {
        ...baseItem,
        IsMultiCount: true,
        Claims: [
          claim({ Id: 'c1', UserId: 'u1', Selection: 'Red', Quantity: 1 }),
          claim({ Id: 'c2', UserId: 'u2', Selection: 'Red', Quantity: 1 }),
          claim({ Id: 'c3', UserId: 'u2', Selection: 'Blue', Quantity: 2 }),
        ],
      },
      {
        Variations: [
          { Name: 'Red', Quantity: 3 },
          { Name: 'Blue', Quantity: 2 },
        ],
      },
      'u1'
    );
    expect(lines[0]).toMatchObject({
      selection: 'Red',
      claimedByUser: 1,
      claimedByOthers: 1,
      capacity: 3,
      maxForUser: 2,
    });
    expect(lines[1]).toMatchObject({
      selection: 'Blue',
      claimedByUser: 0,
      claimedByOthers: 2,
      maxForUser: 0,
    });
    expect(isClaimQuantityLineVisible(lines[0])).toBe(true);
    expect(isClaimQuantityLineVisible(lines[1])).toBe(false);
  });

  it('keeps a variation visible to the person who claimed the last unit', () => {
    expect(
      isClaimQuantityLineVisible({
        selection: 'Red',
        name: 'Red',
        claimedByUser: 1,
        claimedByOthers: 0,
        capacity: 1,
        maxForUser: 1,
      })
    ).toBe(true);
    expect(
      unclaimedUnitsOnClaimQuantityLine({
        selection: 'Red',
        name: 'Red',
        claimedByUser: 1,
        claimedByOthers: 0,
        capacity: 1,
        maxForUser: 1,
      })
    ).toBe(0);
  });

  it('adds a Generic line for leftover desired quantity not assigned to variations', () => {
    const lines = resolveClaimQuantityLines(
      { ...baseItem, DesiredQuantity: 5, IsMultiCount: true },
      {
        Variations: [
          { Name: 'Red', Quantity: 2 },
          { Name: 'Blue', Quantity: 1 },
        ],
      },
      'u1'
    );
    expect(lines).toHaveLength(3);
    expect(lines[2]).toMatchObject({
      selection: null,
      name: 'Generic',
      claimedByUser: 0,
      claimedByOthers: 0,
      capacity: 2,
      maxForUser: 2,
    });
  });

  it('counts unspecified claims toward Generic leftover', () => {
    const lines = resolveClaimQuantityLines(
      {
        ...baseItem,
        DesiredQuantity: 5,
        IsMultiCount: true,
        Claims: [
          claim({ Id: 'c1', UserId: 'u1', Quantity: 1 }),
          claim({ Id: 'c2', UserId: 'u2', Selection: 'Red', Quantity: 1 }),
        ],
      },
      {
        Variations: [{ Name: 'Red', Quantity: 2 }],
      },
      'u1'
    );
    expect(lines[0]).toMatchObject({
      selection: 'Red',
      claimedByUser: 0,
      claimedByOthers: 1,
      maxForUser: 1,
    });
    expect(lines[1]).toMatchObject({
      selection: null,
      name: 'Generic',
      claimedByUser: 1,
      claimedByOthers: 0,
      capacity: 3,
      maxForUser: 3,
    });
  });
});

describe('buildInitialClaimDraft', () => {
  it('prefills the user current quantities when they already claimed', () => {
    expect(
      buildInitialClaimDraft([
        {
          selection: 'Red',
          name: 'Red',
          claimedByUser: 2,
          claimedByOthers: 0,
          capacity: 3,
          maxForUser: 3,
        },
        {
          selection: 'Blue',
          name: 'Blue',
          claimedByUser: 0,
          claimedByOthers: 1,
          capacity: 2,
          maxForUser: 1,
        },
      ])
    ).toEqual([
      { selection: 'Red', quantity: 2 },
      { selection: 'Blue', quantity: 0 },
    ]);
  });

  it('prefills 1 on the first available line for a new claim', () => {
    expect(
      buildInitialClaimDraft([
        {
          selection: 'Red',
          name: 'Red',
          claimedByUser: 0,
          claimedByOthers: 2,
          capacity: 2,
          maxForUser: 0,
        },
        {
          selection: 'Blue',
          name: 'Blue',
          claimedByUser: 0,
          claimedByOthers: 0,
          capacity: 2,
          maxForUser: 2,
        },
      ])
    ).toEqual([
      { selection: 'Red', quantity: 0 },
      { selection: 'Blue', quantity: 1 },
    ]);
  });
});

describe('clampClaimQuantity', () => {
  it('clamps to the inclusive 0..max range', () => {
    expect(clampClaimQuantity('2', 5)).toBe(2);
    expect(clampClaimQuantity('-1', 5)).toBe(0);
    expect(clampClaimQuantity('9', 5)).toBe(5);
    expect(clampClaimQuantity('', 5)).toBe(0);
    expect(clampClaimQuantity(2, 5)).toBe(2);
    expect(clampClaimQuantity(9, 5)).toBe(5);
  });
});
