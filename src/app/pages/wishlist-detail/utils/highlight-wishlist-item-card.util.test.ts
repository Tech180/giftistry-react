import { afterEach, describe, expect, it, vi } from 'vitest';
import { highlightWishlistItemCard } from './highlight-wishlist-item-card.util';

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
