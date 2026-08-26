import { describe, expect, it } from 'vitest';
import type { Claim } from '../interfaces/item-claim.interface';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveClaimerSubstitutionAction } from './resolve-claimer-substitution-action.util';

const claim = (itemId: string, userId: string): Claim => ({
  Id: `claim-${itemId}-${userId}`,
  ItemId: itemId,
  UserId: userId,
  Amount: null,
  ClaimedByName: null,
});

const baseItem = (overrides: Partial<Item> = {}): Item => ({
  Id: 'parent-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Gift',
  Description: null,
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
  AllowSubstitutions: true,
  ...overrides,
});

const customOption = (createdByUserId = 'claimer-1'): ItemSubstitutionOption => ({
  Id: 'sub-row-1',
  Kind: 'claimer_custom',
  SortOrder: 0,
  CreatedByUserId: createdByUserId,
  Item: {
    Id: 'child-1',
    Name: 'Alt',
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
});

describe('resolveClaimerSubstitutionAction', () => {
  it('is visible for an unclaimed non-owner viewer', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem(),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result).toEqual({
      visible: true,
      allowSubstitutions: true,
      mode: 'create',
      ownOption: null,
    });
  });

  it('is visible for a non-owner who claimed the parent', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        Claims: [claim('parent-1', 'claimer-1')],
      }),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result).toEqual({
      visible: true,
      allowSubstitutions: true,
      mode: 'create',
      ownOption: null,
    });
  });

  it('hides for owners', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        Claims: [claim('parent-1', 'owner-1')],
      }),
      userId: 'owner-1',
      isOwner: true,
      isPublicGuest: false,
    });
    expect(result.visible).toBe(false);
  });

  it('hides for public guests', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem(),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: true,
    });
    expect(result.visible).toBe(false);
  });

  it('hides when another claimer already added a custom substitution', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        SubstitutionOptions: [customOption('other-claimer')],
      }),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result.visible).toBe(false);
  });

  it('switches to manage when the viewer created the custom substitution', () => {
    const own = customOption('claimer-1');
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        SubstitutionOptions: [own],
      }),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result).toEqual({
      visible: true,
      allowSubstitutions: true,
      mode: 'manage',
      ownOption: own,
    });
  });

  it('hides for suggestion items', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        IsSuggestion: true,
      }),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result.visible).toBe(false);
  });

  it('reports allowSubstitutions false when the owner disabled them', () => {
    const result = resolveClaimerSubstitutionAction({
      item: baseItem({
        AllowSubstitutions: false,
      }),
      userId: 'claimer-1',
      isOwner: false,
      isPublicGuest: false,
    });
    expect(result).toEqual({
      visible: true,
      allowSubstitutions: false,
      mode: 'create',
      ownOption: null,
    });
  });
});
