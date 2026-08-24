import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import {
  hasLinkedUnclaimPeers,
  resolveLinkedUnclaimPeers,
} from './resolve-linked-unclaim-peers.util';

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

describe('resolveLinkedUnclaimPeers', () => {
  it('returns empty when userId is missing', () => {
    const item = baseItem({ Metadata: { LinkedItemIds: ['item-2'] } });
    const peer = baseItem({
      Id: 'item-2',
      IsClaimed: true,
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-2',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    expect(resolveLinkedUnclaimPeers(item, [item, peer], null)).toEqual([]);
  });

  it('returns peers in the link group claimed by the current user', () => {
    const peer = baseItem({
      Id: 'item-2',
      Name: 'Hat',
      IsClaimed: true,
      Claims: [
        {
          Id: 'c2',
          ItemId: 'item-2',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    const item = baseItem({
      IsClaimed: true,
      Metadata: { LinkedItemIds: ['item-2'] },
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    expect(resolveLinkedUnclaimPeers(item, [item, peer], 'u1')).toEqual([peer]);
    expect(hasLinkedUnclaimPeers(item, [item, peer], 'u1')).toBe(true);
  });

  it('ignores peers claimed only by someone else', () => {
    const peer = baseItem({
      Id: 'item-2',
      IsClaimed: true,
      Claims: [
        {
          Id: 'c2',
          ItemId: 'item-2',
          UserId: 'other',
          Amount: null,
          ClaimedByName: 'Bob',
        },
      ],
    });
    const item = baseItem({
      Metadata: { LinkedItemIds: ['item-2'] },
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    expect(resolveLinkedUnclaimPeers(item, [item, peer], 'u1')).toEqual([]);
    expect(hasLinkedUnclaimPeers(item, [item, peer], 'u1')).toBe(false);
  });

  it('resolves reverse links so unclaiming a peer finds the primary', () => {
    const primary = baseItem({
      Id: 'item-1',
      IsClaimed: true,
      Metadata: { LinkedItemIds: ['item-2'] },
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    const peer = baseItem({
      Id: 'item-2',
      IsClaimed: true,
      Claims: [
        {
          Id: 'c2',
          ItemId: 'item-2',
          UserId: 'u1',
          Amount: null,
          ClaimedByName: 'Ada',
        },
      ],
    });
    expect(resolveLinkedUnclaimPeers(peer, [primary, peer], 'u1')).toEqual([primary]);
  });
});
