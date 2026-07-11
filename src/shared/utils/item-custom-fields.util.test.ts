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
  test('migrates legacy flat fields to CustomFields', () => {
    const normalized = normalizeItemDescriptionMetadata({
      text: 'Blue shirt',
      shirtSize: 'M',
      color: 'Navy',
      custom: [{ name: 'Fit', value: 'Regular' }],
    });

    expect(normalized.Text).toBe('Blue shirt');
    expect(normalized.CustomFields?.Predefined).toMatchObject({
      ShirtSize: 'M',
      Color: 'Navy',
    });
    expect(normalized.CustomFields?.UserDefined).toEqual({ Fit: 'Regular' });
  });

  test('reads new CustomFields shape', () => {
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
});

describe('buildItemDescriptionPayload', () => {
  test('serializes new JSON shape with PascalCase top-level fields', () => {
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
  test('formats legacy metadata for display', () => {
    const entries = getMetadataDisplayEntries({
      text: 'Item',
      shoesSize: '10',
      custom: [{ name: 'Width', value: 'Wide' }],
    });

    expect(entries).toEqual([
      { label: 'Shoes Size', value: '10' },
      { label: 'Width', value: 'Wide' },
    ]);
  });
});
