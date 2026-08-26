import { describe, expect, it } from 'vitest';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution.interface';
import type { ResolveClaimerSubstitutionActionResult } from './resolve-claimer-substitution-action.util';
import { resolveSectionFooterActions } from './resolve-section-footer-actions.util';

const ownCustom = (): ItemSubstitutionOption => ({
  Id: 'sub-own',
  Kind: 'claimer_custom',
  SortOrder: 0,
  CreatedByUserId: 'claimer-1',
  Item: {
    Id: 'child-own',
    Name: 'My alt',
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
});

const otherCustom = (): ItemSubstitutionOption => ({
  Id: 'sub-other',
  Kind: 'claimer_custom',
  SortOrder: 0,
  CreatedByUserId: 'other-user',
  Item: {
    Id: 'child-other',
    Name: 'Other alt',
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
});

const ownerApproved = (): ItemSubstitutionOption => ({
  Id: 'sub-owner',
  Kind: 'owner_approved',
  SortOrder: 0,
  CreatedByUserId: 'owner-1',
  Item: {
    Id: 'child-owner',
    Name: 'Approved alt',
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
});

const createEligible = (): ResolveClaimerSubstitutionActionResult => ({
  visible: true,
  allowSubstitutions: true,
  mode: 'create',
  ownOption: null,
});

const manageEligible = (
  ownOption: ItemSubstitutionOption
): ResolveClaimerSubstitutionActionResult => ({
  visible: true,
  allowSubstitutions: true,
  mode: 'manage',
  ownOption,
});

const hiddenEligible = (): ResolveClaimerSubstitutionActionResult => ({
  visible: false,
  allowSubstitutions: true,
  mode: 'create',
  ownOption: null,
});

describe('resolveSectionFooterActions', () => {
  it('on Main Item shows parent edit for owners/suggesters and Add substitution when create-eligible', () => {
    const result = resolveSectionFooterActions({
      active: { kind: 'original' },
      canEditItem: true,
      claimerEligibility: createEligible(),
    });
    expect(result.showParentEditDelete).toBe(true);
    expect(result.substitutionSurface).toEqual({
      mode: 'create',
      allowSubstitutions: true,
      ownOption: null,
    });
  });

  it('on Main Item hides parent edit for claimers and still allows Add substitution', () => {
    const result = resolveSectionFooterActions({
      active: { kind: 'original' },
      canEditItem: false,
      claimerEligibility: createEligible(),
    });
    expect(result.showParentEditDelete).toBe(false);
    expect(result.substitutionSurface?.mode).toBe('create');
  });

  it('on Main Item hides Manage when the claimer already has a custom substitution', () => {
    const own = ownCustom();
    const result = resolveSectionFooterActions({
      active: { kind: 'original' },
      canEditItem: false,
      claimerEligibility: manageEligible(own),
    });
    expect(result.showParentEditDelete).toBe(false);
    expect(result.substitutionSurface).toBeNull();
  });

  it('on own claimer_custom shows Manage and hides parent edit for claimers', () => {
    const own = ownCustom();
    const result = resolveSectionFooterActions({
      active: { kind: 'claimer_custom', option: own },
      canEditItem: false,
      claimerEligibility: manageEligible(own),
    });
    expect(result.showParentEditDelete).toBe(false);
    expect(result.substitutionSurface).toEqual({
      mode: 'manage',
      allowSubstitutions: true,
      ownOption: own,
    });
  });

  it('on someone else’s claimer_custom keeps parent edit for owners and hides Manage', () => {
    const own = ownCustom();
    const other = otherCustom();
    const result = resolveSectionFooterActions({
      active: { kind: 'claimer_custom', option: other },
      canEditItem: true,
      claimerEligibility: manageEligible(own),
    });
    expect(result.showParentEditDelete).toBe(true);
    expect(result.substitutionSurface).toBeNull();
  });

  it('on owner_approved keeps parent edit for owners and hides substitution controls', () => {
    const result = resolveSectionFooterActions({
      active: { kind: 'owner_approved', option: ownerApproved() },
      canEditItem: true,
      claimerEligibility: createEligible(),
    });
    expect(result.showParentEditDelete).toBe(true);
    expect(result.substitutionSurface).toBeNull();
  });

  it('hides substitution surface when claimer eligibility is hidden', () => {
    const result = resolveSectionFooterActions({
      active: { kind: 'original' },
      canEditItem: false,
      claimerEligibility: hiddenEligible(),
    });
    expect(result.substitutionSurface).toBeNull();
  });
});
