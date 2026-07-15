import { describe, expect, test } from 'vitest';
import {
  formatDescriptionForExport,
  getItemFavoriteFlag,
  getItemFavoriteOrPinnedFlag,
  parseItemDescription,
  serializeItemDescription,
} from './parse-item-description.util';

describe('parseItemDescription', () => {
  test('returns plain text for non-JSON descriptions', () => {
    expect(parseItemDescription('A simple note')).toEqual({
      text: 'A simple note',
      metadata: null,
      isJson: false,
    });
  });

  test('parses CustomFields JSON shape', () => {
    const description = JSON.stringify({
      Text: 'Blue shirt',
      CustomFields: {
        Predefined: { ShirtSize: 'M' },
        UserDefined: {},
      },
      IsFavorite: true,
    });

    expect(parseItemDescription(description)).toMatchObject({
      text: 'Blue shirt',
      isJson: true,
      metadata: {
        Text: 'Blue shirt',
        CustomFields: {
          Predefined: { ShirtSize: 'M' },
          UserDefined: {},
        },
        IsFavorite: true,
      },
    });
  });

  test('parses user-defined CustomFields', () => {
    const description = JSON.stringify({
      Text: 'Notes',
      CustomFields: {
        Predefined: { Color: 'Black' },
        UserDefined: { PrintStyle: 'Puff' },
      },
    });

    expect(parseItemDescription(description)).toMatchObject({
      text: 'Notes',
      isJson: true,
      metadata: {
        Text: 'Notes',
        CustomFields: {
          Predefined: { Color: 'Black' },
          UserDefined: { PrintStyle: 'Puff' },
        },
      },
    });
  });
});

describe('getItemFavoriteFlag', () => {
  test('reads IsFavorite from JSON metadata', () => {
    expect(getItemFavoriteFlag(JSON.stringify({ Text: 'Item', IsFavorite: true }))).toBe(true);
    expect(getItemFavoriteFlag('plain text')).toBe(false);
  });
});

describe('getItemFavoriteOrPinnedFlag', () => {
  test('reads IsFavorite or IsPinned from JSON metadata', () => {
    expect(getItemFavoriteOrPinnedFlag(JSON.stringify({ IsPinned: true }))).toBe(true);
    expect(getItemFavoriteOrPinnedFlag(JSON.stringify({ IsFavorite: true }))).toBe(true);
    expect(getItemFavoriteOrPinnedFlag('plain text')).toBe(false);
  });
});

describe('serializeItemDescription', () => {
  test('stringifies metadata with CustomFields shape', () => {
    const result = serializeItemDescription('Updated text', {
      CustomFields: {
        Predefined: { ShirtSize: 'L' },
        UserDefined: {},
      },
      IsFavorite: true,
    });
    expect(JSON.parse(result)).toEqual({
      Text: 'Updated text',
      CustomFields: {
        Predefined: { ShirtSize: 'L' },
        UserDefined: {},
      },
      IsFavorite: true,
    });
  });

  test('round-trips PascalCase variations', () => {
    const source = JSON.stringify({
      Text: 'Socks',
      IsPinned: true,
      Variations: [{ Name: 'Red', Quantity: 2 }],
    });
    const parsed = parseItemDescription(source);
    expect(parsed.metadata?.IsPinned).toBe(true);
    expect(parsed.metadata?.Variations).toEqual([{ Name: 'Red', Quantity: 2 }]);

    const rewritten = serializeItemDescription('Socks', parsed.metadata);
    expect(JSON.parse(rewritten)).toMatchObject({
      Text: 'Socks',
      IsPinned: true,
      Variations: [{ Name: 'Red', Quantity: 2 }],
    });
  });
});

describe('formatDescriptionForExport', () => {
  test('formats JSON metadata for export', () => {
    const description = JSON.stringify({
      Text: 'Running shoes',
      CustomFields: {
        Predefined: { ShoesSize: '10' },
        UserDefined: {},
      },
    });

    expect(formatDescriptionForExport(description)).toContain('Running shoes');
    expect(formatDescriptionForExport(description)).toContain('Shoes Size: 10');
  });
});
