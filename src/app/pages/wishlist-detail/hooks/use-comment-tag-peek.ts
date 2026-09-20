import { useCallback, useEffect, useRef, useState } from 'react';
import {
  COMMENT_SHEET_MOBILE_QUERY,
  COMMENT_TAG_PEEK_CLOSE_MS,
  COMMENT_TAG_PEEK_DWELL_MS,
  COMMENT_TAG_PEEK_SCROLL_FALLBACK_MS,
  ITEM_CARD_HIGHLIGHT_DURATION_MS,
} from '../constants/comment-tag-peek.constant';
import type { UseCommentTagPeekOptions } from '../interfaces/use-comment-tag-peek-options.interface';
import type { UseCommentTagPeekResult } from '../interfaces/use-comment-tag-peek-result.interface';
import { highlightItemCard, peekHighlightItemCard } from '../utils/highlight-item-card.util';
import { shouldPeekCommentTag } from '../utils/should-peek-comment-tag.util';
import styles from '../page.module.css';

export function useCommentTagPeek({
  isCommentsOpen,
  setIsCommentsOpen,
  isTaggingModeActive,
  isReplyTaggingModeActive,
}: UseCommentTagPeekOptions): UseCommentTagPeekResult {
  const commentTagPeekTimeoutsRef = useRef<{ highlight: number | null; reopen: number | null }>({
    highlight: null,
    reopen: null,
  });
  const commentTagPeekGenerationRef = useRef(0);
  const highlightUnlockTimeoutRef = useRef<number | null>(null);
  const [isHighlightInteractionLocked, setIsHighlightInteractionLocked] = useState(false);

  const clearHighlightUnlockTimeout = () => {
    if (highlightUnlockTimeoutRef.current !== null) {
      window.clearTimeout(highlightUnlockTimeoutRef.current);
      highlightUnlockTimeoutRef.current = null;
    }
  };

  const clearCommentTagPeekTimeouts = () => {
    commentTagPeekGenerationRef.current += 1;
    if (commentTagPeekTimeoutsRef.current.highlight !== null) {
      window.clearTimeout(commentTagPeekTimeoutsRef.current.highlight);
      commentTagPeekTimeoutsRef.current.highlight = null;
    }
    if (commentTagPeekTimeoutsRef.current.reopen !== null) {
      window.clearTimeout(commentTagPeekTimeoutsRef.current.reopen);
      commentTagPeekTimeoutsRef.current.reopen = null;
    }
  };

  useEffect(() => {
    const peekTimeoutsRef = commentTagPeekTimeoutsRef;
    const unlockTimeoutRef = highlightUnlockTimeoutRef;
    return () => {
      if (peekTimeoutsRef.current.highlight !== null) {
        window.clearTimeout(peekTimeoutsRef.current.highlight);
      }
      if (peekTimeoutsRef.current.reopen !== null) {
        window.clearTimeout(peekTimeoutsRef.current.reopen);
      }
      if (unlockTimeoutRef.current !== null) {
        window.clearTimeout(unlockTimeoutRef.current);
      }
      setIsHighlightInteractionLocked(false);
    };
  }, []);

  const handleItemTaggedClick = useCallback(
    (itemId: string, returnToItemId?: string) => {
      const isMobileSheet =
        typeof window !== 'undefined' && window.matchMedia(COMMENT_SHEET_MOBILE_QUERY).matches;
      const shouldPeek = shouldPeekCommentTag({
        isMobileSheet,
        isCommentsOpen,
        isCommentTaggingActive: isTaggingModeActive || isReplyTaggingModeActive,
      });

      clearHighlightUnlockTimeout();
      setIsHighlightInteractionLocked(true);

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const shouldReturnAfterPeek = !!returnToItemId && returnToItemId !== itemId;
      const highlightClass = styles['page__item-highlight'] ?? '';

      if (!shouldPeek && !shouldReturnAfterPeek) {
        clearCommentTagPeekTimeouts();
        highlightItemCard(itemId, highlightClass, ITEM_CARD_HIGHLIGHT_DURATION_MS);
        const unlockMs = prefersReducedMotion ? 0 : ITEM_CARD_HIGHLIGHT_DURATION_MS;
        highlightUnlockTimeoutRef.current = window.setTimeout(() => {
          highlightUnlockTimeoutRef.current = null;
          setIsHighlightInteractionLocked(false);
        }, unlockMs);
        return;
      }

      clearCommentTagPeekTimeouts();
      const peekGeneration = ++commentTagPeekGenerationRef.current;

      if (shouldPeek) {
        setIsCommentsOpen(false);
      }

      const closeDelayMs = shouldPeek && !prefersReducedMotion ? COMMENT_TAG_PEEK_CLOSE_MS : 0;

      commentTagPeekTimeoutsRef.current.highlight = window.setTimeout(() => {
        void (async () => {
          try {
            await peekHighlightItemCard(itemId, highlightClass, {
              dwellMs: prefersReducedMotion ? 0 : COMMENT_TAG_PEEK_DWELL_MS,
              scrollFallbackMs: prefersReducedMotion ? 0 : COMMENT_TAG_PEEK_SCROLL_FALLBACK_MS,
              returnToItemId: shouldReturnAfterPeek ? returnToItemId : undefined,
            });
          } finally {
            if (peekGeneration !== commentTagPeekGenerationRef.current) {
              return;
            }
            if (shouldPeek) {
              setIsCommentsOpen(true);
            }
            setIsHighlightInteractionLocked(false);
          }
        })();
      }, closeDelayMs);
    },
    [isCommentsOpen, isTaggingModeActive, isReplyTaggingModeActive, setIsCommentsOpen]
  );

  return {
    isHighlightInteractionLocked,
    handleItemTaggedClick,
  };
}
