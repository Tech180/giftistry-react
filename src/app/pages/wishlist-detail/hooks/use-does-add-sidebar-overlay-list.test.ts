import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { OVERLAY_BREAKPOINT_MEDIA_QUERY } from '../constants/overlay-breakpoint.constant';
import { useDoesAddSidebarOverlayList } from './use-does-add-sidebar-overlay-list';

type MediaQueryListener = (event: MediaQueryListEvent | MediaQueryList) => void;

describe('useDoesAddSidebarOverlayList', () => {
  let overlayMatches = false;
  let listeners: MediaQueryListener[] = [];

  beforeEach(() => {
    overlayMatches = false;
    listeners = [];

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return query === OVERLAY_BREAKPOINT_MEDIA_QUERY ? overlayMatches : false;
        },
        media: query,
        onchange: null,
        addListener: (listener: MediaQueryListener) => {
          if (query === OVERLAY_BREAKPOINT_MEDIA_QUERY) {
            listeners.push(listener);
          }
        },
        removeListener: (listener: MediaQueryListener) => {
          listeners = listeners.filter((item) => item !== listener);
        },
        addEventListener: (_type: string, listener: MediaQueryListener) => {
          if (query === OVERLAY_BREAKPOINT_MEDIA_QUERY) {
            listeners.push(listener);
          }
        },
        removeEventListener: (_type: string, listener: MediaQueryListener) => {
          listeners = listeners.filter((item) => item !== listener);
        },
        dispatchEvent: () => false,
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns true when viewport is below the overlay breakpoint', () => {
    overlayMatches = false;

    const { result } = renderHook(() => useDoesAddSidebarOverlayList());

    expect(result.current).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(OVERLAY_BREAKPOINT_MEDIA_QUERY);
  });

  test('returns false when viewport meets the overlay breakpoint', () => {
    overlayMatches = true;

    const { result } = renderHook(() => useDoesAddSidebarOverlayList());

    expect(result.current).toBe(false);
  });

  test('updates when the media query change event fires', () => {
    overlayMatches = true;

    const { result } = renderHook(() => useDoesAddSidebarOverlayList());
    expect(result.current).toBe(false);

    act(() => {
      overlayMatches = false;
      listeners.forEach((listener) => {
        listener({ matches: false, media: OVERLAY_BREAKPOINT_MEDIA_QUERY } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(true);

    act(() => {
      overlayMatches = true;
      listeners.forEach((listener) => {
        listener({ matches: true, media: OVERLAY_BREAKPOINT_MEDIA_QUERY } as MediaQueryListEvent);
      });
    });

    expect(result.current).toBe(false);
  });
});
