import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  highlightWishlistItemCard,
  peekHighlightWishlistItemCard,
} from './highlight-wishlist-item-card.util';

describe('highlightWishlistItemCard', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('scrolls to the card and toggles the highlight class', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    const card = document.createElement('div');
    card.id = 'item-card-gift-1';
    card.scrollIntoView = vi.fn();
    document.body.appendChild(card);

    highlightWishlistItemCard('gift-1', 'is-highlighted', 1500);

    expect(card.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(card.classList.contains('is-highlighted')).toBe(true);

    vi.advanceTimersByTime(1500);
    expect(card.classList.contains('is-highlighted')).toBe(false);
  });

  it('does nothing when the card is missing', () => {
    expect(() => highlightWishlistItemCard('missing', 'is-highlighted', 1500)).not.toThrow();
  });
});

describe('peekHighlightWishlistItemCard', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('waits for scroll settle then dwell before clearing highlight', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    const card = document.createElement('div');
    card.id = 'item-card-gift-2';
    card.scrollIntoView = vi.fn();
    document.body.appendChild(card);

    const peekPromise = peekHighlightWishlistItemCard('gift-2', 'is-highlighted', {
      dwellMs: 2000,
      scrollFallbackMs: 2000,
    });

    expect(card.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
    expect(card.classList.contains('is-highlighted')).toBe(true);

    // No scroll events: idle settle (~100ms) then dwell 2000ms
    await vi.advanceTimersByTimeAsync(100);
    expect(card.classList.contains('is-highlighted')).toBe(true);

    await vi.advanceTimersByTimeAsync(2000);
    await peekPromise;
    expect(card.classList.contains('is-highlighted')).toBe(false);
  });

  it('scrolls back to returnToItemId without a second highlight', async () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: false } as MediaQueryList);

    const target = document.createElement('div');
    target.id = 'item-card-gift-4';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);

    const source = document.createElement('div');
    source.id = 'item-card-gift-source';
    source.scrollIntoView = vi.fn();
    document.body.appendChild(source);

    const peekPromise = peekHighlightWishlistItemCard('gift-4', 'is-highlighted', {
      dwellMs: 500,
      scrollFallbackMs: 2000,
      returnToItemId: 'gift-source',
    });

    expect(target.scrollIntoView).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(500);
    expect(target.classList.contains('is-highlighted')).toBe(false);

    await peekPromise;
    expect(source.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'center' });
    expect(source.classList.contains('is-highlighted')).toBe(false);
  });
});
