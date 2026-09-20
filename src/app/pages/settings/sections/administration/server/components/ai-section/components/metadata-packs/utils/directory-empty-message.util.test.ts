import { describe, expect, test } from 'vitest';
import { directoryEmptyMessage } from './directory-empty-message.util';

describe('directoryEmptyMessage', () => {
  test('mentions search when a query is present', () => {
    expect(directoryEmptyMessage('cpu')).toBe('No metadata packs match your search.');
    expect(directoryEmptyMessage('')).toBe('No metadata packs available.');
  });
});
