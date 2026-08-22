import { describe, expect, it } from 'vitest';
import type { ClaimQuantityLine } from '../interfaces/claim-quantity-line.interface';
import { buildClaimMutations } from './build-claim-mutations.util';

const qtyLine = (overrides: Partial<ClaimQuantityLine> = {}): ClaimQuantityLine => ({
  selection: null,
  name: 'Quantity',
  claimedByUser: 0,
  claimedByOthers: 0,
  capacity: 5,
  maxForUser: 5,
  ...overrides,
});

describe('buildClaimMutations', () => {
  it('returns noop when the draft matches current claims', () => {
    const plan = buildClaimMutations({
      itemId: 'item-1',
      lines: [qtyLine({ claimedByUser: 2, maxForUser: 5 })],
      draft: [{ selection: null, quantity: 2 }],
      claimedByName: 'Ada',
      anonymous: false,
    });
    expect(plan).toEqual({ type: 'noop' });
  });

  it('returns noop when a new claim is all zeros', () => {
    const plan = buildClaimMutations({
      itemId: 'item-1',
      lines: [qtyLine()],
      draft: [{ selection: null, quantity: 0 }],
      claimedByName: null,
      anonymous: true,
    });
    expect(plan).toEqual({ type: 'noop' });
  });

  it('returns unclaim-all when an existing claim is reduced to zero', () => {
    const plan = buildClaimMutations({
      itemId: 'item-1',
      lines: [qtyLine({ claimedByUser: 2 })],
      draft: [{ selection: null, quantity: 0 }],
      claimedByName: 'Ada',
      anonymous: false,
    });
    expect(plan).toEqual({ type: 'unclaim-all' });
  });

  it('creates POSTs for a first-time claim and skips zero lines', () => {
    const plan = buildClaimMutations({
      itemId: 'item-1',
      lines: [
        qtyLine({ selection: 'Red', name: 'Red', maxForUser: 3 }),
        qtyLine({ selection: 'Blue', name: 'Blue', maxForUser: 2 }),
      ],
      draft: [
        { selection: 'Red', quantity: 2 },
        { selection: 'Blue', quantity: 0 },
      ],
      claimedByName: 'Ada',
      anonymous: false,
    });
    expect(plan).toEqual({
      type: 'create',
      requests: [
        {
          itemId: 'item-1',
          claimedByName: 'Ada',
          anonymous: false,
          quantity: 2,
          selection: 'Red',
        },
      ],
    });
  });

  it('replaces when the user already has claims and the draft changed', () => {
    const plan = buildClaimMutations({
      itemId: 'item-1',
      lines: [qtyLine({ claimedByUser: 1, maxForUser: 5 })],
      draft: [{ selection: null, quantity: 3 }],
      claimedByName: null,
      anonymous: true,
      includeLinked: true,
    });
    expect(plan).toEqual({
      type: 'replace',
      requests: [
        {
          itemId: 'item-1',
          claimedByName: null,
          anonymous: true,
          quantity: 3,
          selection: null,
          includeLinked: true,
        },
      ],
    });
  });
});
