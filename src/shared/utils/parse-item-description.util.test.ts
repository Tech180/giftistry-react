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

  test('parses legacy JSON metadata and normalizes to CustomFields', () => {
    const description = JSON.stringify({
      text: 'Blue shirt',
      shirtSize: 'M',
      isFavorite: true,
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
        isFavorite: true,
      },
    });
  });

  test('parses new CustomFields JSON shape', () => {
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
  test('reads isFavorite from JSON metadata', () => {
    const description = JSON.stringify({ text: 'Item', isFavorite: true });
    expect(getItemFavoriteFlag(description)).toBe(true);
    expect(getItemFavoriteFlag('plain text')).toBe(false);
  });
});

describe('getItemFavoriteOrPinnedFlag', () => {
  test('reads isFavorite or isPinned from JSON metadata', () => {
    expect(getItemFavoriteOrPinnedFlag(JSON.stringify({ isPinned: true }))).toBe(true);
    expect(getItemFavoriteOrPinnedFlag(JSON.stringify({ isFavorite: true }))).toBe(true);
    expect(getItemFavoriteOrPinnedFlag('plain text')).toBe(false);
  });
});

describe('serializeItemDescription', () => {
  test('stringifies metadata with CustomFields shape', () => {
    const result = serializeItemDescription('Updated text', {
      shirtSize: 'L',
      isFavorite: true,
    });
    expect(JSON.parse(result)).toEqual({
      Text: 'Updated text',
      CustomFields: {
        Predefined: { ShirtSize: 'L' },
        UserDefined: {},
      },
      isFavorite: true,
    });
  });
});

describe('formatDescriptionForExport', () => {
  test('formats JSON metadata for export', () => {
    const description = JSON.stringify({
      text: 'Running shoes',
      shoesSize: '10',
      custom: [{ name: 'Width', value: 'Wide' }],
    });

    expect(formatDescriptionForExport(description)).toBe(
      'Running shoes [Shoes Size: 10, Width: Wide]'
    );
  });

  test('returns plain text unchanged', () => {
    expect(formatDescriptionForExport('Just text')).toBe('Just text');
  });
});
