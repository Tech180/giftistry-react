import { describe, expect, it } from 'vitest';
import { isAiPopulateFailed } from './is-ai-populate-failed.util';

describe('isAiPopulateFailed', () => {
  it('returns true when Diagnostics.AiPopulate is failed', () => {
    expect(isAiPopulateFailed({ Diagnostics: { AiPopulate: 'failed' } })).toBe(true);
  });

  it('returns false for succeeded, skipped, or missing diagnostics', () => {
    expect(isAiPopulateFailed({ Diagnostics: { AiPopulate: 'succeeded' } })).toBe(false);
    expect(isAiPopulateFailed({ Diagnostics: { AiPopulate: 'skipped' } })).toBe(false);
    expect(isAiPopulateFailed({ Title: 'Widget' })).toBe(false);
    expect(isAiPopulateFailed(null)).toBe(false);
    expect(isAiPopulateFailed(undefined)).toBe(false);
  });
});
