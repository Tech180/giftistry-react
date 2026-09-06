import { describe, expect, test } from 'vitest';
import {
  hasItemMetadataDisplay,
  resolveItemMetadataDisplay,
} from './resolve-item-metadata-display.util';

describe('resolveItemMetadataDisplay', () => {
  test('returns predefined and user-defined entries', () => {
    const result = resolveItemMetadataDisplay({
      Text: '',
      CustomFields: {
        Predefined: { ModelNumber: '10001' },
        UserDefined: { Brand: 'Crocs', Material: 'Foam' },
      },
    });

    expect(result.predefinedDisplayEntries).toEqual([
      { label: 'Model Number', value: '10001' },
    ]);
    expect(result.userDefinedEntries).toEqual([
      { name: 'Brand', value: 'Crocs' },
      { name: 'Material', value: 'Foam' },
    ]);
  });

  test('dedupes predefined labels that match user-defined names', () => {
    const result = resolveItemMetadataDisplay({
      Text: '',
      CustomFields: {
        Predefined: { Color: 'Blue' },
        UserDefined: { Color: 'Blue' },
      },
    });

    expect(result.predefinedDisplayEntries).toEqual([]);
    expect(result.userDefinedEntries).toEqual([{ name: 'Color', value: 'Blue' }]);
  });
});

describe('hasItemMetadataDisplay', () => {
  test('returns false when both lists are empty', () => {
    expect(
      hasItemMetadataDisplay({
        predefinedDisplayEntries: [],
        userDefinedEntries: [],
      })
    ).toBe(false);
  });

  test('returns true when either list has entries', () => {
    expect(
      hasItemMetadataDisplay({
        predefinedDisplayEntries: [{ label: 'Model Number', value: '1' }],
        userDefinedEntries: [],
      })
    ).toBe(true);
  });
});
