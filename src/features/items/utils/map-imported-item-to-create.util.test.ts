import { describe, expect, test } from 'vitest';
import { detectImportFormat, filenameStemAsTitle } from './detect-import-format.util';
import { mapImportedItemToCreate } from './map-imported-item-to-create.util';

describe('detect-import-format.util', () => {
  test('detects known extensions', () => {
    expect(detectImportFormat('list.CSV')).toBe('csv');
    expect(detectImportFormat('list.json')).toBe('json');
    expect(detectImportFormat('list.pdf')).toBe('pdf');
    expect(detectImportFormat('list.docx')).toBe('unknown');
  });

  test('filenameStemAsTitle strips extension', () => {
    expect(filenameStemAsTitle('Holiday_List.json')).toBe('Holiday_List');
  });
});

describe('map-imported-item-to-create.util', () => {
  test('maps basic preview fields', () => {
    const payload = mapImportedItemToCreate({
      Name: ' Mug ',
      Category: 'Home',
      Priority: 2,
      Description: 'Ceramic',
      Price: 12.5,
      WebsiteLink: 'https://example.com',
    });
    expect(payload).toEqual({
      name: 'Mug',
      description: 'Ceramic',
      linkUrl: 'https://example.com',
      price: 12.5,
      category: 'Home',
      priority: 2,
    });
  });

  test('serializes favorite into description metadata', () => {
    const payload = mapImportedItemToCreate({
      Name: 'Ring',
      IsFavorite: true,
      Description: 'Nice',
    });
    expect(payload.description).toContain('"IsFavorite":true');
  });
});
