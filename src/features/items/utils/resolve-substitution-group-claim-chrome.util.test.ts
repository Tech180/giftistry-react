import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import { resolveItemSubstitutionOptions } from './resolve-item-substitution-options.util';
import { resolveSubstitutionGroupClaimChrome } from './resolve-substitution-group-claim-chrome.util';

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

const claimedSub = option({
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
        ClaimedByName: 'Claimer',
        Quantity: 1,
      },
    ],
    IsClaimed: true,
    IsFullyClaimed: true,
  },
});

describe('resolveSubstitutionGroupClaimChrome', () => {
  it('grays viewers on the claimed active section', () => {
    const browse = resolveItemSubstitutionOptions(parent(), [claimedSub]);
    const chrome = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [claimedSub],
      active: browse[1]!,
      userId: 'viewer-2',
      isMultiCount: false,
    });
    expect(chrome.claimedByCurrentUser).toBe(false);
    expect(chrome.hasVisibleClaimForGray).toBe(true);
    expect(chrome.isFullyClaimedForChrome).toBe(true);
    expect(chrome.claimsForBadge).toHaveLength(1);
  });

  it('keeps sibling sections gray when browsing away from the claimed focus', () => {
    const browse = resolveItemSubstitutionOptions(parent(), [claimedSub]);
    const chrome = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [claimedSub],
      active: browse[0]!,
      userId: 'viewer-2',
      isMultiCount: false,
    });
    expect(chrome.claimedByCurrentUser).toBe(false);
    expect(chrome.hasVisibleClaimForGray).toBe(true);
    expect(chrome.isFullyClaimedForChrome).toBe(true);
    expect(chrome.isUnavailableDueToSiblingClaim).toBe(true);
    expect(chrome.claimsForBadge).toHaveLength(0);
  });

  it('does not mark the claimed active section as unavailable', () => {
    const browse = resolveItemSubstitutionOptions(parent(), [claimedSub]);
    const chrome = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [claimedSub],
      active: browse[1]!,
      userId: 'viewer-2',
      isMultiCount: false,
    });
    expect(chrome.isUnavailableDueToSiblingClaim).toBe(false);
  });

  it('marks the claimer only on their claimed section', () => {
    const browse = resolveItemSubstitutionOptions(parent(), [claimedSub]);
    const onClaimed = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [claimedSub],
      active: browse[1]!,
      userId: 'claimer-1',
      isMultiCount: false,
    });
    expect(onClaimed.claimedByCurrentUser).toBe(true);

    const onSibling = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [claimedSub],
      active: browse[0]!,
      userId: 'claimer-1',
      isMultiCount: false,
    });
    expect(onSibling.claimedByCurrentUser).toBe(false);
    expect(onSibling.hasVisibleClaimForGray).toBe(true);
  });

  it('does not treat partial multi-count sibling claims as fully claimed chrome', () => {
    const partialSub = option({
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
            ClaimedByName: 'Claimer',
            Quantity: 1,
          },
        ],
        IsClaimed: true,
        IsFullyClaimed: false,
      },
    });
    const browse = resolveItemSubstitutionOptions(parent(), [partialSub]);
    const chrome = resolveSubstitutionGroupClaimChrome({
      parent: parent(),
      options: [partialSub],
      active: browse[0]!,
      userId: 'viewer-2',
      isMultiCount: true,
    });
    expect(chrome.hasVisibleClaimForGray).toBe(true);
    expect(chrome.isFullyClaimedForChrome).toBe(false);
  });
});
