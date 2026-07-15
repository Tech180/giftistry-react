import { describe, expect, test } from 'vitest';
import { mapBulkCreatedItems } from './map-bulk-created-items.util';
import type { Item } from '../interfaces/item.interface';

function makeItem(overrides: Partial<Item> & Pick<Item, 'Id' | 'Name'>): Item {
  return {
    ListId: 'list-1',
    PriorityId: null,
    SuggestedByUserId: null,
    Description: null,
    IsHiddenIdea: false,
    Category: 'uncategorized',
    Links: [],
    Claims: [],
    IsClaimed: false,
    ...overrides,
  };
}

describe('mapBulkCreatedItems', () => {
  test('maps created items and falls back to payload link when Links missing', () => {
    const mapped = mapBulkCreatedItems(
      [
        makeItem({ Id: 'a', Name: 'Alpha', Links: [] }),
        makeItem({
          Id: 'b',
          Name: 'Beta',
          Links: [
            {
              Id: 'link-1',
              ItemId: 'b',
              Url: 'https://shop.example/b',
              RetailerName: 'Shop',
              ExtractedPrice: 12,
              ExtractedImageUrl: null,
            },
          ],
        }),
      ],
      [
        { name: 'Alpha', linkUrl: 'https://shop.example/a', price: 9 },
        { name: 'Skipped', linkUrl: 'https://shop.example/skip' },
        { name: 'Beta', linkUrl: 'https://shop.example/b', price: 10 },
      ],
      [1]
    );

    expect(mapped).toEqual([
      {
        id: 'a',
        name: 'Alpha',
        description: null,
        category: 'uncategorized',
        priority: null,
        linkUrl: 'https://shop.example/a',
        price: 9,
        websiteName: null,
      },
      {
        id: 'b',
        name: 'Beta',
        description: null,
        category: 'uncategorized',
        priority: null,
        linkUrl: 'https://shop.example/b',
        price: 12,
        websiteName: 'Shop',
      },
    ]);
  });
});
