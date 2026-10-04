import {
  COMMENT_HIGHLIGHT_MAX_WAIT_MS,
  COMMENT_HIGHLIGHT_POLL_MS,
  commentHighlightSelector,
} from '../constants/comment-highlight.constant';

function findCommentElement(
  commentId: string,
  container: HTMLElement | null | undefined
): HTMLElement | null {
  const root = container ?? document;
  return root.querySelector<HTMLElement>(commentHighlightSelector(commentId));
}

export function waitForCommentElement(
  commentId: string,
  container: HTMLElement | null | undefined,
  maxWaitMs: number = COMMENT_HIGHLIGHT_MAX_WAIT_MS,
  pollMs: number = COMMENT_HIGHLIGHT_POLL_MS
): Promise<HTMLElement | null> {
  const existing = findCommentElement(commentId, container);
  if (existing) {
    return Promise.resolve(existing);
  }

  return new Promise((resolve) => {
    const startedAt = Date.now();

    const tick = () => {
      const element = findCommentElement(commentId, container);
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= maxWaitMs) {
        resolve(null);
        return;
      }

      window.setTimeout(tick, pollMs);
    };

    window.requestAnimationFrame(tick);
  });
}
