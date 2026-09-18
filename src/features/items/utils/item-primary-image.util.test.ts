import { describe, expect, it } from 'vitest';
import type { Item } from '../interfaces/item.interface';
import { getItemPrimaryImageUrl } from './item-primary-image.util';

function item(overrides: Partial<Item> = {}): Item {
  return {
    Id: 'item-1',
    ListId: 'list-1',
    Name: 'Widget',
    Description: null,
    Category: 'uncategorized',
    Priority: null,
    PriorityId: null,
    Photos: [],
    Links: [
      {
        Id: 'link-1',
        ItemId: 'item-1',
        Url: 'https://shop.example/p',
        RetailerName: 'Shop',
        ExtractedPrice: null,
        ExtractedImageUrl: 'https://cdn.example.com/scrape.jpg',
      },
    ],
    ...overrides,
  } as Item;
}

describe('getItemPrimaryImageUrl', () => {
  it('returns the first photo by SortOrder', () => {
    expect(
      getItemPrimaryImageUrl(
        item({
          Photos: [
            { Id: 'p2', Url: 'data:image/png;base64,b', SortOrder: 1 },
            { Id: 'p1', Url: 'data:image/png;base64,a', SortOrder: 0 },
          ],
        })
      )
    ).toBe('data:image/png;base64,a');
  });

  it('does not fall back to ExtractedImageUrl when Photos are empty', () => {
    expect(getItemPrimaryImageUrl(item({ Photos: [] }))).toBeNull();
  });
});
