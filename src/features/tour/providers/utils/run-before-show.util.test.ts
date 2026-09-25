import { afterEach, describe, expect, it, vi } from 'vitest';
import { TOUR_TARGETS } from '../../constants/targets.constant';
import { ensureFabOpen, ensureShareClosed, retryUntil } from './run-before-show.util';

describe('retryUntil', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('stops when the attempt succeeds', () => {
    vi.useFakeTimers();
    let calls = 0;

    retryUntil(() => {
      calls += 1;
      return calls >= 3;
    }, { intervalMs: 50, maxMs: 1000 });

    expect(calls).toBe(1);
    vi.advanceTimersByTime(50);
    expect(calls).toBe(2);
    vi.advanceTimersByTime(50);
    expect(calls).toBe(3);
    vi.advanceTimersByTime(200);
    expect(calls).toBe(3);
  });
});

describe('ensureFabOpen', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('clicks the page-actions FAB once it mounts and opens the create tool', () => {
    vi.useFakeTimers();

    const fab = document.createElement('button');
    fab.setAttribute('aria-label', 'Page actions');
    fab.addEventListener('click', () => {
      const action = document.createElement('button');
      action.setAttribute('data-tour', TOUR_TARGETS.createWishlistFabAction);
      document.body.appendChild(action);
    });

    // FAB mounts after a short delay (dashboard register race).
    window.setTimeout(() => {
      document.body.appendChild(fab);
    }, 200);

    ensureFabOpen();

    vi.advanceTimersByTime(200);
    expect(document.querySelector(`[data-tour="${TOUR_TARGETS.createWishlistFabAction}"]`)).toBeNull();

    vi.advanceTimersByTime(150);
    expect(document.querySelector(`[data-tour="${TOUR_TARGETS.createWishlistFabAction}"]`)).toBeTruthy();
  });
});

describe('ensureShareClosed', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('clicks the Share Wishlist modal close control', () => {
    vi.useFakeTimers();

    const dialog = document.createElement('div');
    dialog.setAttribute('role', 'dialog');
    const title = document.createElement('h3');
    title.textContent = 'Share Wishlist';
    const close = document.createElement('button');
    close.setAttribute('aria-label', 'Close modal');
    close.addEventListener('click', () => {
      dialog.remove();
    });
    dialog.append(title, close);
    document.body.appendChild(dialog);

    ensureShareClosed();
    vi.advanceTimersByTime(0);

    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it('clicks the mobile Share FAB panel close control', () => {
    vi.useFakeTimers();

    const panel = document.createElement('div');
    const header = document.createElement('header');
    const title = document.createElement('span');
    title.textContent = 'Share Wishlist';
    const close = document.createElement('button');
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => {
      panel.remove();
    });
    header.append(title, close);
    panel.appendChild(header);
    document.body.appendChild(panel);

    ensureShareClosed();
    vi.advanceTimersByTime(0);

    expect(document.querySelector('header')).toBeNull();
  });
});
