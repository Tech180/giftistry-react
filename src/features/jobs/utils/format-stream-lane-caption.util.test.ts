import { describe, expect, test } from 'vitest';
import {
  formatStreamLaneCaption,
  formatStreamLaneDetail,
} from './format-stream-lane-caption.util';

describe('formatStreamLaneCaption', () => {
  test('joins detail and tok/s', () => {
    expect(formatStreamLaneDetail('Categorizing…', { Value: 40, Unit: 'tok/s' })).toBe(
      'Categorizing… · 40 tok/s'
    );
    expect(formatStreamLaneCaption('Helix', 'Categorizing…', { Value: 40, Unit: 'tok/s' })).toBe(
      'Helix · Categorizing… · 40 tok/s'
    );
  });

  test('omits missing segments', () => {
    expect(formatStreamLaneDetail(null, null)).toBe('');
    expect(formatStreamLaneCaption('Helix', null, null)).toBe('Helix');
    expect(formatStreamLaneCaption('Helix', 'Scraping…', null)).toBe('Helix · Scraping…');
  });
});
