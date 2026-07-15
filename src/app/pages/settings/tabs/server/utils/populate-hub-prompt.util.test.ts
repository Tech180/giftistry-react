import { describe, expect, test } from 'vitest';
import {
  assemblePopulateHubPrompt,
  extractPopulateBodyFromCombined,
  getPopulateHubReadOnlyStartIndex,
  parsePopulateHubHeaderLine,
  parsePopulateHubPrompt,
  POPULATE_HUB_HEADERS,
} from './populate-hub-prompt.util';

describe('populate-hub-prompt.util', () => {
  test('assemblePopulateHubPrompt joins three sections with headers', () => {
    const combined = assemblePopulateHubPrompt(
      'Populate body',
      'Description body',
      'Category body'
    );

    expect(combined).toContain(`${POPULATE_HUB_HEADERS.populate}\nPopulate body`);
    expect(combined).toContain(`${POPULATE_HUB_HEADERS.description}\nDescription body`);
    expect(combined).toContain(`${POPULATE_HUB_HEADERS.category}\nCategory body`);
  });

  test('parsePopulateHubPrompt round-trips assembled bundle', () => {
    const combined = assemblePopulateHubPrompt('P', 'D', 'C');
    expect(parsePopulateHubPrompt(combined)).toEqual({
      populate: 'P',
      description: 'D',
      category: 'C',
    });
  });

  test('extractPopulateBodyFromCombined returns only populate section', () => {
    const combined = assemblePopulateHubPrompt('Only edit me', 'Desc', 'Cat');
    expect(extractPopulateBodyFromCombined(combined)).toBe('Only edit me');
  });

  test('extractPopulateBodyFromCombined falls back when headers missing', () => {
    expect(extractPopulateBodyFromCombined('Legacy populate-only prompt')).toBe(
      'Legacy populate-only prompt'
    );
  });

  test('parsePopulateHubHeaderLine extracts display title', () => {
    expect(parsePopulateHubHeaderLine('=== Description ===')).toBe('Description');
    expect(parsePopulateHubHeaderLine('not a header')).toBeNull();
  });

  test('getPopulateHubReadOnlyStartIndex marks linked sections', () => {
    const combined = assemblePopulateHubPrompt('P', 'D', 'C');
    const readOnlyStart = getPopulateHubReadOnlyStartIndex(combined);

    expect(readOnlyStart).not.toBeNull();
    expect(combined.slice(readOnlyStart!)).toContain(`${POPULATE_HUB_HEADERS.description}`);
    expect(combined.slice(0, readOnlyStart!)).toBe(`${POPULATE_HUB_HEADERS.populate}\nP\n`);
  });
});
