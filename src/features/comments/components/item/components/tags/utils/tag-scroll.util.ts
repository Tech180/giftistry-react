import { TagScrollState } from '../interfaces/tag-scroll-state.interface';

const SCROLL_EDGE_PX = 1;

export function getTagScrollState(element: HTMLElement): TagScrollState {
  const maxScroll = element.scrollHeight - element.clientHeight;
  return {
    canScrollUp: element.scrollTop > SCROLL_EDGE_PX,
    canScrollDown: element.scrollTop < maxScroll - SCROLL_EDGE_PX,
  };
}

export function getTagScrollStep(element: HTMLElement): number {
  const firstTag = element.firstElementChild as HTMLElement | null;
  if (!firstTag) return 0;

  const gap = Number.parseFloat(getComputedStyle(element).rowGap) || 0;
  return firstTag.offsetHeight + gap;
}

export function scrollTagsByOne(element: HTMLElement, direction: 1 | -1): void {
  const step = getTagScrollStep(element);
  if (step === 0) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollBy({
    top: direction * step,
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
  });
}
