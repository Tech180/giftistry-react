/** Matches the comments drawer sheet breakpoint (`shared/ui/drawer`). */
export const COMMENT_SHEET_MOBILE_QUERY = '(max-width: 48rem)';

/** Matches `--panel-slide-duration` so the sheet can finish closing. */
export const COMMENT_TAG_PEEK_CLOSE_MS = 320;

/**
 * Upper bound for smooth `scrollIntoView` on long lists when `scrollend` is missing.
 * Reopen waits for scroll settle (or this fallback), then the dwell.
 */
export const COMMENT_TAG_PEEK_SCROLL_FALLBACK_MS = 2000;

/** How long to leave the list visible after scroll settles before reopening comments. */
export const COMMENT_TAG_PEEK_DWELL_MS = 2000;

/** Matches continuous `.item-card-wrapper-highlighted` pulse while the class is applied. */
export const ITEM_CARD_HIGHLIGHT_DURATION_MS = 2000;
