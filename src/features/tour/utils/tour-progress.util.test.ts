import { describe, expect, test } from 'vitest';
import { EMPTY_TOUR_STATE, type TourState } from 'features/auth';
import {
  firstPendingChapterId,
  nextAdvancedChapterId,
  shouldAutoStartTour,
} from './tour-progress.util';

const allEligible = { canShowAi: true, canAutoAdd: true };
const noAi = { canShowAi: false, canAutoAdd: false };

describe('shouldAutoStartTour', () => {
  test('requires onboarded and not dismissed', () => {
    expect(shouldAutoStartTour(true, { ...EMPTY_TOUR_STATE })).toBe(true);
    expect(shouldAutoStartTour(false, { ...EMPTY_TOUR_STATE })).toBe(false);
    expect(shouldAutoStartTour(undefined, { ...EMPTY_TOUR_STATE })).toBe(false);
    expect(shouldAutoStartTour(true, { FirstRunDismissed: true, Chapters: {} })).toBe(false);
  });
});

describe('firstPendingChapterId', () => {
  test('returns first pending eligible chapter', () => {
    expect(firstPendingChapterId({ ...EMPTY_TOUR_STATE }, allEligible)).toBe('demo');

    const afterDemo: TourState = {
      FirstRunDismissed: false,
      Chapters: { demo: 'completed' },
    };
    expect(firstPendingChapterId(afterDemo, allEligible)).toBe('beginner');
  });

  test('skips importAi when AI unavailable', () => {
    const tour: TourState = {
      FirstRunDismissed: false,
      Chapters: {
        demo: 'completed',
        beginner: 'completed',
      },
    };
    expect(firstPendingChapterId(tour, noAi)).toBe('listTools');
    expect(firstPendingChapterId(tour, allEligible)).toBe('importAi');
  });

  test('returns null when all eligible chapters done', () => {
    const tour: TourState = {
      FirstRunDismissed: true,
      Chapters: {
        demo: 'completed',
        beginner: 'completed',
        listTools: 'skipped',
        shareDeep: 'completed',
        friendsDeep: 'completed',
        notifications: 'completed',
        theming: 'completed',
      },
    };
    expect(firstPendingChapterId(tour, noAi)).toBeNull();
  });
});

describe('nextAdvancedChapterId', () => {
  test('returns first pending chapter after beginner by default', () => {
    const tour: TourState = {
      FirstRunDismissed: false,
      Chapters: { demo: 'completed', beginner: 'completed' },
    };
    expect(nextAdvancedChapterId(tour, allEligible)).toBe('importAi');
    expect(nextAdvancedChapterId(tour, noAi)).toBe('listTools');
  });

  test('advances from a mid chapter', () => {
    const tour: TourState = {
      FirstRunDismissed: false,
      Chapters: {
        demo: 'completed',
        beginner: 'completed',
        importAi: 'completed',
        listTools: 'completed',
      },
    };
    expect(nextAdvancedChapterId(tour, allEligible, 'listTools')).toBe('shareDeep');
  });

  test('returns null when no pending advanced chapters remain', () => {
    const tour: TourState = {
      FirstRunDismissed: false,
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
    expect(nextAdvancedChapterId(tour, allEligible, 'theming')).toBeNull();
  });
});
