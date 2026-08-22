import { describe, expect, test } from 'vitest';
import {
  AI_HELPER_MANUAL_SUFFIX,
  ENRICH_FAILURE_FALLBACK,
} from '../constants/ai-helper-failure.constants';
import { formatAiHelperFailure } from './format-ai-helper-failure.util';

describe('formatAiHelperFailure', () => {
  test('uses the error message and appends the manual suffix', () => {
    expect(formatAiHelperFailure(new Error('network'), ENRICH_FAILURE_FALLBACK)).toBe(
      `network\n${AI_HELPER_MANUAL_SUFFIX}`
    );
  });

  test('strips a trailing Original error section', () => {
    const err = new Error(
      'Playwright’s bundled Chromium cannot run on NixOS.\nOriginal error: stub-ld'
    );
    expect(formatAiHelperFailure(err, ENRICH_FAILURE_FALLBACK)).toBe(
      `Playwright’s bundled Chromium cannot run on NixOS.\n${AI_HELPER_MANUAL_SUFFIX}`
    );
  });

  test('falls back when the error has no message', () => {
    expect(formatAiHelperFailure({}, ENRICH_FAILURE_FALLBACK)).toBe(
      `${ENRICH_FAILURE_FALLBACK}\n${AI_HELPER_MANUAL_SUFFIX}`
    );
  });

  test('does not duplicate the manual suffix', () => {
    const message = `${ENRICH_FAILURE_FALLBACK} ${AI_HELPER_MANUAL_SUFFIX}`;
    expect(formatAiHelperFailure(new Error(message), ENRICH_FAILURE_FALLBACK)).toBe(message);
  });
});
