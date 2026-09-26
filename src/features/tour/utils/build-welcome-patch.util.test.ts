import { describe, expect, test } from 'vitest';
import type { TourState } from 'features/auth';
import { buildWelcomePatch, isWelcomeEnabled } from './build-welcome-patch.util';

const eligibility = { canShowAi: true, canAutoAdd: true };

describe('isWelcomeEnabled', () => {
  test('is true when FirstRunDismissed is missing or false', () => {
    expect(isWelcomeEnabled(undefined)).toBe(true);
    expect(isWelcomeEnabled({ FirstRunDismissed: false, Chapters: {} })).toBe(true);
  });

  test('is false when FirstRunDismissed is true', () => {
    expect(isWelcomeEnabled({ FirstRunDismissed: true, Chapters: {} })).toBe(false);
  });
});

describe('buildWelcomePatch', () => {
  test('disabling only dismisses first run', () => {
    expect(buildWelcomePatch(false, { FirstRunDismissed: false, Chapters: {} }, eligibility)).toEqual({
      FirstRunDismissed: true,
    });
  });

  test('enabling with a pending chapter does not reset all', () => {
    const tour: TourState = {
      FirstRunDismissed: true,
      Chapters: { demo: 'completed' },
    };
    expect(buildWelcomePatch(true, tour, eligibility)).toEqual({
      FirstRunDismissed: false,
    });
  });

  test('enabling with no pending chapters resets all', () => {
    const tour: TourState = {
      FirstRunDismissed: true,
      Chapters: {
        demo: 'completed',
        beginner: 'completed',
        importAi: 'skipped',
        listTools: 'completed',
        shareDeep: 'completed',
        friendsDeep: 'completed',
        notifications: 'completed',
        theming: 'completed',
      },
    };
    expect(buildWelcomePatch(true, tour, eligibility)).toEqual({
      FirstRunDismissed: false,
      ResetAll: true,
    });
  });
});
