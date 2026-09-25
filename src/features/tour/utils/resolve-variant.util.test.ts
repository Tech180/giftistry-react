import { describe, expect, test, vi } from 'vitest';
import type { TourStepDef } from '../interfaces/step-def.interface';
import { isTourMobileViewport, resolveStepVariant } from './resolve-variant.util';

const baseStep: TourStepDef = {
  id: 'sample',
  chapterId: 'beginner',
  title: 'Sample',
  body: 'Body',
  desktop: { target: 'create-wishlist', placement: 'bottom' },
  mobile: { target: 'create-wishlist-fab', placement: 'top', beforeShow: 'openFab' },
};

describe('resolveStepVariant', () => {
  test('returns empty variant for centered steps without beforeShow', () => {
    const centered: TourStepDef = {
      ...baseStep,
      center: true,
      desktop: { target: 'create-wishlist', placement: 'bottom' },
      mobile: { target: 'create-wishlist-fab', placement: 'top' },
    };
    expect(resolveStepVariant(centered, false)).toEqual({});
    expect(resolveStepVariant(centered, true)).toEqual({});
  });

  test('keeps beforeShow on centered steps', () => {
    const centered: TourStepDef = {
      ...baseStep,
      center: true,
      desktop: { beforeShow: 'navigateDashboard' },
      mobile: { beforeShow: 'navigateDashboard' },
    };
    expect(resolveStepVariant(centered, false)).toEqual({ beforeShow: 'navigateDashboard' });
    expect(resolveStepVariant(centered, true)).toEqual({ beforeShow: 'navigateDashboard' });
  });

  test('prefers mobile when mobile viewport', () => {
    expect(resolveStepVariant(baseStep, true)).toEqual(baseStep.mobile);
  });

  test('prefers desktop when desktop viewport', () => {
    expect(resolveStepVariant(baseStep, false)).toEqual(baseStep.desktop);
  });

  test('falls back across viewport when one side missing', () => {
    const desktopOnly: TourStepDef = {
      ...baseStep,
      mobile: undefined,
    };
    expect(resolveStepVariant(desktopOnly, true)).toEqual(desktopOnly.desktop);

    const mobileOnly: TourStepDef = {
      ...baseStep,
      desktop: undefined,
    };
    expect(resolveStepVariant(mobileOnly, false)).toEqual(mobileOnly.mobile);
  });
});

describe('isTourMobileViewport', () => {
  test('reads matchMedia result', () => {
    const matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(isTourMobileViewport(matchMedia)).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(max-width: 48rem)');

    matchMedia.mockReturnValue({ matches: false });
    expect(isTourMobileViewport(matchMedia)).toBe(false);
  });
});
