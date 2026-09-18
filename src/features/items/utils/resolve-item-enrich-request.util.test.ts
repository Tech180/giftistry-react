import { describe, expect, test } from 'vitest';
import { resolveItemEnrichRequest } from './resolve-item-enrich-request.util';

describe('resolveItemEnrichRequest', () => {
  test('substitution editor always draft-populates without write-back', () => {
    expect(
      resolveItemEnrichRequest({
        persistedItemId: 'parent-1',
        isSubstitutionEditor: true,
      })
    ).toEqual({
      intent: 'draft-populate',
      itemId: undefined,
      writeBack: false,
    });
  });

  test('persisted parent/item edit uses update-item write-back', () => {
    expect(
      resolveItemEnrichRequest({
        persistedItemId: 'item-1',
        isSubstitutionEditor: false,
      })
    ).toEqual({
      intent: 'update-item',
      itemId: 'item-1',
      writeBack: true,
    });
  });

  test('add-new-item draft-populates without an item id', () => {
    expect(
      resolveItemEnrichRequest({
        persistedItemId: undefined,
        isSubstitutionEditor: false,
      })
    ).toEqual({
      intent: 'draft-populate',
      itemId: undefined,
      writeBack: false,
    });

    expect(
      resolveItemEnrichRequest({
        persistedItemId: null,
        isSubstitutionEditor: false,
      })
    ).toEqual({
      intent: 'draft-populate',
      itemId: undefined,
      writeBack: false,
    });
  });
});
