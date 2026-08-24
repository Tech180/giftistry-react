import { afterEach, describe, expect, it, vi } from 'vitest';
import { delay, waitForScrollSettle } from './wait-for-scroll-settle.util';

describe('waitForScrollSettle', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves quickly when no scroll occurs', async () => {
    vi.useFakeTimers();
    const promise = waitForScrollSettle(2000);
    await vi.advanceTimersByTimeAsync(100);
    await expect(promise).resolves.toBeUndefined();
  });

  it('resolves on scrollend after scroll activity', async () => {
    vi.useFakeTimers();
    const promise = waitForScrollSettle(5000);
    window.dispatchEvent(new Event('scroll', { bubbles: true }));
    window.dispatchEvent(new Event('scrollend', { bubbles: true }));
    await expect(promise).resolves.toBeUndefined();
  });

  it('falls back when scroll never ends', async () => {
    vi.useFakeTimers();
    const promise = waitForScrollSettle(1500);
    window.dispatchEvent(new Event('scroll', { bubbles: true }));
    await vi.advanceTimersByTimeAsync(1500);
    await expect(promise).resolves.toBeUndefined();
  });
});

describe('delay', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('resolves after the given ms', async () => {
    vi.useFakeTimers();
    const promise = delay(500);
    await vi.advanceTimersByTimeAsync(500);
    await expect(promise).resolves.toBeUndefined();
  });
});
