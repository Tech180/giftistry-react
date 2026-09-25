import type { TourStepDef, TourStepVariant } from '../interfaces/step-def.interface';
import { TOUR_MOBILE_MEDIA_QUERY } from '../constants/storage-keys.constant';

export function isTourMobileViewport(matchMedia: (query: string) => MediaQueryList = window.matchMedia): boolean {
  return matchMedia(TOUR_MOBILE_MEDIA_QUERY).matches;
}

export function resolveStepVariant(step: TourStepDef, isMobile: boolean): TourStepVariant {
  const viewport = isMobile ? (step.mobile ?? step.desktop ?? {}) : (step.desktop ?? step.mobile ?? {});

  // Centered cards still need beforeShow (e.g. leave the demo list for the dashboard).
  if (step.center) {
    return viewport.beforeShow ? { beforeShow: viewport.beforeShow } : {};
  }

  return viewport;
}
