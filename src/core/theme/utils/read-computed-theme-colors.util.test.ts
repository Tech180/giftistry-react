import { afterEach, describe, expect, test, vi } from 'vitest';
import { THEME_COLORS_FALLBACK } from '../constants/theme-colors-fallback.constant';
import { readComputedThemeColors } from './read-computed-theme-colors.util';

describe('readComputedThemeColors', () => {
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

  test('reads app CSS vars as hex', () => {
    mockComputed({
      '--primary': '#5e6ad2',
      '--bg': 'rgb(15, 15, 16)',
      '--surface': '#151516',
      '--border': 'rgba(255, 255, 255, 0.08)',
      '--text': '#f7f8f8',
      '--text-muted': '#8a8f98',
    });

    expect(readComputedThemeColors()).toEqual({
      primary: '#5e6ad2',
      bg: '#0f0f10',
      surface: '#151516',
      border: '#ffffff',
      text: '#f7f8f8',
      'text-muted': '#8a8f98',
    });
  });

  test('falls back to theme aliases', () => {
    mockComputed({
      '--theme-primary': '#ff0055',
      '--theme-bg': '#0a0a0a',
      '--theme-surface': '#111111',
      '--theme-border': '#222222',
      '--theme-text': '#eeeeee',
      '--theme-text-muted': '#999999',
    });

    expect(readComputedThemeColors()).toEqual({
      primary: '#ff0055',
      bg: '#0a0a0a',
      surface: '#111111',
      border: '#222222',
      text: '#eeeeee',
      'text-muted': '#999999',
    });
  });

  test('uses THEME_COLORS_FALLBACK when nothing is set', () => {
    mockComputed({});

    expect(readComputedThemeColors()).toEqual(THEME_COLORS_FALLBACK);
  });
});
