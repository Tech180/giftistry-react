import { afterEach, describe, expect, test, vi } from 'vitest';
import { ADVANCED_TOKENS_FALLBACK } from '../constants/advanced-tokens-fallback.constant';
import { readComputedAdvancedTokens } from './read-computed-advanced-tokens.util';

describe('readComputedAdvancedTokens', () => {
  const originalDocument = globalThis.document;
  const originalGetComputedStyle = globalThis.getComputedStyle;

  afterEach(() => {
    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'getComputedStyle', {
      value: originalGetComputedStyle,
      configurable: true,
      writable: true,
    });
    vi.restoreAllMocks();
  });

  function mockComputed(values: Record<string, string>) {
    Object.defineProperty(globalThis, 'document', {
      value: { documentElement: {} },
      configurable: true,
      writable: true,
    });
    Object.defineProperty(globalThis, 'getComputedStyle', {
      value: () => ({
        getPropertyValue: (name: string) => values[name] ?? '',
      }),
      configurable: true,
      writable: true,
    });
  }

  test('reads app CSS vars that applyCustomTheme writes', () => {
    const values: Record<string, string> = {
      '--shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
      '--shadow': '0 4px 30px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      '--font-family-body': "'Inter', system-ui, sans-serif",
      '--radius': '0.5rem',
    };
    mockComputed(values);

    expect(readComputedAdvancedTokens()).toEqual({
      shadows: {
        sm: values['--shadow-sm'],
        md: values['--shadow'],
        lg: values['--shadow-lg'],
      },
      fonts: { sans: values['--font-family-body'] },
      radius: { default: values['--radius'] },
    });
  });

  test('falls back to theme aliases then engine-aligned constant', () => {
    const values: Record<string, string> = {
      '--theme-shadow': '0 4px 30px rgba(0, 0, 0, 0.5)',
      '--theme-font-body': "'Inter', system-ui, sans-serif",
      '--theme-radius': '0.5rem',
    };
    mockComputed(values);

    expect(readComputedAdvancedTokens()).toEqual({
      shadows: {
        sm: values['--theme-shadow'],
        md: values['--theme-shadow'],
        lg: values['--theme-shadow'],
      },
      fonts: { sans: values['--theme-font-body'] },
      radius: { default: values['--theme-radius'] },
    });
  });

  test('uses ADVANCED_TOKENS_FALLBACK when nothing is set', () => {
    mockComputed({});

    expect(readComputedAdvancedTokens()).toEqual(ADVANCED_TOKENS_FALLBACK);
  });
});
