import styles from './wishlist-detail.module.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wishlistsApi, Wishlist, Priority } from 'features/wishlists';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { useItemController, Item } from 'features/items';
import { useAuth } from 'app/providers/auth-context';
import { WishlistDetailTemplate } from './wishlist-detail.html';
import { getFriendlyCategoryLabel } from 'features/items/utils/category-label.util';
import { canViewItem, canLinkItemsByAudience, linkingContextFromItem, LinkingAudienceContext } from 'features/items/utils/item-audience.util';
import { resolveEditorLinkedItemIds } from 'features/items/utils/item-links-sync.util';
import { isWishlistExpired } from 'features/wishlists/utils/is-wishlist-expired.util';
import { getItemFavoriteFlag } from 'shared/utils/parse-item-description.util';
import { formatWishlistExpirationDate } from 'shared/utils/format-date.util';

export default function WishlistDetail() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(true);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [listShares, setListShares] = useState<ListShare[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { items, isLoading: isItemsLoading, fetchItems } = useItemController();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isTaggingModeActive, setIsTaggingModeActive] = useState(false);
  const [taggedItemIds, setTaggedItemIds] = useState<string[]>([]);
  const [isReplyTaggingModeActive, setIsReplyTaggingModeActive] = useState(false);
  const [replyTaggedItemIds, setReplyTaggedItemIds] = useState<string[]>([]);
  const [isLinkingModeActive, setIsLinkingModeActive] = useState(false);
  const [linkedItemIds, setLinkedItemIds] = useState<string[]>([]);
  const [linkingAudienceContext, setLinkingAudienceContext] = useState<LinkingAudienceContext>({
    mode: 'everyone',
    sharedWithUserIds: [],
  });
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'deactivate' | 'delete' | null>(null);

  type ViewMode = 'full' | 'compact' | 'grid';
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem('giftistry_view_mode') as ViewMode) || 'full';
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSetViewMode = (mode: ViewMode) => {
    setSelectedItemId(null); // Clear selected item on view mode change
    setViewMode(mode);
    localStorage.setItem('giftistry_view_mode', mode);
  };

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

  const loadData = useCallback(async () => {
    if (!listId) return;
    setIsWishlistLoading(true);
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
      await fetchItems(listId);
    } catch (err) {
      setWishlistError(err instanceof Error ? err.message : 'Failed to load wishlist.');
    } finally {
      setIsWishlistLoading(false);
    }
  }, [listId, fetchItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setLinkedItemIds((prev) => prev.filter((id) => items.some((item) => item.Id === id)));
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
      setIsLinkingModeActive(false);
    }
  }, [isAddOpen, editingItem]);

  const isOwner = useMemo(() => {
    return !!(wishlist && user && wishlist.UserId === user.Id);
  }, [wishlist, user]);

  const canCollaborate = useMemo(() => {
    return isOwner || wishlist?.Role === 'collaborator';
  }, [isOwner, wishlist?.Role]);

  const isExpired = useMemo(() => isWishlistExpired(wishlist?.ExpiresAt), [wishlist]);

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
        wishlist.AiEnabled
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
        wishlist.AiEnabled
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
        wishlist.AiEnabled
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
        !wishlist.AiEnabled
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle AI reviews');
    }
  };



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
    setLinkingAudienceContext(sourceContext);
    setLinkedItemIds(
      resolveEditorLinkedItemIds(sourceItem.Id, items).filter((id) => {
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
    setIsLinkingModeActive(false);
    setLinkingAudienceContext({ mode: 'everyone', sharedWithUserIds: [] });
    setIsAddOpen(true);
  };

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
      setLinkedItemIds((prev) =>
        prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
      );
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
  }, [linkingAudienceContext, isAddOpen, editingItem, items]);

  const resolvedLinkedItems = useMemo(
    () =>
      linkedItemIds
        .map((id) => items.find((i) => i.Id === id))
        .filter((item): item is Item => !!item),
    [linkedItemIds, items]
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

  const visibleItems = useMemo(() => {
    return displayItems.filter((item) => canViewItem(item, user?.Id, isOwner));
  }, [displayItems, user?.Id, isOwner]);

  const groupedItems = useMemo(() => {
    const filtered = visibleItems.filter((item) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        item.Name.toLowerCase().includes(query) ||
        (item.Description && item.Description.toLowerCase().includes(query))
      );
    });

    const groups: { [categoryKey: string]: { label: string; items: Item[] } } = {};

    for (const item of filtered) {
      const cat = item.Category && item.Category.trim() ? item.Category.trim() : 'uncategorized';
      if (!groups[cat]) {
        groups[cat] = {
          label: cat === 'uncategorized' ? 'General Items' : getFriendlyCategoryLabel(cat),
          items: [],
        };
      }
      groups[cat].items.push(item);
    }

    // Sort items within each category: favorites first, then by ascending numeric Priority, nulls last
    for (const key of Object.keys(groups)) {
      groups[key].items.sort((a, b) => {
        const aFav = getItemFavoriteFlag(a.Description);
        const bFav = getItemFavoriteFlag(b.Description);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;

        const aPri = a.Priority ?? null;
        const bPri = b.Priority ?? null;
        if (aPri !== null && bPri !== null) return aPri - bPri;
        if (aPri !== null && bPri === null) return -1;
        if (aPri === null && bPri !== null) return 1;
        return 0;
      });
    }

    // Sort groups: named categories first (alphabetically), uncategorized last
    return Object.entries(groups)
      .map(([key, val]) => ({ categoryKey: key, label: val.label, items: val.items }))
      .filter((g) => g.items.length > 0)
      .sort((a, b) => {
        if (a.categoryKey === 'uncategorized') return 1;
        if (b.categoryKey === 'uncategorized') return -1;
        return a.label.localeCompare(b.label);
      });
  }, [visibleItems, searchQuery]);

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
      isAddOpen={isAddOpen}
      setIsAddOpen={setIsAddOpen}
      openAddDrawer={openAddDrawer}
      editingItem={editingItem}
      setEditingItem={setEditingItem}
      openItemEditor={openItemEditor}
      setEditingItemDraft={setEditingItemDraft}
      linkedItemIds={linkedItemIds}
      setLinkedItemIds={setLinkedItemIds}
      linkableItems={items}
      resolvedLinkedItems={resolvedLinkedItems}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActive}
      handleLinkingAudienceChange={handleLinkingAudienceChange}
      isItemLinkCompatible={isItemLinkCompatible}
      handleLinkItemToggle={handleLinkItemToggle}
      loadData={loadData}
      confirmAction={confirmAction}
      setConfirmAction={setConfirmAction}
      isDeactivating={isDeactivating}
      isDeleting={isDeleting}
      handleDeactivateConfirm={handleDeactivateConfirm}
      handleDeleteConfirm={handleDeleteConfirm}
      saveTitle={saveTitle}
      saveDate={saveDate}
      toggleRevealSuggestions={toggleRevealSuggestions}
      toggleAiEnabled={toggleAiEnabled}
      formatDate={formatWishlistExpirationDate}
      isCommentsOpen={isCommentsOpen}
      setIsCommentsOpen={setIsCommentsOpen}
      isShareOpen={isShareOpen}
      setIsShareOpen={setIsShareOpen}
      viewMode={viewMode}
      handleSetViewMode={handleSetViewMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedItem={selectedItem || null}
      setSelectedItemId={setSelectedItemId}
      selectedItemId={selectedItemId}
      selectedItemPriorityLabel={selectedItemPriorityLabel}
      groupedItems={groupedItems}
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
    />
  );
}
