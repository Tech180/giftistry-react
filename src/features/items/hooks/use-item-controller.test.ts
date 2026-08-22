import { describe, expect, test, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useItemController } from './use-item-controller';
import type { Item } from '../interfaces/item.interface';
import type { Claim } from '../interfaces/item-claim.interface';
import type { ItemLink } from '../interfaces/item-link.interface';

vi.mock('../api/items.api', () => ({
  itemsApi: {
    listItems: vi.fn(),
    addItem: vi.fn(),
    addItemLink: vi.fn(),
    updateItem: vi.fn(),
    claimItem: vi.fn(),
    unclaimItem: vi.fn(),
    deleteItem: vi.fn(),
  },
}));

import { itemsApi } from '../api/items.api';

const baseItem = (overrides: Partial<Item> = {}): Item => ({
  Id: 'item-1',
  ListId: 'list-1',
  PriorityId: null,
  SuggestedByUserId: null,
  Name: 'Gift',
  Description: 'Nice gift',
  IsHiddenIdea: false,
  Category: 'uncategorized',
  Links: [],
  Claims: [],
  IsClaimed: false,
  ...overrides,
});

describe('useItemController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('fetchItems sets isLoading when not silent', async () => {
    let resolveList: (value: Item[]) => void = () => {};
    vi.mocked(itemsApi.listItems).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        })
    );

    const { result } = renderHook(() => useItemController());

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchItems('list-1');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolveList([baseItem()]);
      await fetchPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toHaveLength(1);
  });

  test('fetchItems silent mode does not flip isLoading', async () => {
    let resolveList: (value: Item[]) => void = () => {};
    vi.mocked(itemsApi.listItems).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveList = resolve;
        })
    );

    const { result } = renderHook(() => useItemController());

    let fetchPromise: Promise<void>;
    act(() => {
      fetchPromise = result.current.fetchItems('list-1', { silent: true });
    });

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      resolveList([baseItem()]);
      await fetchPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toHaveLength(1);
  });

  test('updateItem replaces the item in state', async () => {
    const existing = baseItem();
    const updated = baseItem({ Description: '{"Text":"x","IsFavorite":true}' });
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.updateItem).mockResolvedValue(updated);

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.updateItem(
        existing.Id,
        existing.Name,
        updated.Description,
        null,
        existing.Category,
        null,
        []
      );
    });

    expect(itemsApi.updateItem).toHaveBeenCalled();
    expect(result.current.items[0].Description).toBe(updated.Description);
  });

  test('addItemLink appends a link on the item', async () => {
    const existing = baseItem();
    const link: ItemLink = {
      Id: 'link-1',
      ItemId: existing.Id,
      Url: 'https://example.com',
      RetailerName: null,
      ExtractedPrice: null,
      ExtractedImageUrl: null,
    };
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.addItemLink).mockResolvedValue(link);

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.addItemLink(existing.Id, link.Url);
    });

    expect(result.current.items[0].Links).toEqual([link]);
  });

  test('claimItem appends a claim and marks claimed', async () => {
    const existing = baseItem();
    const claim: Claim = {
      Id: 'claim-1',
      ItemId: existing.Id,
      UserId: 'user-1',
      Amount: null,
      ClaimedByName: 'Test',
    };
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.claimItem).mockResolvedValue({
      Claims: claim,
      Items: [
        {
          Id: existing.Id,
          Claims: [claim],
          IsClaimed: true,
          IsFullyClaimed: true,
          TotalClaimedAmount: 0,
          TotalClaimedQuantity: 1,
          DesiredQuantity: null,
          RemainingQuantity: null,
          FundingTarget: 0,
        },
      ],
    });

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.claimItem({
        itemId: existing.Id,
        claimedByName: 'Test',
        anonymous: false,
      });
    });

    expect(itemsApi.claimItem).toHaveBeenCalledWith(
      existing.Id,
      undefined,
      'Test',
      false,
      undefined,
      undefined,
      undefined
    );
    expect(result.current.items[0].Claims).toEqual([claim]);
    expect(result.current.items[0].IsClaimed).toBe(true);
    expect(result.current.items[0].IsFullyClaimed).toBe(true);
  });

  test('claimItem forwards quantity and selection to the API', async () => {
    const existing = baseItem();
    const claim: Claim = {
      Id: 'claim-1',
      ItemId: existing.Id,
      UserId: 'user-1',
      Amount: null,
      ClaimedByName: 'Test',
      Quantity: 3,
      Selection: 'Red',
    };
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.claimItem).mockResolvedValue({
      Claims: claim,
      Items: [
        {
          Id: existing.Id,
          Claims: [claim],
          IsClaimed: true,
          IsFullyClaimed: false,
          TotalClaimedQuantity: 3,
          DesiredQuantity: 5,
          IsMultiCount: true,
        },
      ],
    });

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.claimItem({
        itemId: existing.Id,
        claimedByName: 'Test',
        anonymous: false,
        quantity: 3,
        selection: 'Red',
      });
    });

    expect(itemsApi.claimItem).toHaveBeenCalledWith(
      existing.Id,
      undefined,
      'Test',
      false,
      3,
      'Red',
      undefined
    );
    expect(result.current.items[0].TotalClaimedQuantity).toBe(3);
  });

  test('claimItems claims multiple items', async () => {
    const a = baseItem({ Id: 'a' });
    const b = baseItem({ Id: 'b' });
    vi.mocked(itemsApi.listItems).mockResolvedValue([a, b]);
    vi.mocked(itemsApi.claimItem)
      .mockResolvedValueOnce({
        Claims: {
          Id: 'c1',
          ItemId: 'a',
          UserId: 'u',
          Amount: null,
          ClaimedByName: null,
        },
        Items: [
          {
            Id: 'a',
            Claims: [
              {
                Id: 'c1',
                ItemId: 'a',
                UserId: 'u',
                Amount: null,
                ClaimedByName: null,
              },
            ],
            IsClaimed: true,
            IsFullyClaimed: true,
          },
        ],
      })
      .mockResolvedValueOnce({
        Claims: {
          Id: 'c2',
          ItemId: 'b',
          UserId: 'u',
          Amount: null,
          ClaimedByName: null,
        },
        Items: [
          {
            Id: 'b',
            Claims: [
              {
                Id: 'c2',
                ItemId: 'b',
                UserId: 'u',
                Amount: null,
                ClaimedByName: null,
              },
            ],
            IsClaimed: true,
            IsFullyClaimed: true,
          },
        ],
      });

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.claimItems([
        { itemId: 'a', anonymous: true },
        { itemId: 'b', anonymous: true },
      ]);
    });

    expect(result.current.items.find((i) => i.Id === 'a')?.IsClaimed).toBe(true);
    expect(result.current.items.find((i) => i.Id === 'b')?.IsClaimed).toBe(true);
  });

  test('unclaimItem removes the current user claim', async () => {
    const existing = baseItem({
      IsClaimed: true,
      IsFullyClaimed: true,
      Claims: [
        {
          Id: 'c1',
          ItemId: 'item-1',
          UserId: 'user-1',
          Amount: null,
          ClaimedByName: 'Me',
        },
        {
          Id: 'c2',
          ItemId: 'item-1',
          UserId: 'user-2',
          Amount: null,
          ClaimedByName: 'Other',
        },
      ],
    });
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.unclaimItem).mockResolvedValue({
      Message: 'Item unclaimed successfully',
      Items: [
        {
          Id: 'item-1',
          Claims: [
            {
              Id: 'c2',
              ItemId: 'item-1',
              UserId: 'user-2',
              Amount: null,
              ClaimedByName: 'Other',
            },
          ],
          IsClaimed: true,
          IsFullyClaimed: true,
          TotalClaimedQuantity: 1,
        },
      ],
    });

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.unclaimItem('item-1', 'user-1');
    });

    expect(result.current.items[0].Claims).toHaveLength(1);
    expect(result.current.items[0].Claims[0].UserId).toBe('user-2');
    expect(result.current.items[0].IsClaimed).toBe(true);
  });

  test('deleteItem removes the item from state', async () => {
    const existing = baseItem();
    vi.mocked(itemsApi.listItems).mockResolvedValue([existing]);
    vi.mocked(itemsApi.deleteItem).mockResolvedValue(undefined);

    const { result } = renderHook(() => useItemController());

    await act(async () => {
      await result.current.fetchItems('list-1', { silent: true });
    });

    await act(async () => {
      await result.current.deleteItem(existing.Id);
    });

    expect(result.current.items).toHaveLength(0);
    await waitFor(() => {
      expect(itemsApi.deleteItem).toHaveBeenCalledWith(existing.Id);
    });
  });

  test('itemActions exposes the mutation methods', () => {
    const { result } = renderHook(() => useItemController());
    expect(result.current.itemActions.updateItem).toBeTypeOf('function');
    expect(result.current.itemActions.claimItem).toBeTypeOf('function');
    expect(result.current.itemActions.claimItems).toBeTypeOf('function');
    expect(result.current.itemActions.unclaimItem).toBeTypeOf('function');
    expect(result.current.itemActions.deleteItem).toBeTypeOf('function');
    expect(result.current.itemActions.addItemLink).toBeTypeOf('function');
  });
});
