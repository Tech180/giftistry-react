import { describe, expect, test } from 'vitest';
import {
  applyExtractedToDynamicValues,
  leftoverExtractedRows,
  partitionExtractedCustomFields,
  rowsFromExtractedMetadata,
  splitCustomFieldRowsForSave,
} from './add-item-custom-fields.util';

const lttExtract = {
  Title: 'NetNoodz Tee',
  Price: 34.99,
  Description: null,
  Category: 'clothing',
  ImageUrl: null,
  CustomFields: {
    Predefined: { ShirtSize: 'Small' },
    UserDefined: { Brand: 'LTTStore', Material: 'polyblend' },
  },
} as const;

describe('add-item-custom-fields.util', () => {
  test('rowsFromExtractedMetadata dedupes predefined keys', () => {
    const rows = rowsFromExtractedMetadata({
      Title: 'Tee',
      Price: null,
      Description: null,
      Category: 'clothing',
      ImageUrl: null,
      CustomFields: {
        Predefined: { ShirtSize: 'L', Color: 'Black' },
        UserDefined: { Brand: 'Acme' },
      },
    });

    expect(rows).toHaveLength(3);
    expect(rows.find((row) => row.storageKey === 'ShirtSize')?.value).toBe('L');
    expect(rows.find((row) => row.storageKey === 'Color')?.value).toBe('Black');
    expect(rows.find((row) => row.name === 'Brand')?.bucket).toBe('userDefined');
  });

  test('applyExtractedToDynamicValues maps PascalCase keys to definition field keys', () => {
    const values = applyExtractedToDynamicValues(lttExtract, [
      'shirtSize',
      'preferredColor',
      'pantsSize',
    ]);

    expect(values).toEqual({ shirtSize: 'Small' });
  });

  test('applyExtractedToDynamicValues maps Color to preferredColor definition', () => {
    const values = applyExtractedToDynamicValues(
      {
        Title: 'Tee',
        Price: null,
        Description: null,
        Category: 'clothing',
        ImageUrl: null,
        CustomFields: {
          Predefined: { Color: 'Black' },
          UserDefined: {},
        },
      },
      ['preferredColor']
    );

    expect(values).toEqual({ preferredColor: 'Black' });
  });

  test('leftoverExtractedRows skips fields absorbed by definitions', () => {
    const rows = leftoverExtractedRows(lttExtract, ['shirtSize'], {
      shirtSize: 'Shirt Size',
    });

    expect(rows).toHaveLength(2);
    expect(rows.some((row) => row.storageKey === 'ShirtSize')).toBe(false);
    expect(rows.some((row) => row.name === 'Brand')).toBe(true);
    expect(rows.some((row) => row.name === 'Material')).toBe(true);
  });

  test('partitionExtractedCustomFields routes shirt size to dynamic values when definitions exist', () => {
    const { dynamicValues, customFieldRows } = partitionExtractedCustomFields(lttExtract, [
      'shirtSize',
      'preferredColor',
    ], {
      shirtSize: 'Shirt Size',
      preferredColor: 'Preferred Color',
    });

    expect(dynamicValues).toEqual({ shirtSize: 'Small' });
    expect(customFieldRows).toHaveLength(2);
    expect(customFieldRows.every((row) => row.bucket === 'userDefined')).toBe(true);
  });

  test('partitionExtractedCustomFields falls back to rows when definitions are empty', () => {
    const { dynamicValues, customFieldRows } = partitionExtractedCustomFields(lttExtract, []);

    expect(dynamicValues).toEqual({});
    expect(customFieldRows.some((row) => row.storageKey === 'ShirtSize')).toBe(true);
  });

  test('splitCustomFieldRowsForSave routes by bucket', () => {
    const result = splitCustomFieldRowsForSave([
      {
        id: '1',
        name: 'Shirt Size',
        value: 'L',
        bucket: 'predefined',
        storageKey: 'ShirtSize',
      },
      {
        id: '2',
        name: 'Brand',
        value: 'Acme',
        bucket: 'userDefined',
      },
    ]);

    expect(result).toEqual({
      predefined: { ShirtSize: 'L' },
      userDefined: { Brand: 'Acme' },
    });
  });
});
