import styles from './wishlist-detail.module.css';
import { useEffect, useState, useCallback, useMemo, useRef, type SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Archive, ArchiveRestore, Download, MessageSquare, Settings, Share2, Trash2, Upload } from 'lucide-react';
import { wishlistsApi, Wishlist, Priority, ShareFabPanel } from 'features/wishlists';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import {
  useItemController,
  Item,
} from 'features/items';
import { itemsApi } from 'features/items/api/items.api';
import type { ImportStripHandle } from 'features/items/components/import/import-strip/interfaces/import-strip-handle.interface';
import { ImportMenuPanel } from 'features/items/components/import/import-menu-panel/import-menu-panel.component';
import {
  ITEM_VIEW_MODE_STORAGE_KEY,
} from 'features/items/constants/item-view-mode.constants';
import {
  isKanbanViewMode,
  normalizeStoredViewMode,
  resolveEffectiveViewMode,
} from 'features/items/utils/item-view-mode.util';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { useRegisterPageActions } from 'app/providers/mobile-page-actions-context';
import type { FloatingAction } from 'shared/ui';
import { UserAvatar } from 'shared/ui';
import { getInitialsFromDisplayName } from 'shared/utils/get-initials.util';
import { useSupportsKanbanViewMode } from 'shared/hooks/use-supports-kanban-view-mode';
import {
  useWishlistJob,
  formatJobTerminalSummary,
  claimImportJobTerminalToast,
  type ItemEnrichJobResult,
} from 'features/jobs';
import { markJobNotificationHandled } from 'features/notifications';
import { WishlistDetailTemplate } from './wishlist-detail.html';
import { ListSettingsPanel } from './components/list-settings-panel/list-settings-panel.component';
import { FabConfirmPanel } from './components/fab-confirm-panel/fab-confirm-panel.component';
import { getFriendlyCategoryLabel, normalizeCategoryLabel } from 'features/items/utils/category-label.util';
import { canLinkItemsByAudience, linkingContextFromItem, LinkingAudienceContext } from 'features/items/utils/item-audience.util';
import { resolveEditorLinkedItemIds } from 'features/items/utils/item-links-sync.util';
import { itemSupportsLinkedItems } from 'features/items/utils/item-supports-linked-items.util';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
} from 'features/items/constants/linked-items-messages.constant';
import { resolveEditorRelatedItemIds } from 'features/items/utils/item-related-sync.util';
import { resolveShouldOpenItemViewer } from 'features/items/utils/resolve-should-open-item-viewer.util';
import { isWishlistExpired } from 'features/wishlists/utils/is-wishlist-expired.util';
import { isWishlistArchived } from 'features/wishlists/utils/is-wishlist-archived.util';
import { isWishlistLocked } from 'features/wishlists/utils/is-wishlist-locked.util';
import { dateInputToExpiresAtIso } from 'features/wishlists/utils/date-input-to-expires-at-iso.util';
import { expiresAtIsoToDateInput } from 'features/wishlists/utils/expires-at-iso-to-date-input.util';
import { formatWishlistExpirationDate } from 'shared/utils/format-date.util';
import {
  exportToCsv,
  exportToJson,
  exportToPdf,
  exportToTxt,
  exportToXlsx,
} from 'shared/utils/wishlist-export';
import {
  COMMENT_SHEET_MOBILE_QUERY,
  COMMENT_TAG_PEEK_CLOSE_MS,
  COMMENT_TAG_PEEK_DWELL_MS,
  COMMENT_TAG_PEEK_SCROLL_FALLBACK_MS,
  ITEM_CARD_HIGHLIGHT_DURATION_MS,
} from './constants/comment-tag-peek.constant';
import {
  highlightWishlistItemCard,
  peekHighlightWishlistItemCard,
} from './utils/highlight-wishlist-item-card.util';
import { shouldPeekCommentTag } from './utils/should-peek-comment-tag.util';
import { useIsMobileFab } from 'shared/hooks/use-is-mobile-fab';

