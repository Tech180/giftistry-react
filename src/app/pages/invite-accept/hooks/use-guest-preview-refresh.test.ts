import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useGuestPreviewRefresh } from './use-guest-preview-refresh';

describe('useGuestPreviewRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('polls while tab is visible when enabled', async () => {
    const reload = vi.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useGuestPreviewRefresh({
        enabled: true,
        reload,
        pollIntervalMs: 1000,
        debounceMs: 50,
      })
    );

    expect(reload).not.toHaveBeenCalled();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(reload).toHaveBeenCalledTimes(1);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(reload).toHaveBeenCalledTimes(2);
  });

  test('does not poll when disabled', async () => {
    const reload = vi.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useGuestPreviewRefresh({
        enabled: false,
        reload,
        pollIntervalMs: 1000,
      })
    );
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(reload).not.toHaveBeenCalled();
  });

  test('focus schedules a debounced reload', async () => {
    const reload = vi.fn().mockResolvedValue(undefined);
    renderHook(() =>
      useGuestPreviewRefresh({
        enabled: true,
        reload,
        pollIntervalMs: 60_000,
        debounceMs: 100,
      })
    );

    await act(async () => {
      window.dispatchEvent(new Event('focus'));
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(reload).toHaveBeenCalledTimes(1);
  });

  test('visibility hidden stops the interval', async () => {
    const reload = vi.fn().mockResolvedValue(undefined);
    let visibility: DocumentVisibilityState = 'visible';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => visibility,
    });

    renderHook(() =>
      useGuestPreviewRefresh({
        enabled: true,
        reload,
        pollIntervalMs: 1000,
        debounceMs: 50,
      })
    );

    visibility = 'hidden';
    await act(async () => {
      document.dispatchEvent(new Event('visibilitychange'));
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(reload).not.toHaveBeenCalled();
  });
});
