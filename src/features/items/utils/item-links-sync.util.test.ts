import { describe, expect, it } from 'vitest';
import { Item } from '../interfaces/item.interface';
import { resolveEditorLinkedItemIds } from './item-links-sync.util';

function makeItem(id: string, linkedIds: string[]): Item {
  return {
    Id: id,
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Name: `Item ${id}`,
    Description: JSON.stringify({ LinkedItemIds: linkedIds }),
    IsHiddenIdea: false,
    Category: 'uncategorized',
    Links: [],
    Claims: [],
    IsClaimed: false,
  };
}

describe('resolveEditorLinkedItemIds', () => {
  it('returns forward links when editing the source item', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', []),
      makeItem('3', []),
    ];

    expect(resolveEditorLinkedItemIds('1', items).sort()).toEqual(['2', '3']);
  });

  it('returns reverse and transitive links when editing a target item', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', []),
      makeItem('3', []),
    ];

    expect(resolveEditorLinkedItemIds('2', items).sort()).toEqual(['1', '3']);
    expect(resolveEditorLinkedItemIds('3', items).sort()).toEqual(['1', '2']);
  });

  it('returns full bidirectional group after sync-style storage', () => {
    const items = [
      makeItem('1', ['2', '3']),
      makeItem('2', ['1', '3']),
      makeItem('3', ['1', '2']),
    ];

    expect(resolveEditorLinkedItemIds('2', items).sort()).toEqual(['1', '3']);
  });
});
