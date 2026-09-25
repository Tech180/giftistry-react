import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { IDLE_STATE } from './constants/idle-state.constant';
import { USER_JORDAN } from './constants/users.constant';
import { DemoListContext } from './context';
import type { DemoListState } from './interfaces/context-type.interface';
import { TOUR_DEMO_LIST_ID } from '../constants/targets.constant';
import {
  buildSamComment,
  buildSeedComments,
  DEMO_SAM_COMMENT_ID,
} from './utils/build-comments.util';
import { buildJordanItem, buildSeedItems, DEMO_JORDAN_ITEM_ID } from './utils/build-items.util';
import { buildWishlist } from './utils/build-wishlist.util';

export function DemoListProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoListState>(IDLE_STATE);

  const activate = useCallback((ownerId: string, ownerName: string) => {
    const wishlist = buildWishlist(ownerId, ownerName);
    setState({
      active: true,
      wishlist,
      items: buildSeedItems(TOUR_DEMO_LIST_ID),
      comments: buildSeedComments(TOUR_DEMO_LIST_ID),
      typingUsers: [],
      claimedItemId: null,
      highlightedItemId: null,
      highlightedCommentId: null,
    });
  }, []);

  const deactivate = useCallback(() => {
    setState(IDLE_STATE);
  }, []);

  const clearHighlight = useCallback(() => {
    setState((prev) =>
      prev.highlightedItemId || prev.highlightedCommentId
        ? { ...prev, highlightedItemId: null, highlightedCommentId: null }
        : prev
    );
  }, []);

  const runBeat = useCallback((beat: 'seed' | 'addItem' | 'typing' | 'comment' | 'claim') => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = (updater: (prev: DemoListState) => DemoListState) => {
      if (reduceMotion) {
        setState(updater);
        return;
      }

      window.setTimeout(() => setState(updater), beat === 'typing' ? 400 : 200);
    };

    if (beat === 'seed') {
      return;
    }

    if (beat === 'addItem') {
      apply((prev) => {
        if (prev.items.some((entry) => entry.Id === DEMO_JORDAN_ITEM_ID)) {
          return {
            ...prev,
            highlightedItemId: DEMO_JORDAN_ITEM_ID,
            highlightedCommentId: null,
          };
        }

        return {
          ...prev,
          items: [...prev.items, buildJordanItem(TOUR_DEMO_LIST_ID)],
          highlightedItemId: DEMO_JORDAN_ITEM_ID,
          highlightedCommentId: null,
        };
      });
      return;
    }

    if (beat === 'typing') {
      apply((prev) => ({
        ...prev,
        typingUsers: ['Sam'],
        highlightedItemId: null,
        highlightedCommentId: null,
      }));
      return;
    }

    if (beat === 'comment') {
      apply((prev) => {
        const next = buildSamComment(TOUR_DEMO_LIST_ID);
        if (prev.comments.some((entry) => entry.Id === next.Id)) {
          return {
            ...prev,
            typingUsers: [],
            highlightedItemId: null,
            highlightedCommentId: DEMO_SAM_COMMENT_ID,
          };
        }

        return {
          ...prev,
          typingUsers: [],
          highlightedItemId: null,
          highlightedCommentId: DEMO_SAM_COMMENT_ID,
          comments: [...prev.comments, next],
        };
      });
      return;
    }

    if (beat === 'claim') {
      apply((prev) => ({
        ...prev,
        highlightedItemId: null,
        highlightedCommentId: null,
        claimedItemId: 'tour-demo-item-1',
        items: prev.items.map((entry) =>
          entry.Id === 'tour-demo-item-1'
            ? {
                ...entry,
                IsClaimed: true,
                Claims: [
                  {
                    Id: 'tour-demo-claim-1',
                    ItemId: entry.Id,
                    UserId: USER_JORDAN,
                    Amount: null,
                    ClaimedByName: 'Jordan',
                    Quantity: 1,
                  },
                ],
              }
            : entry
        ),
      }));
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      activate,
      deactivate,
      clearHighlight,
      runBeat,
    }),
    [state, activate, deactivate, clearHighlight, runBeat]
  );

  return <DemoListContext.Provider value={value}>{children}</DemoListContext.Provider>;
}
