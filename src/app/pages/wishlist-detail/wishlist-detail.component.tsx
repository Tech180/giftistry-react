import styles from './wishlist-detail.module.css';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wishlistsApi, Wishlist, Priority } from 'features/wishlists';
import { useItemController, Item } from 'features/items';
import { useAuth } from 'app/providers/auth-context';
import { WishlistDetailTemplate } from './wishlist-detail.html';
import { getFriendlyCategoryLabel } from 'features/items/utils/category-label.util';
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
      const [wl, prio] = await Promise.all([
        wishlistsApi.getWishlist(listId),
        wishlistsApi.listPriorities(listId)
      ]);
      setWishlist(wl);
      setPriorities(prio || []);
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
    if (editingItem) {
      try {
        if (editingItem.Description?.startsWith('{') && editingItem.Description.endsWith('}')) {
          const parsed = JSON.parse(editingItem.Description);
          setLinkedItemIds(parsed.linkedItemIds || []);
        } else {
          setLinkedItemIds([]);
        }
      } catch (_) {
        setLinkedItemIds([]);
      }
    } else {
      setLinkedItemIds([]);
      setIsLinkingModeActive(false);
    }
  }, [editingItem]);

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
        wishlist.AiEnabled,
        wishlist.Visibility
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
        wishlist.Visibility
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
        wishlist.Visibility
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
        wishlist.Visibility
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to toggle AI reviews');
    }
  };

  const saveVisibility = async (visibility: 'private' | 'friends' | 'link') => {
    if (!wishlist || wishlist.Visibility === visibility) return;
    try {
      const updated = await wishlistsApi.updateWishlist(
        wishlist.Id,
        wishlist.Title,
        wishlist.ExpiresAt ? new Date(wishlist.ExpiresAt).toISOString() : null,
        wishlist.AllowGroupFunds,
        wishlist.Category,
        wishlist.RevealSuggestions,
        wishlist.AiEnabled,
        visibility
      );
      setWishlist(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update visibility');
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

  const displayItems = useMemo(() => {
    return items.map((item) => {
      if (editingItem && editingItemDraft && item.Id === editingItem.Id) {
        return {
          ...item,
          ...editingItemDraft,
          Links: editingItemDraft.Links ? editingItemDraft.Links : item.Links
        };
      }
      return item;
    });
  }, [items, editingItem, editingItemDraft]);

  const groupedItems = useMemo(() => {
    const filtered = displayItems.filter((item) => {
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
  }, [displayItems, searchQuery]);

  const selectedItem = useMemo(() => {
    return displayItems.find((i) => i.Id === selectedItemId);
  }, [displayItems, selectedItemId]);

  const selectedItemPriorityLabel = useMemo(() => {
    if (!selectedItemId) return undefined;
    const group = groupedItems.find((g) =>
      g.items.some((i) => i.Id === selectedItemId)
    );
    return group?.label;
  }, [groupedItems, selectedItemId]);

  useEffect(() => {
    if (selectedItemId && !displayItems.some((i) => i.Id === selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [displayItems, selectedItemId]);

  return (
    <WishlistDetailTemplate
      isWishlistLoading={isWishlistLoading}
      wishlistError={wishlistError}
      wishlist={wishlist}
      items={items}
      priorities={priorities}
      isOwner={isOwner}
      canCollaborate={canCollaborate}
      isExpired={isExpired}
      isAddOpen={isAddOpen}
      setIsAddOpen={setIsAddOpen}
      editingItem={editingItem}
      setEditingItem={setEditingItem}
      setEditingItemDraft={setEditingItemDraft}
      linkedItemIds={linkedItemIds}
      setLinkedItemIds={setLinkedItemIds}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActive}
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
      saveVisibility={saveVisibility}
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
