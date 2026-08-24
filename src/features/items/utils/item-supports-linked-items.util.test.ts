import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import {
  itemSupportsLinkedItems,
  linkGroupSupportsLinkedItems,
} from './item-supports-linked-items.util';

const baseItem = (overrides: Partial<Item> = {}): Item => ({
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
  ...overrides,
});

describe('itemSupportsLinkedItems', () => {
  it('allows quantity 1 items', () => {
    expect(itemSupportsLinkedItems(baseItem({ DesiredQuantity: 1 }))).toBe(true);
  });

  it('blocks items with quantity greater than 1', () => {
    expect(itemSupportsLinkedItems(baseItem({ DesiredQuantity: 2 }))).toBe(false);
  });

  it('blocks unlimited quantity (0)', () => {
    expect(itemSupportsLinkedItems(baseItem({ DesiredQuantity: 0, IsMultiCount: true }))).toBe(
      false
    );
  });

  it('blocks when IsMultiCount is true', () => {
    expect(
      itemSupportsLinkedItems(baseItem({ IsMultiCount: true, DesiredQuantity: 1 }))
    ).toBe(false);
  });

  it('blocks when metadata DesiredQuantity is greater than 1 even if top-level qty is 1', () => {
    expect(
      itemSupportsLinkedItems(
        baseItem({
          DesiredQuantity: 1,
          IsMultiCount: false,
          Metadata: { DesiredQuantity: 4, MultiCount: true },
        })
      )
    ).toBe(false);
  });

  it('blocks when DesiredQuantity is greater than 1 even if IsMultiCount is false', () => {
    expect(
      itemSupportsLinkedItems(
        baseItem({ DesiredQuantity: 5, IsMultiCount: false })
      )
    ).toBe(false);
  });

  it('uses explicit metadata argument over item.Metadata', () => {
    expect(
      itemSupportsLinkedItems(baseItem({ DesiredQuantity: 1 }), {
        DesiredQuantity: 3,
      })
    ).toBe(false);
  });

  it('blocks suggestions even when quantity is 1', () => {
    expect(
      itemSupportsLinkedItems(
        baseItem({ IsSuggestion: true, DesiredQuantity: 1 })
      )
    ).toBe(false);
  });
});

describe('linkGroupSupportsLinkedItems', () => {
  it('allows when source and peers are single-count', () => {
    const source = baseItem({ Id: 'a' });
    const peers = [baseItem({ Id: 'b' }), baseItem({ Id: 'c' })];
    expect(linkGroupSupportsLinkedItems(source, peers)).toBe(true);
  });

  it('blocks when source is multi-count', () => {
    const source = baseItem({ Id: 'a', DesiredQuantity: 3 });
    const peers = [baseItem({ Id: 'b' })];
    expect(linkGroupSupportsLinkedItems(source, peers)).toBe(false);
  });

  it('blocks when any peer is multi-count', () => {
    const source = baseItem({ Id: 'a' });
    const peers = [
      baseItem({ Id: 'b' }),
      baseItem({ Id: 'c', DesiredQuantity: 2, IsMultiCount: true }),
    ];
    expect(linkGroupSupportsLinkedItems(source, peers)).toBe(false);
  });

  it('blocks when source is a suggestion', () => {
    const source = baseItem({ Id: 'a', IsSuggestion: true });
    const peers = [baseItem({ Id: 'b' })];
    expect(linkGroupSupportsLinkedItems(source, peers)).toBe(false);
  });

  it('blocks when any peer is a suggestion', () => {
    const source = baseItem({ Id: 'a' });
    const peers = [
      baseItem({ Id: 'b' }),
      baseItem({ Id: 'c', IsSuggestion: true }),
    ];
    expect(linkGroupSupportsLinkedItems(source, peers)).toBe(false);
  });
});
