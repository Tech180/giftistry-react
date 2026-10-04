import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  COMMENT_HIGHLIGHT_CLASS,
  COMMENT_HIGHLIGHT_DURATION_MS,
  COMMENT_HIGHLIGHT_PANEL_OPEN_DELAY_MS,
} from '../../../constants/comment-highlight.constant';
import { COMMENTS_SHEET_MOBILE_QUERY } from '../../../constants/sheet-mobile-query.constant';
import { clearCommentSearchParam } from '../../../utils/clear-comment-search-param.util';
import { delay } from '../../../utils/delay.util';
import { findCommentInTree } from '../../../utils/find-comment-in-tree.util';
import { highlightCommentElement } from '../../../utils/highlight-comment-element.util';
import { waitForCommentElement } from '../../../utils/wait-for-comment-element.util';
import type { UseCommentDeepLinkHighlightInput } from '../interfaces/use-comment-deep-link-highlight-input.interface';
import type { UseCommentDeepLinkHighlightResult } from '../interfaces/use-comment-deep-link-highlight-result.interface';

export function useCommentDeepLinkHighlight({
  comments,
  hasLoadedComments,
  isLoading,
  listContainerRef,
  isDemo,
}: UseCommentDeepLinkHighlightInput): UseCommentDeepLinkHighlightResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const commentIdFromUrl = searchParams.get('comment');

  const [deepLinkThreadExpandTargetId, setDeepLinkThreadExpandTargetId] = useState<string | null>(
    null
  );
  const runGenerationRef = useRef(0);
  const startedForCommentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!commentIdFromUrl) {
      startedForCommentIdRef.current = null;
    }
  }, [commentIdFromUrl]);

  useEffect(() => {
    if (isDemo || !commentIdFromUrl) {
      return;
    }

    if (isLoading || !hasLoadedComments) {
      return;
    }

    if (startedForCommentIdRef.current === commentIdFromUrl) {
      return;
    }

    startedForCommentIdRef.current = commentIdFromUrl;
    const generation = ++runGenerationRef.current;
    let cancelled = false;

    const run = async () => {
      const resolved = findCommentInTree(comments, commentIdFromUrl);
      if (!resolved) {
        if (!cancelled && generation === runGenerationRef.current) {
          clearCommentSearchParam(setSearchParams);
          setDeepLinkThreadExpandTargetId(null);
        }
        return;
      }

      if (cancelled || generation !== runGenerationRef.current) {
        return;
      }

      setDeepLinkThreadExpandTargetId(commentIdFromUrl);

      await delay(0);

      if (cancelled || generation !== runGenerationRef.current) {
        return;
      }

      const isMobileSheet = window.matchMedia(COMMENTS_SHEET_MOBILE_QUERY).matches;
      if (isMobileSheet) {
        await delay(COMMENT_HIGHLIGHT_PANEL_OPEN_DELAY_MS);
      }

      if (cancelled || generation !== runGenerationRef.current) {
        return;
      }

      await waitForCommentElement(commentIdFromUrl, listContainerRef.current);

      if (cancelled || generation !== runGenerationRef.current) {
        return;
      }

      highlightCommentElement(
        commentIdFromUrl,
        listContainerRef.current,
        COMMENT_HIGHLIGHT_DURATION_MS,
        COMMENT_HIGHLIGHT_CLASS
      );

      clearCommentSearchParam(setSearchParams);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [commentIdFromUrl, comments, hasLoadedComments, isDemo, isLoading, listContainerRef, setSearchParams]);

  return { deepLinkThreadExpandTargetId };
}
