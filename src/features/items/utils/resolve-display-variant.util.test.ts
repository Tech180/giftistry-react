import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';
import {
  resolveDisplayVariant,
  resolveDisplayVariantIndex,
} from './resolve-display-variant.util';
import { itemSupportsSubstitutions } from './item-supports-substitutions.util';

const parent = (overrides: Partial<Item> = {}): Item => ({
  Id: 'parent-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Original gift',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
  ...overrides,
});

const option = (
  overrides: Partial<ItemSubstitutionOption> & { Id: string; Kind: ItemSubstitutionOption['Kind'] }
): ItemSubstitutionOption => ({
  SortOrder: 0,
  CreatedByUserId: 'user-1',
  Item: {
    Id: `child-${overrides.Id}`,
    Name: `Sub ${overrides.Id}`,
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
  ...overrides,
});

describe('itemSupportsSubstitutions', () => {
  it('allows owner items', () => {
    expect(itemSupportsSubstitutions(parent({ IsSuggestion: false }))).toBe(true);
  });

  it('blocks suggestions', () => {
    expect(itemSupportsSubstitutions(parent({ IsSuggestion: true }))).toBe(false);
  });
});

describe('resolveItemSubstitutionOptions', () => {
  it('orders original, then owner-approved, then custom', () => {
    const options = [
      option({ Id: 'c1', Kind: 'claimer_custom', SortOrder: 0 }),
      option({ Id: 'o2', Kind: 'owner_approved', SortOrder: 2 }),
      option({ Id: 'o1', Kind: 'owner_approved', SortOrder: 1 }),
    ];
    const browse = resolveItemSubstitutionOptions(parent(), options);
    expect(browse.map((b) => b.key)).toEqual([
      'original:parent-1',
      'sub:o1',
      'sub:o2',
      'sub:c1',
    ]);
  });

  it('omits owner-approved when AllowSubstitutions is false but keeps claimer-custom', () => {
    const options = [
      option({ Id: 'c1', Kind: 'claimer_custom', SortOrder: 0 }),
      option({ Id: 'o1', Kind: 'owner_approved', SortOrder: 0 }),
    ];
    const browse = resolveItemSubstitutionOptions(
      parent({ AllowSubstitutions: false }),
      options
    );
    expect(browse.map((b) => b.key)).toEqual(['original:parent-1', 'sub:c1']);
  });
});

describe('resolveDisplayVariant', () => {
  it('defaults to original when not claimed', () => {
    const active = resolveDisplayVariant(parent(), [], 'user-1');
    expect(active.itemId).toBe('parent-1');
    expect(active.kind).toBe('original');
  });

  it('selects claimed substitution', () => {
    const options = [
      option({
        Id: 'o1',
        Kind: 'owner_approved',
        Item: {
          Id: 'child-o1',
          Name: 'Alt',
          Description: null,
          Links: [],
          Photos: [],
          Claims: [
            {
              Id: 'cl1',
              ItemId: 'child-o1',
              UserId: 'user-1',
              Amount: null,
              ClaimedByName: null,
              Quantity: 1,
            },
          ],
          IsClaimed: true,
        },
      }),
    ];
    const index = resolveDisplayVariantIndex(parent(), options, 'user-1');
    expect(index).toBe(1);
    expect(resolveDisplayVariant(parent(), options, 'user-1').itemId).toBe('child-o1');
  });

  it('defaults guests to a claimed substitution without a user id', () => {
    const options = [
      option({
        Id: 'o1',
        Kind: 'owner_approved',
        Item: {
          Id: 'child-o1',
          Name: 'Alt',
          Description: null,
          Links: [],
          Photos: [],
          Claims: [
            {
              Id: 'cl1',
              ItemId: 'child-o1',
              UserId: 'claimer-1',
              Amount: null,
              ClaimedByName: null,
              Quantity: 1,
            },
          ],
          IsClaimed: true,
        },
      }),
    ];
    expect(resolveDisplayVariantIndex(parent(), options, null)).toBe(1);
    expect(resolveDisplayVariant(parent(), options, null).itemId).toBe('child-o1');
  });

  it('defaults to main when the main item is claimed', () => {
    const options = [option({ Id: 'o1', Kind: 'owner_approved' })];
    const claimedParent = parent({
      Claims: [
        {
          Id: 'cl-main',
          ItemId: 'parent-1',
          UserId: 'claimer-1',
          Amount: null,
          ClaimedByName: null,
          Quantity: 1,
        },
      ],
      IsClaimed: true,
    });
    expect(resolveDisplayVariantIndex(claimedParent, options, null)).toBe(0);
    expect(resolveDisplayVariant(claimedParent, options, 'viewer-2').itemId).toBe('parent-1');
  });

  it('uses ActiveSubstitutionId when no claims are present', () => {
    const options = [
      option({
        Id: 'o1',
        Kind: 'owner_approved',
        Item: {
          Id: 'child-o1',
          Name: 'Alt',
          Description: null,
          Links: [],
          Photos: [],
          Claims: [],
          IsClaimed: false,
        },
      }),
    ];
    const withActive = parent({ ActiveSubstitutionId: 'child-o1' });
    expect(resolveDisplayVariantIndex(withActive, options, null)).toBe(1);
  });

  it('prefers the current user claim over another section claim', () => {
    const options = [
      option({
        Id: 'o1',
        Kind: 'owner_approved',
        Item: {
          Id: 'child-o1',
          Name: 'Alt A',
          Description: null,
          Links: [],
          Photos: [],
          Claims: [
            {
              Id: 'cl-a',
              ItemId: 'child-o1',
              UserId: 'other-user',
              Amount: null,
              ClaimedByName: null,
              Quantity: 1,
            },
          ],
          IsClaimed: true,
        },
      }),
      option({
        Id: 'o2',
        Kind: 'owner_approved',
        SortOrder: 1,
        Item: {
          Id: 'child-o2',
          Name: 'Alt B',
          Description: null,
          Links: [],
          Photos: [],
          Claims: [
            {
              Id: 'cl-b',
              ItemId: 'child-o2',
              UserId: 'user-1',
              Amount: null,
              ClaimedByName: null,
              Quantity: 1,
            },
          ],
          IsClaimed: true,
        },
      }),
    ];
    expect(resolveDisplayVariantIndex(parent(), options, 'user-1')).toBe(2);
    expect(resolveDisplayVariant(parent(), options, 'user-1').itemId).toBe('child-o2');
  });

  it('respects explicit browse index', () => {
    const options = [option({ Id: 'o1', Kind: 'owner_approved' })];
    expect(resolveDisplayVariantIndex(parent(), options, 'user-1', 0)).toBe(0);
    expect(resolveDisplayVariant(parent(), options, null, 1).itemId).toBe('child-o1');
  });
});
