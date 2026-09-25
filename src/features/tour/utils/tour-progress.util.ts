import { EMPTY_TOUR_STATE, type TourChapterId, type TourState } from 'features/auth';
import { eligibleChapters, type TourEligibilityContext } from '../constants/chapters.constant';

export function normalizeClientTour(tour: TourState | null | undefined): TourState {
  if (!tour) {
    return { ...EMPTY_TOUR_STATE, Chapters: {} };
  }

  return {
    FirstRunDismissed: tour.FirstRunDismissed === true,
    Chapters: { ...(tour.Chapters ?? {}) },
  };
}

export function chapterStatus(tour: TourState, chapterId: TourChapterId): 'pending' | 'completed' | 'skipped' {
  return tour.Chapters[chapterId] ?? 'pending';
}

export function shouldAutoStartTour(isOnboarded: boolean | undefined, tour: TourState): boolean {
  return isOnboarded === true && tour.FirstRunDismissed !== true;
}

export function firstPendingChapterId(tour: TourState, ctx: TourEligibilityContext): TourChapterId | null {
  for (const chapter of eligibleChapters(ctx)) {
    const status = chapterStatus(tour, chapter.id);
    if (status === 'pending') {
      return chapter.id;
    }
  }

  return null;
}

export function nextAdvancedChapterId(
  tour: TourState,
  ctx: TourEligibilityContext,
  after: TourChapterId = 'beginner'
): TourChapterId | null {
  const chapters = eligibleChapters(ctx);
  const startIndex = chapters.findIndex((chapter) => chapter.id === after);
  const slice = startIndex >= 0 ? chapters.slice(startIndex + 1) : chapters.filter((c) => c.id !== 'demo' && c.id !== 'beginner');

  for (const chapter of slice) {
    if (chapterStatus(tour, chapter.id) === 'pending') {
      return chapter.id;
    }
  }

  return null;
}
