import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useItemController } from 'features/items';
import {
  useWishlistJob,
  formatJobTerminalSummary,
  claimImportJobTerminalToast,
  resolveListReloadOnJobTerminal,
} from 'features/jobs';
import { markJobNotificationHandled } from 'features/notifications';
import { wishlistsApi, type Priority, type Wishlist } from 'features/wishlists';
import type { ListShare } from 'features/wishlists';
import { useToast } from 'shared/providers/toast';
import type { UseListDataResult } from '../interfaces/use-list-data-result.interface';

export function useListData(): UseListDataResult {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [listShares, setListShares] = useState<ListShare[]>([]);

  const { items, itemGroups, isLoading: isItemsLoading, fetchItems, itemActions } = useItemController();

  const reloadListContent = useCallback(async () => {
    if (!listId) {
      return;
    }

    setWishlistError(null);
    try {
      const [wl, prio, shares] = await Promise.all([
        wishlistsApi.getWishlist(listId),
        wishlistsApi.listPriorities(listId),
        wishlistsApi.listShares(listId),
      ]);
      if (wl.Id !== listId) {
        navigate(`/wishlists/${wl.Id}`, { replace: true });
        return;
      }
      setWishlist(wl);
      setPriorities(prio || []);
      setListShares(shares || []);
      await fetchItems(listId, { silent: true });
    } catch (err) {
      setWishlistError(err instanceof Error ? err.message : 'Failed to load wishlist.');
    }
  }, [listId, fetchItems, navigate]);

  const softReloadItems = useCallback(async () => {
    if (!listId) {
      return;
    }

    try {
      await fetchItems(listId, { silent: true });
    } catch {
      /* keep current items on transient job refresh failures */
    }
  }, [listId, fetchItems]);

  const loadData = useCallback(async () => {
    if (!listId) {
      return;
    }

    setIsWishlistLoading(true);
    try {
      await reloadListContent();
    } finally {
      setIsWishlistLoading(false);
    }
  }, [listId, reloadListContent]);

  const listChangedTimerRef = useRef<number | null>(null);
  const listChangedNeedsFullReloadRef = useRef(false);

  const handleListChanged = useCallback(
    (event: { reason: string }) => {
      if (event.reason === 'list.updated') {
        listChangedNeedsFullReloadRef.current = true;
      }
      if (listChangedTimerRef.current !== null) {
        window.clearTimeout(listChangedTimerRef.current);
      }
      listChangedTimerRef.current = window.setTimeout(() => {
        listChangedTimerRef.current = null;
        const needsFull = listChangedNeedsFullReloadRef.current;
        listChangedNeedsFullReloadRef.current = false;
        if (needsFull) {
          void reloadListContent();
        } else {
          void softReloadItems();
        }
      }, 300);
    },
    [reloadListContent, softReloadItems]
  );

  useEffect(() => {
    return () => {
      if (listChangedTimerRef.current !== null) {
        window.clearTimeout(listChangedTimerRef.current);
      }
    };
  }, []);

  const {
    job: activeJob,
    isActive: isJobActive,
    cancel: cancelJob,
    refresh: refreshJob,
    enrichingItemIds,
  } = useWishlistJob(listId, { onListChanged: handleListChanged });

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const lastJobReloadAtRef = useRef(0);
  const lastJobTerminalRef = useRef<string | null>(null);
  const [isCancellingJob, setIsCancellingJob] = useState(false);

  useEffect(() => {
    if (!activeJob) {
      return;
    }

    if (isJobActive) {
      const now = Date.now();
      if (now - lastJobReloadAtRef.current >= 4000) {
        lastJobReloadAtRef.current = now;
        void softReloadItems();
      }
      return;
    }

    const terminalKey = `${activeJob.Id}:${activeJob.Status}`;
    if (lastJobTerminalRef.current === terminalKey) {
      return;
    }
    lastJobTerminalRef.current = terminalKey;

    const reloadStrategy = resolveListReloadOnJobTerminal(activeJob);
    if (reloadStrategy === 'full') {
      void loadData();
    } else if (reloadStrategy === 'items') {
      void softReloadItems();
    }

    if (
      activeJob.Status === 'completed' ||
      activeJob.Status === 'failed' ||
      activeJob.Status === 'cancelled'
    ) {
      if (activeJob.Kind === 'item-enrich' || activeJob.Kind === 'item-summarize') {
        markJobNotificationHandled(activeJob.Id);
      }
      const summary = formatJobTerminalSummary(activeJob);
      if (!summary) {
        return;
      }
      if (!claimImportJobTerminalToast(activeJob.Id, activeJob.Status)) {
        return;
      }
      showToast(summary.message, summary.tone);
    }
  }, [activeJob, isJobActive, loadData, softReloadItems, showToast]);

  const handleCancelJob = useCallback(async () => {
    setIsCancellingJob(true);
    try {
      await cancelJob();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to cancel import', 'error');
    } finally {
      setIsCancellingJob(false);
    }
  }, [cancelJob, showToast]);

  const onCancelJob = useCallback(() => {
    void handleCancelJob();
  }, [handleCancelJob]);

  return {
    wishlist,
    setWishlist,
    isWishlistLoading,
    wishlistError,
    priorities,
    listShares,
    items,
    itemGroups,
    isItemsLoading,
    itemActions,
    loadData,
    reloadListContent,
    softReloadItems,
    activeJob,
    isCancellingJob,
    onCancelJob,
    enrichingItemIds,
    refreshJob,
  };
}