export default function WishlistDetail() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user, canShowWebSearch, canShowAi } = useAuth();
  const { showToast } = useToast();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [listShares, setListShares] = useState<ListShare[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { items, itemGroups, isLoading: isItemsLoading, fetchItems, itemActions } = useItemController();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAutoAddOpen, setIsAutoAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importStripRef = useRef<ImportStripHandle>(null);
  const commentTagPeekTimeoutsRef = useRef<{ highlight: number | null; reopen: number | null }>({
    highlight: null,
    reopen: null,
  });
  const commentTagPeekGenerationRef = useRef(0);
  const highlightUnlockTimeoutRef = useRef<number | null>(null);
  const [isHighlightInteractionLocked, setIsHighlightInteractionLocked] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [claimerSubstitutionCreateNonce, setClaimerSubstitutionCreateNonce] = useState(0);
  const [claimerSubstitutionEditNonce, setClaimerSubstitutionEditNonce] = useState(0);
  const [claimerSubstitutionEditId, setClaimerSubstitutionEditId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const isMobileFab = useIsMobileFab();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showDeletedComments, setShowDeletedComments] = useState(false);
  const [isTaggingModeActive, setIsTaggingModeActive] = useState(false);
  const [taggedItemIds, setTaggedItemIds] = useState<string[]>([]);
  const [isReplyTaggingModeActive, setIsReplyTaggingModeActive] = useState(false);
  const [replyTaggedItemIds, setReplyTaggedItemIds] = useState<string[]>([]);
  const [isLinkingModeActive, setIsLinkingModeActive] = useState(false);
  const [linkedItemIds, setLinkedItemIds] = useState<string[]>([]);
  const [isRelatingModeActive, setIsRelatingModeActive] = useState(false);
  const [relatedItemIds, setRelatedItemIds] = useState<string[]>([]);
  const [linkingAudienceContext, setLinkingAudienceContext] = useState<LinkingAudienceContext>({
    mode: 'everyone',
    sharedWithUserIds: [],
  });
  /** Below 75rem the add drawer overlays the list instead of shifting layout. */
  const [doesAddSidebarOverlayList, setDoesAddSidebarOverlayList] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return !window.matchMedia('(min-width: 75rem)').matches;
  });
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'deactivate' | 'activate' | 'delete' | null>(null);

  const [viewMode, setViewMode] = useState<ItemViewMode>(() =>
    normalizeStoredViewMode(localStorage.getItem(ITEM_VIEW_MODE_STORAGE_KEY))
  );
  const supportsKanbanViewMode = useSupportsKanbanViewMode();
  const effectiveViewMode = useMemo(
    () => resolveEffectiveViewMode(viewMode, supportsKanbanViewMode),
    [viewMode, supportsKanbanViewMode]
  );
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(new Set());

  // Synchronize inspector sidebar states across view modes
  useEffect(() => {
    if (selectedItemId !== null) {
      setIsCommentsOpen(false);
      setIsAddOpen(false);
      setEditingItem(null);
      setViewingItem(null);
    }
  }, [selectedItemId]);

  useEffect(() => {
    if (isCommentsOpen) {
      setSelectedItemId(null);
      setIsAddOpen(false);
      setEditingItem(null);
      setViewingItem(null);
    }
  }, [isCommentsOpen]);

  useEffect(() => {
    if (isAddOpen || editingItem || viewingItem) {
      setSelectedItemId(null);
      setIsCommentsOpen(false);
    }
  }, [isAddOpen, editingItem, viewingItem]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(min-width: 75rem)');
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setDoesAddSidebarOverlayList(!event.matches);
    };

    handleChange(mediaQuery);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const handleSetViewMode = (mode: ItemViewMode) => {
    if (isKanbanViewMode(mode) && !supportsKanbanViewMode) {
      return;
    }
    setSelectedItemId(null);
    setViewMode(mode);
    localStorage.setItem(ITEM_VIEW_MODE_STORAGE_KEY, mode);
  };

  const toggleGroupCollapsed = useCallback((categoryKey: string) => {
    setCollapsedGroupKeys((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  }, []);

  const handleSelectTag = useCallback((itemId: string) => {
    setTaggedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleSelectReplyTag = useCallback((itemId: string) => {
    setReplyTaggedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const reloadListContent = useCallback(async () => {
    if (!listId) return;
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
    if (!listId) return;
    try {
      await fetchItems(listId, { silent: true });
    } catch {
      /* keep current items on transient job refresh failures */
    }
  }, [listId, fetchItems]);

  const loadData = useCallback(async () => {
    if (!listId) return;
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
    loadData();
  }, [loadData]);

  const lastJobReloadAtRef = useRef(0);
  const lastJobTerminalRef = useRef<string | null>(null);
  const [isCancellingJob, setIsCancellingJob] = useState(false);

  useEffect(() => {
    if (!activeJob) return;

    if (isJobActive) {
      const now = Date.now();
      if (now - lastJobReloadAtRef.current >= 4000) {
        lastJobReloadAtRef.current = now;
        void softReloadItems();
      }
      return;
    }

    const terminalKey = `${activeJob.Id}:${activeJob.Status}`;
    if (lastJobTerminalRef.current === terminalKey) return;
    lastJobTerminalRef.current = terminalKey;

    void loadData();

    if (
      activeJob.Status === 'completed' ||
      activeJob.Status === 'failed' ||
      activeJob.Status === 'cancelled'
    ) {
      if (
        activeJob.Kind === 'item-enrich' ||
        activeJob.Kind === 'item-summarize'
      ) {
        markJobNotificationHandled(activeJob.Id);
      }
      const summary = formatJobTerminalSummary(activeJob);
      if (!summary) return;
      if (!claimImportJobTerminalToast(activeJob.Id, activeJob.Status)) return;
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

  useEffect(() => {
    setLinkedItemIds((prev) => prev.filter((id) => items.some((item) => item.Id === id)));
    setRelatedItemIds((prev) => prev.filter((id) => items.some((item) => item.Id === id)));
  }, [items]);

  useEffect(() => {
    if (editingItem && !items.some((item) => item.Id === editingItem.Id)) {
      setEditingItem(null);
      setEditingItemDraft(null);
    }
  }, [items, editingItem]);

  useEffect(() => {
    if (viewingItem && !items.some((item) => item.Id === viewingItem.Id)) {
      setViewingItem(null);
    }
  }, [items, viewingItem]);

  useEffect(() => {
    if (!isAddOpen && !editingItem && !viewingItem) {
      setLinkedItemIds([]);
      setRelatedItemIds([]);
      setIsLinkingModeActive(false);
      setIsRelatingModeActive(false);
    }
  }, [isAddOpen, editingItem, viewingItem]);

  const setIsLinkingModeActiveExclusive = useCallback((value: SetStateAction<boolean>) => {
    setIsLinkingModeActive((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) setIsRelatingModeActive(false);
      return next;
    });
  }, []);

  const setIsRelatingModeActiveExclusive = useCallback((value: SetStateAction<boolean>) => {
    setIsRelatingModeActive((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) setIsLinkingModeActive(false);
      return next;
    });
  }, []);

  const isOwner = useMemo(() => {
    return !!(wishlist && user && wishlist.UserId === user.Id);
  }, [wishlist, user]);

  const canCollaborate = useMemo(() => {
    return isOwner || wishlist?.Role === 'collaborator';
  }, [isOwner, wishlist?.Role]);

  const isExpired = useMemo(() => isWishlistExpired(wishlist?.ExpiresAt), [wishlist]);
  const isArchived = useMemo(() => isWishlistArchived(wishlist?.IsActive), [wishlist]);
  const isLocked = useMemo(
    () => isWishlistLocked(isExpired, isArchived),
    [isExpired, isArchived]
  );

  const shouldOpenItemViewer = useMemo(
    () =>
      resolveShouldOpenItemViewer({
        isOwner,
        canCollaborate,
        isPublicGuest: false,
        isLocked,
      }),
    [isOwner, canCollaborate, isLocked]
  );

  const canSuggest = useMemo(() => {
    return Boolean(user && wishlist && !isLocked);
  }, [user, wishlist, isLocked]);

  const canUseWebSearchOnList = useMemo(
    () => Boolean(canShowWebSearch && wishlist?.AiEnabled && wishlist?.WebSearchEnabled),
    [canShowWebSearch, wishlist]
  );

  const saveTitle = async (newTitle: string) => {
    if (!wishlist) return;
    const trimmed = newTitle.trim();
    if (!trimmed || trimmed === wishlist.Title) {
      return;
    }
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        trimmed,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update title');
      throw err;
    }
  };

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
    };
  }, []);

  const handleItemTaggedClick = useCallback((itemId: string, returnToItemId?: string) => {
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
    const shouldReturnAfterPeek =
      !!returnToItemId && returnToItemId !== itemId;

    if (!shouldPeek && !shouldReturnAfterPeek) {
      clearCommentTagPeekTimeouts();
      highlightWishlistItemCard(
        itemId,
        styles['item-card-wrapper-highlighted'],
        ITEM_CARD_HIGHLIGHT_DURATION_MS
      );
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

    const closeDelayMs =
      shouldPeek && !prefersReducedMotion ? COMMENT_TAG_PEEK_CLOSE_MS : 0;

    commentTagPeekTimeoutsRef.current.highlight = window.setTimeout(() => {
      void (async () => {
        try {
          await peekHighlightWishlistItemCard(itemId, styles['item-card-wrapper-highlighted'], {
            dwellMs: prefersReducedMotion ? 0 : COMMENT_TAG_PEEK_DWELL_MS,
            scrollFallbackMs: prefersReducedMotion ? 0 : COMMENT_TAG_PEEK_SCROLL_FALLBACK_MS,
            returnToItemId: shouldReturnAfterPeek ? returnToItemId : undefined,
          });
        } finally {
          if (peekGeneration !== commentTagPeekGenerationRef.current) return;
          if (shouldPeek) {
            setIsCommentsOpen(true);
          }
          setIsHighlightInteractionLocked(false);
        }
      })();
    }, closeDelayMs);
  }, [isCommentsOpen, isTaggingModeActive, isReplyTaggingModeActive]);

  const saveDate = async (newDateStr: string) => {
    if (!wishlist) return;
    const prevDateStr = expiresAtIsoToDateInput(wishlist.ExpiresAt);
    if (newDateStr === prevDateStr) {
      return;
    }
    const wasArchived = isWishlistArchived(wishlist.IsActive);
    try {
      const expiresAtIso = dateInputToExpiresAtIso(newDateStr);
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        expiresAtIso,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
      if (wasArchived) {
        showToast('Date updated. Restore the list to unlock it.', 'info');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update date');
      throw err;
    }
  };

  const toggleAiEnabled = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        !wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle AI reviews');
    }
  };

  const toggleWebSearchEnabled = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        wishlist.AiEnabled,
        !wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle web search');
    }
  };

  const toggleManualJobBackground = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground === false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle background enrich');
    }
  };

  const toggleAutoRollover = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        undefined,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false,
        wishlist.AutoRollover !== true
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle rollover');
    }
  };

  const shareOwnerInfo = useMemo(() => {
    if (!user) return undefined;
    const displayName =
      `${user.FirstName || ''} ${user.LastName || ''}`.trim() || user.Username || 'You';
    const initials =
      user.FirstName || user.LastName
        ? `${user.FirstName?.[0] || ''}${user.LastName?.[0] || ''}`.toUpperCase()
        : user.Username?.substring(0, 2).toUpperCase() || '??';
    return { displayName, initials };
  }, [user?.FirstName, user?.LastName, user?.Username]);

  const handleDeactivateConfirm = async () => {
    if (!wishlist) return;

    setIsDeactivating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deactivateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deactivation failed.');
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleActivateConfirm = async () => {
    if (!wishlist) return;

    setIsActivating(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.activateWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reactivation failed.');
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!wishlist) return;

    setIsDeleting(true);
    setConfirmAction(null);
    try {
      await wishlistsApi.deleteWishlist(wishlist.Id);
      navigate('/dashboard');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Deletion failed.');
    } finally {
      setIsDeleting(false);
    }
  };

  const pageActions = useMemo((): FloatingAction[] => {
    if (!wishlist) return [];

    const exporterName = user?.FirstName || user?.Username || 'Export';
    const exportContext = {
      exporterName,
      isOwner,
      currentUserId: user?.Id,
    };

    const actions: FloatingAction[] = [];

    if (canCollaborate && !isLocked) {
      actions.push({
        id: 'import',
        label: 'Import',
        icon: <Upload size={18} aria-hidden />,
        panelWidth: 288,
        panelHeight: 268,
        hidePanelHeader: true,
        panelContent: ({ closeMenu, setPanelSize, setPanelEscapeHandler }) => (
          <ImportMenuPanel
            mode="existing-list"
            listId={wishlist.Id}
            allowAi={Boolean(canShowAi && wishlist.AiEnabled)}
            onClose={closeMenu}
            onSizeChange={setPanelSize}
            setPanelEscapeHandler={setPanelEscapeHandler}
            onImported={() => {
              closeMenu();
              void reloadListContent();
            }}
          />
        ),
      });
    }

    actions.push({
      id: 'export',
      label: 'Export',
      icon: <Download size={18} aria-hidden />,
      children: [
        {
          id: 'csv',
          label: 'CSV',
          onClick: () => exportToCsv(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'xlsx',
          label: 'XLSX',
          onClick: () => exportToXlsx(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'txt',
          label: 'TXT',
          onClick: () => exportToTxt(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'json',
          label: 'JSON',
          onClick: () => exportToJson(wishlist.Id, wishlist.Title, exportContext),
        },
        {
          id: 'pdf',
          label: 'PDF',
          onClick: () => exportToPdf(wishlist.Id, wishlist.Title, exportContext),
        },
      ],
    });

    actions.push({
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare size={18} aria-hidden />,
      onClick: () => setIsCommentsOpen((prev) => !prev),
    });

    if (isOwner) {
      const shareAction: FloatingAction = isMobileFab
        ? {
            id: 'share',
            label: 'Share',
            icon: <Share2 size={18} aria-hidden />,
            panelWidth: 320,
            panelHeight: 380,
            hidePanelHeader: true,
            panelContent: ({ closeMenu }) => (
              <ShareFabPanel
                listId={wishlist.Id}
                isOwner={isOwner}
                onClose={closeMenu}
                onSuccess={() => {
                  void reloadListContent();
                }}
                ownerInfo={shareOwnerInfo}
              />
            ),
          }
        : {
            id: 'share',
            label: 'Share',
            icon: <Share2 size={18} aria-hidden />,
            onClick: () => setIsShareOpen(true),
          };

      actions.unshift(shareAction);

      if (isArchived) {
        actions.push(
          {
            id: 'restore',
            label: 'Restore',
            icon: <ArchiveRestore size={18} aria-hidden />,
            disabled: isDeactivating || isActivating || isDeleting,
            toolbarTone: 'default',
            panelWidth: 280,
            panelHeight: 220,
            panelContent: ({ closeMenu }) => (
              <FabConfirmPanel
                tone="warning"
                message="Are you sure you want to restore this wishlist from the archive?"
                yesDisabled={isActivating}
                onYes={() => {
                  closeMenu();
                  void handleActivateConfirm();
                }}
                onNo={closeMenu}
              />
            ),
          },
          {
            id: 'delete',
            label: 'Delete',
            icon: <Trash2 size={18} aria-hidden />,
            disabled: isDeactivating || isActivating || isDeleting,
            toolbarTone: 'danger',
            hideToolbarDivider: true,
            panelWidth: 280,
            panelHeight: 220,
            panelContent: ({ closeMenu }) => (
              <FabConfirmPanel
                tone="danger"
                message="Are you sure you want to permanently delete this wishlist and all of its items?"
                yesDisabled={isDeleting}
                onYes={() => {
                  closeMenu();
                  void handleDeleteConfirm();
                }}
                onNo={closeMenu}
              />
            ),
          }
        );
      } else {
        actions.push({
          id: 'archive',
          label: 'Archive',
          icon: <Archive size={18} aria-hidden />,
          disabled: isDeactivating || isActivating || isDeleting,
          toolbarTone: 'default',
          panelWidth: 280,
          panelHeight: 220,
          panelContent: ({ closeMenu }) => (
            <FabConfirmPanel
              tone="warning"
              message="Are you sure you want to deactivate and archive this wishlist?"
              yesDisabled={isDeactivating}
              onYes={() => {
                closeMenu();
                void handleDeactivateConfirm();
              }}
              onNo={closeMenu}
            />
          ),
        });
      }
    }

    const listSettingsReadOnly = !isOwner || isArchived;
    const settingsRowCount = listSettingsReadOnly
      ? 4
      : 1 + (canShowAi ? 1 : 0) + (canShowWebSearch ? 1 : 0) + (canShowAi ? 1 : 0);
    const settingsPanelPad = 32;
    const settingsPanelHeader = 44;
    const settingsRowHeight = 44;
    const settingsRowGap = 4;
    actions.push({
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={18} aria-hidden />,
      toolbarTone: listSettingsReadOnly ? 'default' : undefined,
      toolbarMuted: listSettingsReadOnly,
      panelWidth: 260,
      panelHeight:
        settingsPanelPad +
        settingsPanelHeader +
        settingsRowCount * settingsRowHeight +
        Math.max(0, settingsRowCount - 1) * settingsRowGap,
      panelContent: (
        <ListSettingsPanel
          aiEnabled={!!wishlist.AiEnabled}
          webSearchEnabled={!!wishlist.WebSearchEnabled}
          manualJobBackground={wishlist.ManualJobBackground !== false}
          autoRollover={wishlist.AutoRollover === true}
          canShowAi={canShowAi}
          canShowWebSearch={canShowWebSearch}
          readOnly={listSettingsReadOnly}
          onToggleAi={() => {
            void toggleAiEnabled();
          }}
          onToggleWebSearch={() => {
            void toggleWebSearchEnabled();
          }}
          onToggleManualJobBackground={() => {
            void toggleManualJobBackground();
          }}
          onToggleAutoRollover={() => {
            void toggleAutoRollover();
          }}
        />
      ),
    });

    if (!isOwner && wishlist.UserId) {
      const ownerDisplayName =
        wishlist.OwnerFirstName || wishlist.OwnerUsername || 'Registry Owner';
      const ownerInitials = getInitialsFromDisplayName(ownerDisplayName);
      actions.unshift({
        id: 'owner',
        label: `View owner: ${ownerDisplayName}`,
        icon: (
          <UserAvatar
            avatar={wishlist.OwnerAvatar}
            alt={ownerDisplayName}
            initials={ownerInitials}
            className={styles.fabOwnerAvatar}
            imageClassName={styles.fabOwnerAvatarImg}
            initialsClassName={styles.fabOwnerAvatarInitials}
          />
        ),
        toolbarTone: 'default',
        separateAfter: true,
        onClick: () => {
          navigate(`/users/${wishlist.UserId}`);
        },
      });
    }

    return actions;
  }, [
    wishlist,
    user?.FirstName,
    user?.Username,
    user?.Id,
    isOwner,
    canCollaborate,
    isExpired,
    isArchived,
    canShowAi,
    canShowWebSearch,
    isDeactivating,
    isActivating,
    isDeleting,
    reloadListContent,
    isMobileFab,
    shareOwnerInfo,
    navigate,
  ]);

  useRegisterPageActions(pageActions);

  const [editingItemDraft, setEditingItemDraft] = useState<Partial<Item> | null>(null);

  const clearSubstitutionAutoOpen = () => {
    setClaimerSubstitutionEditId(null);
    setClaimerSubstitutionEditNonce(0);
    setClaimerSubstitutionCreateNonce(0);
  };

  const openItemEditor = (item: Item) => {
    clearSubstitutionAutoOpen();
    const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
    const sourceContext = linkingContextFromItem(sourceItem);
    setIsAddOpen(false);
    setViewingItem(null);
    setEditingItemDraft(null);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
    setLinkingAudienceContext(sourceContext);
    setLinkedItemIds(
      sourceItem.IsSuggestion
        ? []
        : resolveEditorLinkedItemIds(sourceItem.Id, items).filter((id) => {
            const target = items.find((i) => i.Id === id);
            return (
              target &&
              canLinkItemsByAudience(sourceContext, target) &&
              itemSupportsLinkedItems(target)
            );
          })
    );
    setRelatedItemIds(
      resolveEditorRelatedItemIds(sourceItem.Id, items).filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(sourceContext, target);
      })
    );
    setEditingItem(sourceItem);
  };

  const openItemViewer = (item: Item) => {
    clearSubstitutionAutoOpen();
    const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
    const sourceContext = linkingContextFromItem(sourceItem);
    setIsAddOpen(false);
    setEditingItem(null);
    setEditingItemDraft(null);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
    setSelectedItemId(null);
    setIsCommentsOpen(false);
    setLinkingAudienceContext(sourceContext);
    setLinkedItemIds(
      sourceItem.IsSuggestion
        ? []
        : resolveEditorLinkedItemIds(sourceItem.Id, items).filter((id) => {
            const target = items.find((i) => i.Id === id);
            return (
              target &&
              canLinkItemsByAudience(sourceContext, target) &&
              itemSupportsLinkedItems(target)
            );
          })
    );
    setRelatedItemIds(
      resolveEditorRelatedItemIds(sourceItem.Id, items).filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(sourceContext, target);
      })
    );
    setViewingItem(sourceItem);
  };

  const openClaimerSubstitutionCreate = (item: Item) => {
    openItemViewer(item);
    setClaimerSubstitutionCreateNonce((n) => n + 1);
  };

  const openSubstitutionEdit = (item: Item, substitutionId: string) => {
    const option = (item.SubstitutionOptions ?? []).find((entry) => entry.Id === substitutionId);
    if (!option) return;
    if (isOwner) {
      openItemEditor(item);
    } else {
      openItemViewer(item);
    }
    setClaimerSubstitutionEditId(option.Id);
    setClaimerSubstitutionEditNonce((n) => n + 1);
  };

  const openClaimerSubstitutionEdit = (item: Item) => {
    const option = (item.SubstitutionOptions ?? []).find(
      (entry) => entry.Kind === 'claimer_custom' && entry.CreatedByUserId === user?.Id
    );
    if (!option) return;
    openSubstitutionEdit(item, option.Id);
  };

  const deleteSubstitutionOption = async (substitutionId: string) => {
    await itemsApi.deleteSubstitution(substitutionId);
    await loadData();
  };

  const deleteClaimerSubstitution = async (item: Item) => {
    const option = (item.SubstitutionOptions ?? []).find(
      (entry) => entry.Kind === 'claimer_custom' && entry.CreatedByUserId === user?.Id
    );
    if (!option) return;
    await deleteSubstitutionOption(option.Id);
  };

  const canAutoAdd = Boolean(canSuggest && canShowAi && wishlist?.AiEnabled);

  useEffect(() => {
    if (!canAutoAdd) {
      setIsAutoAddOpen(false);
    }
  }, [canAutoAdd]);

  const openAddDrawer = () => {
    clearSubstitutionAutoOpen();
    setEditingItem(null);
    setViewingItem(null);
    setEditingItemDraft(null);
    setLinkedItemIds([]);
    setRelatedItemIds([]);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
    setLinkingAudienceContext({ mode: 'everyone', sharedWithUserIds: [] });
    setIsAutoAddOpen(false);
    setIsAddOpen(true);
  };

  const openAutoAdd = useCallback(() => {
    if (!canAutoAdd) return;
    setIsAddOpen(false);
    setEditingItem(null);
    setViewingItem(null);
    setEditingItemDraft(null);
    setIsAutoAddOpen(true);
  }, [canAutoAdd]);

  const closeAutoAdd = useCallback(() => {
    setIsAutoAddOpen(false);
  }, []);

  const handleAutoAddStarted = useCallback(
    async (result: ItemEnrichJobResult) => {
      setIsAutoAddOpen(false);
      showToast(
        result.Item?.Name
          ? `Fetching details for ${result.Item.Name}...`
          : 'Fetching product details in the background...',
        'info'
      );
      await Promise.all([softReloadItems(), refreshJob()]);
    },
    [refreshJob, showToast, softReloadItems]
  );

  const handleLinkingAudienceChange = useCallback((context: LinkingAudienceContext) => {
    setLinkingAudienceContext(context);
  }, []);

  const isItemLinkCompatible = useCallback(
    (target: Item) =>
      canLinkItemsByAudience(linkingAudienceContext, target) &&
      itemSupportsLinkedItems(target),
    [linkingAudienceContext]
  );

  const isItemRelateCompatible = useCallback(
    (target: Item) => canLinkItemsByAudience(linkingAudienceContext, target),
    [linkingAudienceContext]
  );

  const resolveLinkingSourceItem = useCallback((): Item | null => {
    if (editingItem) {
      const draftMeta = editingItemDraft?.Metadata ?? null;
      const mergedMeta = {
        ...(editingItem.Metadata ?? {}),
        ...(draftMeta ?? {}),
      };
      const draftQty =
        editingItemDraft?.DesiredQuantity ?? draftMeta?.DesiredQuantity ?? null;
      return {
        ...editingItem,
        ...(editingItemDraft ?? {}),
        Metadata: mergedMeta,
        DesiredQuantity:
          draftQty != null ? Number(draftQty) || 1 : editingItem.DesiredQuantity,
        IsMultiCount:
          editingItemDraft?.IsMultiCount ??
          draftMeta?.MultiCount ??
          editingItem.IsMultiCount,
        IsSuggestion: editingItem.IsSuggestion ?? !isOwner,
      };
    }

    if (isAddOpen && editingItemDraft) {
      return {
        Id: 'draft',
        ListId: wishlist?.Id ?? '',
        PriorityId: null,
        SuggestedByUserId: null,
        Name: editingItemDraft.Name ?? 'Draft',
        Description: editingItemDraft.Description ?? null,
        IsHiddenIdea: false,
        Category: editingItemDraft.Category ?? 'uncategorized',
        Links: [],
        Claims: [],
        IsClaimed: false,
        DesiredQuantity: editingItemDraft.DesiredQuantity ?? 1,
        IsMultiCount: editingItemDraft.IsMultiCount ?? false,
        Metadata: editingItemDraft.Metadata ?? null,
        IsSuggestion: editingItemDraft.IsSuggestion ?? !isOwner,
      };
    }

    return null;
  }, [editingItem, editingItemDraft, isAddOpen, isOwner, wishlist?.Id]);

  const handleLinkItemToggle = useCallback(
    (itemId: string) => {
      const target = items.find((i) => i.Id === itemId);
      if (!target || !canLinkItemsByAudience(linkingAudienceContext, target)) {
        return;
      }

      setLinkedItemIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }

        const source = resolveLinkingSourceItem();
        const sourceBlocked =
          !!source && !itemSupportsLinkedItems(source, source.Metadata);
        const targetBlocked = !itemSupportsLinkedItems(target);
        if (sourceBlocked || targetBlocked) {
          const isSuggestionBlock =
            source?.IsSuggestion === true || target.IsSuggestion === true;
          showToast(
            isSuggestionBlock
              ? LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE
              : LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
            'error'
          );
          return prev;
        }

        setRelatedItemIds((relatedPrev) => relatedPrev.filter((id) => id !== itemId));
        return [...prev, itemId];
      });
    },
    [
      items,
      linkingAudienceContext,
      resolveLinkingSourceItem,
      showToast,
    ]
  );

  const handleRelateItemToggle = useCallback(
    (itemId: string) => {
      const target = items.find((i) => i.Id === itemId);
      if (!target || !canLinkItemsByAudience(linkingAudienceContext, target)) {
        return;
      }
      setRelatedItemIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }
        setLinkedItemIds((linkedPrev) => linkedPrev.filter((id) => id !== itemId));
        return [...prev, itemId];
      });
    },
    [items, linkingAudienceContext]
  );

  useEffect(() => {
    if (!isAddOpen && !editingItem && !viewingItem) {
      return;
    }
    setLinkedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return (
          !!target &&
          canLinkItemsByAudience(linkingAudienceContext, target) &&
          itemSupportsLinkedItems(target)
        );
      })
    );
    setRelatedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(linkingAudienceContext, target);
      })
    );
  }, [linkingAudienceContext, isAddOpen, editingItem, viewingItem, items]);

  useEffect(() => {
    if (!isAddOpen && !editingItem) {
      return;
    }
    const source = resolveLinkingSourceItem();
    if (source && !itemSupportsLinkedItems(source, source.Metadata)) {
      setLinkedItemIds((prev) => (prev.length > 0 ? [] : prev));
      setIsLinkingModeActive(false);
    }
  }, [
    isAddOpen,
    editingItem,
    resolveLinkingSourceItem,
    setIsLinkingModeActive,
  ]);

  const resolvedLinkedItems = useMemo(
    () =>
      linkedItemIds
        .map((id) => items.find((i) => i.Id === id))
        .filter((item): item is Item => !!item),
    [linkedItemIds, items]
  );

  const resolvedRelatedItems = useMemo(
    () =>
      relatedItemIds
        .map((id) => items.find((i) => i.Id === id))
        .filter((item): item is Item => !!item),
    [relatedItemIds, items]
  );

  const displayItems = useMemo(() => {
    return items.map((item) => {
      if (editingItem && editingItemDraft && item.Id === editingItem.Id) {
        return {
          ...item,
          ...editingItemDraft,
          Links: editingItemDraft.Links !== undefined ? editingItemDraft.Links : item.Links,
          SharedWith:
            editingItemDraft.SharedWith !== undefined
              ? editingItemDraft.SharedWith
              : item.SharedWith,
        };
      }
      return item;
    });
  }, [items, editingItem, editingItemDraft]);

  const visibleItems = useMemo(() => displayItems, [displayItems]);

  const groupedItems = useMemo(() => {
    const matchesQuery = (item: Item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        item.Name.toLowerCase().includes(query) ||
        (item.Description && item.Description.toLowerCase().includes(query))
      );
    };

    type ItemGroup = { categoryKey: string; label: string; items: Item[] };

    const splitEnrichingUncategorized = (groups: ItemGroup[]): ItemGroup[] =>
      groups.flatMap((group) => {
        if (group.categoryKey !== 'uncategorized') return [group];
        const enriching = group.items.filter((item) => enrichingItemIds.has(item.Id));
        const settled = group.items.filter((item) => !enrichingItemIds.has(item.Id));
        const next: ItemGroup[] = [];
        if (enriching.length > 0) {
          next.push({ categoryKey: 'processing', label: 'Processing', items: enriching });
        }
        if (settled.length > 0) {
          next.push({
            categoryKey: 'uncategorized',
            label: 'General Items',
            items: settled,
          });
        }
        return next;
      });

    const sortGroups = (groups: ItemGroup[]) =>
      [...groups]
        .filter((group) => group.items.length > 0)
        .sort((a, b) => {
          const aTail = a.categoryKey === 'uncategorized' || a.categoryKey === 'processing';
          const bTail = b.categoryKey === 'uncategorized' || b.categoryKey === 'processing';
          if (aTail && !bTail) return 1;
          if (!aTail && bTail) return -1;
          if (a.categoryKey === 'processing' && b.categoryKey === 'uncategorized') return -1;
          if (a.categoryKey === 'uncategorized' && b.categoryKey === 'processing') return 1;
          return a.label.localeCompare(b.label);
        });

    if (itemGroups && itemGroups.length > 0) {
      return sortGroups(
        splitEnrichingUncategorized(
          itemGroups
            .map((group) => ({
              categoryKey: group.CategoryKey,
              label: group.CategoryLabel,
              items: group.Items.filter((item) => {
                const inVisible = visibleItems.some((visible) => visible.Id === item.Id);
                return inVisible && matchesQuery(item);
              }),
            }))
            .filter((group) => group.items.length > 0)
        )
      );
    }

    const filtered = visibleItems.filter(matchesQuery);

    // Preserve server export order within each category group.
    const groups: { [categoryKey: string]: { label: string; items: Item[] } } = {};

    for (const item of filtered) {
      const cat =
        item.CategoryKey ||
        normalizeCategoryLabel(
          item.Category && item.Category.trim() ? item.Category.trim() : 'uncategorized'
        );
      if (!groups[cat]) {
        groups[cat] = {
          label:
            item.CategoryLabel ||
            (cat === 'uncategorized'
              ? 'General Items'
              : getFriendlyCategoryLabel(item.Category || cat)),
          items: [],
        };
      }
      groups[cat].items.push(item);
    }

    // Sort groups: named categories first (alphabetically), processing then General Items last
    return sortGroups(
      splitEnrichingUncategorized(
        Object.entries(groups).map(([key, val]) => ({
          categoryKey: key,
          label: val.label,
          items: val.items,
        }))
      )
    );
  }, [visibleItems, searchQuery, itemGroups, enrichingItemIds]);

  const selectedItem = useMemo(() => {
    return visibleItems.find((i) => i.Id === selectedItemId);
  }, [visibleItems, selectedItemId]);

  const selectedItemPriorityLabel = useMemo(() => {
    if (!selectedItemId) return undefined;
    const group = groupedItems.find((g) =>
      g.items.some((i) => i.Id === selectedItemId)
    );
    return group?.label;
  }, [groupedItems, selectedItemId]);

  useEffect(() => {
    if (selectedItemId && !visibleItems.some((i) => i.Id === selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [visibleItems, selectedItemId]);

  return (
    <WishlistDetailTemplate
      isWishlistLoading={isWishlistLoading}
      wishlistError={wishlistError}
      wishlist={wishlist}
      items={visibleItems}
      priorities={priorities}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      canSuggest={canSuggest}
      isPublicGuest={false}
      isExpired={isExpired}
      isArchived={isArchived}
      isAddOpen={isAddOpen}
      setIsAddOpen={setIsAddOpen}
      openAddDrawer={openAddDrawer}
      isAutoAddOpen={isAutoAddOpen}
      openAutoAdd={openAutoAdd}
      closeAutoAdd={closeAutoAdd}
      onAutoAddStarted={(result) => {
        void handleAutoAddStarted(result);
      }}
      enrichingItemIds={enrichingItemIds}
      editingItem={editingItem}
      setEditingItem={setEditingItem}
      openItemEditor={openItemEditor}
      viewingItem={viewingItem}
      openItemViewer={openItemViewer}
      openClaimerSubstitutionCreate={openClaimerSubstitutionCreate}
      claimerSubstitutionCreateNonce={claimerSubstitutionCreateNonce}
      openClaimerSubstitutionEdit={openClaimerSubstitutionEdit}
      claimerSubstitutionEditNonce={claimerSubstitutionEditNonce}
      claimerSubstitutionEditId={claimerSubstitutionEditId}
      deleteClaimerSubstitution={deleteClaimerSubstitution}
      openSubstitutionEdit={openSubstitutionEdit}
      deleteSubstitutionOption={deleteSubstitutionOption}
      clearSubstitutionAutoOpen={clearSubstitutionAutoOpen}
      shouldOpenItemViewer={shouldOpenItemViewer}
      setViewingItem={setViewingItem}
      setEditingItemDraft={setEditingItemDraft}
      linkedItemIds={linkedItemIds}
      setLinkedItemIds={setLinkedItemIds}
      relatedItemIds={relatedItemIds}
      setRelatedItemIds={setRelatedItemIds}
      linkableItems={items}
      resolvedLinkedItems={resolvedLinkedItems}
      resolvedRelatedItems={resolvedRelatedItems}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActiveExclusive}
      isRelatingModeActive={isRelatingModeActive}
      setIsRelatingModeActive={setIsRelatingModeActiveExclusive}
      doesAddSidebarOverlayList={doesAddSidebarOverlayList}
      handleLinkingAudienceChange={handleLinkingAudienceChange}
      isItemLinkCompatible={isItemLinkCompatible}
      isItemRelateCompatible={isItemRelateCompatible}
      handleLinkItemToggle={handleLinkItemToggle}
      handleRelateItemToggle={handleRelateItemToggle}
      loadData={loadData}
      reloadListContent={reloadListContent}
      onItemsChange={softReloadItems}
      itemActions={itemActions}
      confirmAction={confirmAction}
      setConfirmAction={setConfirmAction}
      isDeactivating={isDeactivating}
      isActivating={isActivating}
      isDeleting={isDeleting}
      handleDeactivateConfirm={handleDeactivateConfirm}
      handleActivateConfirm={handleActivateConfirm}
      handleDeleteConfirm={handleDeleteConfirm}
      saveTitle={saveTitle}
      saveDate={saveDate}
      toggleAiEnabled={toggleAiEnabled}
      toggleWebSearchEnabled={toggleWebSearchEnabled}
      toggleManualJobBackground={toggleManualJobBackground}
      toggleAutoRollover={toggleAutoRollover}
      canUseWebSearchOnList={canUseWebSearchOnList}
      formatDate={formatWishlistExpirationDate}
      isCommentsOpen={isCommentsOpen}
      setIsCommentsOpen={setIsCommentsOpen}
      showDeletedComments={showDeletedComments}
      onToggleShowDeletedComments={() => setShowDeletedComments((prev) => !prev)}
      isShareOpen={isShareOpen}
      setIsShareOpen={setIsShareOpen}
      isMobileFab={isMobileFab}
      isImportOpen={isImportOpen}
      setIsImportOpen={setIsImportOpen}
      importStripRef={importStripRef}
      viewMode={effectiveViewMode}
      supportsKanbanViewMode={supportsKanbanViewMode}
      handleSetViewMode={handleSetViewMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedItem={selectedItem || null}
      setSelectedItemId={setSelectedItemId}
      selectedItemId={selectedItemId}
      selectedItemPriorityLabel={selectedItemPriorityLabel}
      groupedItems={groupedItems}
      collapsedGroupKeys={collapsedGroupKeys}
      toggleGroupCollapsed={toggleGroupCollapsed}
      displayItems={displayItems}
      listShares={listShares}
      handleItemTaggedClick={handleItemTaggedClick}
      onLinkedItemsUnsupported={() =>
        showToast(LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE, 'error')
      }
      isHighlightInteractionLocked={isHighlightInteractionLocked}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={setIsTaggingModeActive}
      taggedItemIds={taggedItemIds}
      setTaggedItemIds={setTaggedItemIds}
      isReplyTaggingModeActive={isReplyTaggingModeActive}
      setIsReplyTaggingModeActive={setIsReplyTaggingModeActive}
      replyTaggedItemIds={replyTaggedItemIds}
      setReplyTaggedItemIds={setReplyTaggedItemIds}
      handleSelectTag={handleSelectTag}
      handleSelectReplyTag={handleSelectReplyTag}
      isLoading={isItemsLoading}
      activeJob={activeJob}
      isCancellingJob={isCancellingJob}
      onCancelJob={() => {
        void handleCancelJob();
      }}
      canShowAi={canShowAi}
    />
  );
}
