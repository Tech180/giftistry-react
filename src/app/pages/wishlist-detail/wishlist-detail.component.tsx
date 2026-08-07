import styles from './wishlist-detail.module.css';
import { useEffect, useState, useCallback, useMemo, useRef, type SetStateAction } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, MessageSquare, Settings, Share2, Upload } from 'lucide-react';
import { wishlistsApi, Wishlist, Priority } from 'features/wishlists';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import {
  useItemController,
  Item,
  type ImportStripHandle,
  ImportDropzone,
} from 'features/items';
import {
  ITEM_VIEW_MODE_STORAGE_KEY,
} from 'features/items/constants/item-view-mode.constants';
import {
  normalizeStoredViewMode,
} from 'features/items/utils/item-view-mode.util';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';
import { useAuth } from 'app/providers/auth-context';
import { useToast } from 'app/providers/toast-context';
import { useRegisterPageActions } from 'app/providers/mobile-page-actions-context';
import type { FloatingAction } from 'shared/ui';
import {
  useWishlistJob,
  formatJobTerminalSummary,
  claimImportJobTerminalToast,
  type ItemEnrichJobResult,
} from 'features/jobs';
import { WishlistDetailTemplate } from './wishlist-detail.html';
import { ListSettingsPanel } from './components/list-settings-panel/list-settings-panel.component';
import { getFriendlyCategoryLabel, normalizeCategoryLabel } from 'features/items/utils/category-label.util';
import { canLinkItemsByAudience, linkingContextFromItem, LinkingAudienceContext } from 'features/items/utils/item-audience.util';
import { resolveEditorLinkedItemIds } from 'features/items/utils/item-links-sync.util';
import { resolveEditorRelatedItemIds } from 'features/items/utils/item-related-sync.util';
import { isWishlistExpired } from 'features/wishlists/utils/is-wishlist-expired.util';
import { isWishlistArchived } from 'features/wishlists/utils/is-wishlist-archived.util';
import { formatWishlistExpirationDate } from 'shared/utils/format-date.util';
import {
  exportToCsv,
  exportToJson,
  exportToPdf,
  exportToTxt,
  exportToXlsx,
} from 'shared/utils/wishlist-export';

