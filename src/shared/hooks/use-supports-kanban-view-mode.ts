import { useEffect, useState } from 'react';
import { KANBAN_VIEW_MODE_MIN_WIDTH_MEDIA_QUERY } from 'features/items/constants/item-view-mode.constants';

export function useSupportsKanbanViewMode(): boolean {
  const [supportsKanban, setSupportsKanban] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(KANBAN_VIEW_MODE_MIN_WIDTH_MEDIA_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(KANBAN_VIEW_MODE_MIN_WIDTH_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setSupportsKanban(event.matches);
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

  return supportsKanban;
}
