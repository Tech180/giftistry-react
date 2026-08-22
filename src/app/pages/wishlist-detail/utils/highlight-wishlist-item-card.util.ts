const ITEM_CARD_ELEMENT_ID_PREFIX = 'item-card-';

export function highlightWishlistItemCard(
  itemId: string,
  highlightClass: string,
  durationMs: number
): void {
  const element = document.getElementById(`${ITEM_CARD_ELEMENT_ID_PREFIX}${itemId}`);
  if (!element) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center',
  });
  element.classList.add(highlightClass);
  window.setTimeout(() => {
    element.classList.remove(highlightClass);
  }, durationMs);
}
