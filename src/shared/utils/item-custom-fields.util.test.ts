import { describe, expect, test } from 'vitest';
import {
  buildItemDescriptionPayload,
  buildSummarizeCustomFields,
  getCorePredefinedFromMetadata,
  getMetadataDisplayEntries,
  getUserDefinedEntries,
  normalizeItemDescriptionMetadata,
} from './item-custom-fields.util';

describe('normalizeItemDescriptionMetadata', () => {
  test('reads CustomFields shape', () => {
    const normalized = normalizeItemDescriptionMetadata({
      Text: 'Notes',
      CustomFields: {
        Predefined: { PantsSize: '32x30' },
        UserDefined: { PrintStyle: 'Puff' },
      },
    });

    expect(getCorePredefinedFromMetadata(normalized).pantsSize).toBe('32x30');
    expect(getUserDefinedEntries(normalized)).toEqual([
      { name: 'PrintStyle', value: 'Puff' },
    ]);
  });

  test('reads PascalCase favorites and variations', () => {
    const normalized = normalizeItemDescriptionMetadata({
      Text: 'Socks',
      IsPinned: true,
      Variations: [{ Name: 'Blue', Quantity: 1 }],
    });

    expect(normalized.IsPinned).toBe(true);
    expect(normalized.Variations).toEqual([{ Name: 'Blue', Quantity: 1 }]);
  });
});

describe('buildItemDescriptionPayload', () => {
  test('serializes PascalCase top-level fields', () => {
    const payload = buildItemDescriptionPayload({
      text: 'Soft tee',
      predefined: { shirtSize: 'L', pantsSize: null },
      userDefined: { PreferredFit: 'Regular' },
      multiCount: true,
      desiredQuantity: 2,
      alwaysJson: true,
    });

    expect(JSON.parse(payload)).toEqual({
      Text: 'Soft tee',
      CustomFields: {
        Predefined: { ShirtSize: 'L' },
        UserDefined: { PreferredFit: 'Regular' },
      },
      MultiCount: true,
      DesiredQuantity: 2,
    });
  });

  test('serializes IsFavorite and Variations', () => {
    const payload = buildItemDescriptionPayload({
      text: 'Socks',
      predefined: {},
      userDefined: {},
      isFavorite: true,
      variations: [{ name: 'Red', quantity: 2 }],
      alwaysJson: true,
    });

    expect(JSON.parse(payload)).toEqual({
      Text: 'Socks',
      CustomFields: {
        Predefined: {},
        UserDefined: {},
      },
      Variations: [{ Name: 'Red', Quantity: 2 }],
      IsFavorite: true,
    });
  });
});

describe('buildSummarizeCustomFields', () => {
  test('combines dynamic values and bucketed custom rows', () => {
    const result = buildSummarizeCustomFields({
      dynamicValues: { pantsSize: '32x30' },
      customFieldRows: [
        { name: 'Shirt Size', value: 'L', bucket: 'predefined', storageKey: 'ShirtSize' },
        { name: 'Brand', value: 'Acme', bucket: 'userDefined' },
      ],
    });

    expect(result).toEqual({
      Predefined: { PantsSize: '32x30', ShirtSize: 'L' },
      UserDefined: { Brand: 'Acme' },
    });
  });
});

describe('getMetadataDisplayEntries', () => {
  test('formats CustomFields metadata for display', () => {
    const entries = getMetadataDisplayEntries({
      Text: 'Item',
      CustomFields: {
        Predefined: { ShoesSize: '10' },
        UserDefined: { Width: 'Wide' },
      },
    });

    expect(entries).toEqual([
      { label: 'Shoes Size', value: '10' },
      { label: 'Width', value: 'Wide' },
    ]);
  });
});
