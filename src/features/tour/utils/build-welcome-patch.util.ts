import type { TourState, TutorialPatchPayload } from 'features/auth';
import type { TourEligibilityContext } from '../constants/chapters.constant';
import { firstPendingChapterId, normalizeClientTour } from './tour-progress.util';

/** Show welcome is on when first-run has not been dismissed. */
export function isWelcomeEnabled(tour: TourState | null | undefined): boolean {
  return tour?.FirstRunDismissed !== true;
}

/**
 * Build the tutorial PATCH for the Show welcome preference.
 * Enabling with no pending chapters also resets all chapter progress so welcome can appear again.
 */
export function buildWelcomePatch(
  enabled: boolean,
  tour: TourState | null | undefined,
  eligibility: TourEligibilityContext
): TutorialPatchPayload {
  if (!enabled) {
    return { FirstRunDismissed: true };
  }

  const normalized = normalizeClientTour(tour);
  const pending = firstPendingChapterId(normalized, eligibility);

  return {
    FirstRunDismissed: false,
    ...(pending === null ? { ResetAll: true } : {}),
  };
}
