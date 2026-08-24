import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import { hasUnclaimedLinkedItems } from './has-unclaimed-linked-items.util';

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
  Metadata: null,
  ...overrides,
});

describe('hasUnclaimedLinkedItems', () => {
  it('returns false when there are no linked items', () => {
    const item = baseItem();
    expect(hasUnclaimedLinkedItems(item, [item])).toBe(false);
  });

  it('returns true when a forward-linked peer is unclaimed', () => {
    const peer = baseItem({ Id: 'item-2', Name: 'Hat', IsClaimed: false });
    const item = baseItem({
      Metadata: { LinkedItemIds: ['item-2'] },
    });
    expect(hasUnclaimedLinkedItems(item, [item, peer])).toBe(true);
  });

  it('returns false when all linked peers are claimed', () => {
    const peer = baseItem({ Id: 'item-2', Name: 'Hat', IsClaimed: true });
    const item = baseItem({
      Metadata: { LinkedItemIds: ['item-2'] },
    });
    expect(hasUnclaimedLinkedItems(item, [item, peer])).toBe(false);
  });

  it('resolves peers via metadata LinkedItemIds', () => {
    const peer = baseItem({ Id: 'item-2', IsClaimed: false });
    const item = baseItem({
      Id: 'item-1',
      Metadata: { LinkedItemIds: ['item-2'] },
    });
    expect(hasUnclaimedLinkedItems(item, [item, peer])).toBe(true);
  });
});
