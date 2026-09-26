import { useEffect, useState } from 'react';
import { OVERLAY_BREAKPOINT_MEDIA_QUERY } from '../constants/overlay-breakpoint.constant';

/** `true` when viewport is below 75rem — drawer overlays the list instead of shifting layout. */
export function useDoesAddSidebarOverlayList(): boolean {
  const [doesAddSidebarOverlayList, setDoesAddSidebarOverlayList] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return true;
    }
    return !window.matchMedia(OVERLAY_BREAKPOINT_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(OVERLAY_BREAKPOINT_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setDoesAddSidebarOverlayList(!event.matches);
    };

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return doesAddSidebarOverlayList;
}
