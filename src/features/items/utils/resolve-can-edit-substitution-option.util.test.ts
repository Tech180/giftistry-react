import { describe, expect, it } from 'vitest';
import type { ItemSubstitutionOption } from '../interfaces/item-substitution-option.interface';
import { resolveCanEditSubstitutionOption } from './resolve-can-edit-substitution-option.util';

const option = (
  overrides: Partial<ItemSubstitutionOption> & Pick<ItemSubstitutionOption, 'Id' | 'Kind'>
): ItemSubstitutionOption => ({
  SortOrder: 0,
  CreatedByUserId: 'author-1',
  Item: {
    Id: 'child-1',
    Name: 'Sub',
    Description: null,
    Links: [],
    Photos: [],
    Claims: [],
    IsClaimed: false,
  },
  ...overrides,
});

describe('resolveCanEditSubstitutionOption', () => {
  it('allows list managers to edit owner_approved only', () => {
    const o = option({ Id: 'o1', Kind: 'owner_approved', CreatedByUserId: 'owner-1' });
    expect(
      resolveCanEditSubstitutionOption({ option: o, userId: 'mgr', canCollaborate: true })
    ).toEqual({ canEdit: true, canDelete: true });
    expect(
      resolveCanEditSubstitutionOption({ option: o, userId: 'guest', canCollaborate: false })
    ).toEqual({ canEdit: false, canDelete: false });
  });

  it('allows only the author to edit claimer_custom', () => {
    const o = option({ Id: 'c1', Kind: 'claimer_custom', CreatedByUserId: 'guest-a' });
    expect(
      resolveCanEditSubstitutionOption({ option: o, userId: 'guest-a', canCollaborate: false })
    ).toEqual({ canEdit: true, canDelete: true });
    expect(
      resolveCanEditSubstitutionOption({ option: o, userId: 'guest-b', canCollaborate: false })
    ).toEqual({ canEdit: false, canDelete: false });
    expect(
      resolveCanEditSubstitutionOption({ option: o, userId: 'owner', canCollaborate: true })
    ).toEqual({ canEdit: false, canDelete: false });
  });
});
