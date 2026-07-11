import { describe, expect, test } from 'vitest';
import { countPromptLines, splitPromptText } from './highlight-prompt-text.util';

describe('highlight-prompt-text.util', () => {
  test('splitPromptText separates dynamic tokens from plain text', () => {
    expect(splitPromptText('Name: {itemName} at {url}')).toEqual([
      { type: 'text', value: 'Name: ' },
      { type: 'token', value: '{itemName}' },
      { type: 'text', value: ' at ' },
      { type: 'token', value: '{url}' },
    ]);
  });

  test('countPromptLines respects minimum line count', () => {
    expect(countPromptLines('one line', 4)).toBe(4);
    expect(countPromptLines('line one\nline two\nline three', 2)).toBe(3);
  });
});
