import { ITEM_CARD_ELEMENT_ID_PREFIX } from '../constants/item-card-element-id-prefix.constant';
import type { PeekHighlightItemCardOptions } from '../interfaces/peek-highlight-item-card-options.interface';
import { delay, waitForScrollSettle } from './wait-for-scroll-settle.util';

function getItemCardElement(itemId: string): HTMLElement | null {
  return document.getElementById(`${ITEM_CARD_ELEMENT_ID_PREFIX}${itemId}`);
}

function scrollItemCardIntoView(element: HTMLElement, prefersReducedMotion: boolean): void {
  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center',
  });
}

export function highlightItemCard(itemId: string, highlightClass: string, durationMs: number): void {
  const element = getItemCardElement(itemId);
  if (!element) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollItemCardIntoView(element, prefersReducedMotion);
  element.classList.add(highlightClass);
  window.setTimeout(() => {
    element.classList.remove(highlightClass);
  }, durationMs);
}

/**
 * Scrolls to the card, keeps it highlighted through scroll settle + dwell, then clears highlight.
 * When `returnToItemId` is set, scrolls back to that card without a second highlight.
 */
export async function peekHighlightItemCard(
  itemId: string,
  highlightClass: string,
  options: PeekHighlightItemCardOptions
): Promise<void> {
  const element = getItemCardElement(itemId);
  if (!element) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollItemCardIntoView(element, prefersReducedMotion);
  element.classList.add(highlightClass);

  try {
    if (!prefersReducedMotion) {
      await waitForScrollSettle(options.scrollFallbackMs);
    }
    await delay(options.dwellMs);
  } finally {
    element.classList.remove(highlightClass);
  }

  const returnToItemId = options.returnToItemId;
  if (!returnToItemId || returnToItemId === itemId) {
    return;
  }

  const returnElement = getItemCardElement(returnToItemId);
  if (!returnElement) {
    return;
  }

  returnElement.scrollIntoView({ behavior: 'auto', block: 'center' });
}
