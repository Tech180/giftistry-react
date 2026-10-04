import {
  COMMENT_HIGHLIGHT_CLASS,
  commentHighlightSelector,
} from '../constants/comment-highlight.constant';

function scrollCommentIntoView(element: HTMLElement, prefersReducedMotion: boolean): void {
  element.scrollIntoView({
    behavior: prefersReducedMotion ? 'auto' : 'smooth',
    block: 'center',
  });
}

export function highlightCommentElement(
  commentId: string,
  container: HTMLElement | null | undefined,
  durationMs: number,
  highlightClass: string = COMMENT_HIGHLIGHT_CLASS
): boolean {
  const root = container ?? document;
  const element = root.querySelector<HTMLElement>(commentHighlightSelector(commentId));
  if (!element) {
    return false;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scrollCommentIntoView(element, prefersReducedMotion);
  element.classList.add(highlightClass);
  window.setTimeout(() => {
    element.classList.remove(highlightClass);
  }, durationMs);

  return true;
}
