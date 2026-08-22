import { SETTINGS_MOBILE_LAYOUT_QUERY } from '../constants/mobile-layout-query.constant';

export function prefersCollapsedMobilePanel(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(SETTINGS_MOBILE_LAYOUT_QUERY).matches;
}
