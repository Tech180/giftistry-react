import { describe, expect, test } from 'vitest';
import { buildGrabInfoUpdate } from './build-grab-info-update.util';
import type { CreatedImportItem } from './map-bulk-created-items.util';
import type { ExtractMetadataResult } from '../api/items.api';

const existing: CreatedImportItem = {
  id: 'item-1',
  name: 'Imported name',
  description: 'Imported description',
  category: 'books',
  priority: 2,
  linkUrl: 'https://shop.example/item',
  price: 20,
  websiteName: 'Shop',
};

function extract(overrides: Partial<ExtractMetadataResult> = {}): ExtractMetadataResult {
  return {
    Title: '',
    Price: null,
    Description: null,
    Category: null,
    CategoryAlternatives: [],
    ImageUrl: null,
    WebsiteName: null,
    CustomFields: { Predefined: {}, UserDefined: {} },
    ...overrides,
  };
}

describe('buildGrabInfoUpdate', () => {
  test('keeps imported values when extract fields are empty', () => {
    expect(buildGrabInfoUpdate(existing, extract())).toMatchObject({
      name: 'Imported name',
      description: 'Imported description',
      category: 'books',
      price: 20,
      websiteName: 'Shop',
      linkUrl: 'https://shop.example/item',
    });
  });

  test('applies extract values when present', () => {
    expect(
      buildGrabInfoUpdate(
        existing,
        extract({
          Title: 'Scraped title',
          Description: 'Scraped description',
          Category: 'toys',
          Price: 42,
          WebsiteName: 'Amazon',
        })
      )
    ).toMatchObject({
      name: 'Scraped title',
      description: 'Scraped description',
      category: 'toys',
      price: 42,
      websiteName: 'Amazon',
    });
  });
});