export default function WishlistDetail() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user, canShowWebSearch, canShowAi } = useAuth();
  const { showToast } = useToast();
  const {
    job: activeJob,
    isActive: isJobActive,
    cancel: cancelJob,
    refresh: refreshJob,
    enrichingItemIds,
  } = useWishlistJob(listId);

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
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(new Set());

  // Synchronize inspector sidebar states for Grid view
  useEffect(() => {
    if (viewMode === 'grid' && selectedItemId !== null) {
      setIsCommentsOpen(false);
      setIsAddOpen(false);
      setEditingItem(null);
    }
  }, [selectedItemId, viewMode]);

  useEffect(() => {
    if (viewMode === 'grid' && isCommentsOpen) {
      setSelectedItemId(null);
      setIsAddOpen(false);
      setEditingItem(null);
    }
  }, [isCommentsOpen, viewMode]);

  useEffect(() => {
    if (viewMode === 'grid' && (isAddOpen || editingItem)) {
      setSelectedItemId(null);
      setIsCommentsOpen(false);
    }
  }, [isAddOpen, editingItem, viewMode]);

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
      setWishlist(wl);
      setPriorities(prio || []);
      setListShares(shares || []);
      await fetchItems(listId, { silent: true });
    } catch (err) {
      setWishlistError(err instanceof Error ? err.message : 'Failed to load wishlist.');
    }
  }, [listId, fetchItems]);

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
    if (!isAddOpen && !editingItem) {
      setLinkedItemIds([]);
      setRelatedItemIds([]);
      setIsLinkingModeActive(false);
      setIsRelatingModeActive(false);
    }
  }, [isAddOpen, editingItem]);

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
        wishlist.RevealSuggestions,
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

  const handleItemTaggedClick = useCallback((itemId: string) => {
    const element = document.getElementById(`item-card-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add(styles['item-card-wrapper-highlighted']);
      setTimeout(() => {
        element.classList.remove(styles['item-card-wrapper-highlighted']);
      }, 1500);
    }
  }, []);

  const saveDate = async (newDateStr: string) => {
    if (!wishlist) return;
    const prevDateStr = wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString().split('T')[0] : '';
    if (newDateStr === prevDateStr) {
      return;
    }
    try {
      const expiresAtIso = newDateStr ? new Date(newDateStr).toISOString() : null;
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        expiresAtIso,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        wishlist.RevealSuggestions,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update date');
      throw err;
    }
  };

  const toggleRevealSuggestions = async () => {
    if (!wishlist) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        !wishlist.RevealSuggestions,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground !== false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update suggestion visibility');
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
        wishlist.RevealSuggestions,
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
        wishlist.RevealSuggestions,
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
        wishlist.RevealSuggestions,
        wishlist.AiEnabled,
        wishlist.WebSearchEnabled,
        wishlist.ManualJobBackground === false
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle background enrich');
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

    if (canCollaborate && !isExpired && !isArchived) {
      actions.push({
        id: 'import',
        label: 'Import',
        icon: <Upload size={18} aria-hidden />,
        panelWidth: 288,
        panelHeight: 268,
        panelContent: ({ closeMenu }) => (
          <ImportDropzone
            variant="menu"
            allowAi={Boolean(canShowAi && wishlist.AiEnabled)}
            onFileSelected={(file) => {
              setIsImportOpen(true);
              importStripRef.current?.acceptFile(file);
              closeMenu();
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
      actions.push({
        id: 'share',
        label: 'Share',
        icon: <Share2 size={18} aria-hidden />,
        onClick: () => setIsShareOpen(true),
      });

      if (canShowAi || canShowWebSearch) {
        actions.push({
          id: 'settings',
          label: 'Settings',
          icon: <Settings size={18} aria-hidden />,
          panelWidth: 260,
          panelHeight: canShowAi ? (canShowWebSearch ? 220 : 176) : 132,
          panelContent: (
            <ListSettingsPanel
              aiEnabled={!!wishlist.AiEnabled}
              webSearchEnabled={!!wishlist.WebSearchEnabled}
              manualJobBackground={wishlist.ManualJobBackground !== false}
              canShowAi={canShowAi}
              canShowWebSearch={canShowWebSearch}
              onToggleAi={() => {
                void toggleAiEnabled();
              }}
              onToggleWebSearch={() => {
                void toggleWebSearchEnabled();
              }}
              onToggleManualJobBackground={() => {
                void toggleManualJobBackground();
              }}
            />
          ),
        });
      }
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
  ]);

  useRegisterPageActions(pageActions);

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
      setWishlist((prev) => (prev ? { ...prev, IsActive: true } : prev));
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

  const [editingItemDraft, setEditingItemDraft] = useState<Partial<Item> | null>(null);

  const openItemEditor = (item: Item) => {
    const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
    const sourceContext = linkingContextFromItem(sourceItem);
    setIsAddOpen(false);
    setEditingItemDraft(null);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
    setLinkingAudienceContext(sourceContext);
    setLinkedItemIds(
      resolveEditorLinkedItemIds(sourceItem.Id, items).filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(sourceContext, target);
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

  const openAddDrawer = () => {
    setEditingItem(null);
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
    setIsAddOpen(false);
    setEditingItem(null);
    setEditingItemDraft(null);
    setIsAutoAddOpen(true);
  }, []);

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
    (target: Item) => canLinkItemsByAudience(linkingAudienceContext, target),
    [linkingAudienceContext]
  );

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
        setRelatedItemIds((relatedPrev) => relatedPrev.filter((id) => id !== itemId));
        return [...prev, itemId];
      });
    },
    [items, linkingAudienceContext]
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
    if (!isAddOpen && !editingItem) {
      return;
    }
    setLinkedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(linkingAudienceContext, target);
      })
    );
    setRelatedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(linkingAudienceContext, target);
      })
    );
  }, [linkingAudienceContext, isAddOpen, editingItem, items]);

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
      toggleRevealSuggestions={toggleRevealSuggestions}
      toggleAiEnabled={toggleAiEnabled}
      toggleWebSearchEnabled={toggleWebSearchEnabled}
      toggleManualJobBackground={toggleManualJobBackground}
      canUseWebSearchOnList={canUseWebSearchOnList}
      formatDate={formatWishlistExpirationDate}
      isCommentsOpen={isCommentsOpen}
      setIsCommentsOpen={setIsCommentsOpen}
      isShareOpen={isShareOpen}
      setIsShareOpen={setIsShareOpen}
      isImportOpen={isImportOpen}
      setIsImportOpen={setIsImportOpen}
      importStripRef={importStripRef}
      viewMode={viewMode}
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
