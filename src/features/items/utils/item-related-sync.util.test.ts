import { describe, expect, it } from 'vitest';
import { Item } from '../interfaces/item.interface';
import { resolveEditorRelatedItemIds } from './item-related-sync.util';

function makeItem(id: string, relatedIds: string[]): Item {
  return {
    Id: id,
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Name: `Item ${id}`,
    Description: JSON.stringify({ RelatedItemIds: relatedIds }),
    IsHiddenIdea: false,
    Category: 'uncategorized',
    Links: [],
    Claims: [],
    IsClaimed: false,
  };
}

describe('resolveEditorRelatedItemIds', () => {
  it('returns forward related when editing the source item', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', []),
      makeItem('3', []),
    ];

    expect(resolveEditorRelatedItemIds('1', items).sort()).toEqual(['2', '3']);
  });

  it('returns reverse and transitive related when editing a target item', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', []),
      makeItem('3', []),
    ];

    expect(resolveEditorRelatedItemIds('2', items).sort()).toEqual(['1', '3']);
    expect(resolveEditorRelatedItemIds('3', items).sort()).toEqual(['1', '2']);
  });

  it('returns full bidirectional group after sync-style storage', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', ['1', '3']),
      makeItem('3', ['1', '2']),
    ];

    expect(resolveEditorRelatedItemIds('2', items).sort()).toEqual(['1', '3']);
  });
});
