/** Global class for comment attention pulse (shared with item peek). */
export const COMMENT_HIGHLIGHT_CLASS = 'attention-pulse';

/** How long the pulse class stays applied after scroll-into-view. */
export const COMMENT_HIGHLIGHT_DURATION_MS = 2000;

export const COMMENT_HIGHLIGHT_DATA_ATTR = 'data-comment-id';

/** Aligns with `--panel-slide-duration` before scrolling on mobile sheet. */
export const COMMENT_HIGHLIGHT_PANEL_OPEN_DELAY_MS = 320;

export const COMMENT_HIGHLIGHT_POLL_MS = 120;

export const COMMENT_HIGHLIGHT_MAX_WAIT_MS = 8000;

export function commentHighlightSelector(commentId: string): string {
  return `[${COMMENT_HIGHLIGHT_DATA_ATTR}="${CSS.escape(commentId)}"]`;
}
