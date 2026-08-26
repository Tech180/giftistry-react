import React, { useMemo, useRef, useState } from 'react';
import type { ImportStripHandle, Item } from 'features/items';
import {
  ITEM_VIEW_MODE_STORAGE_KEY,
} from 'features/items/constants/item-view-mode.constants';
import type { ItemViewMode } from 'features/items/types/item-view-mode.type';
import {
  isKanbanViewMode,
  normalizeStoredViewMode,
  resolveEffectiveViewMode,
} from 'features/items/utils/item-view-mode.util';
import { resolveEditorLinkedItemIds } from 'features/items/utils/item-links-sync.util';
import { resolveEditorRelatedItemIds } from 'features/items/utils/item-related-sync.util';
import {
  canLinkItemsByAudience,
  linkingContextFromItem,
} from 'features/items/utils/item-audience.util';
import { formatWishlistExpirationDate } from 'shared/utils/format-date.util';
import { useSupportsKanbanViewMode } from 'shared/hooks/use-supports-kanban-view-mode';
import { isWishlistArchived } from 'features/wishlists/utils/is-wishlist-archived.util';
import { isWishlistExpired } from 'features/wishlists/utils/is-wishlist-expired.util';
import { groupGuestPreviewItems } from 'features/wishlists/utils/group-guest-preview-items.util';
import { toGuestWishlist } from 'features/wishlists/utils/to-guest-wishlist.util';
import { GUEST_ITEM_ACTIONS } from './constants/guest-item-actions.constant';
import { GuestWishlistPreviewTemplate } from './guest-wishlist-preview.html';
import type { GuestWishlistPreviewProps } from './interfaces/guest-wishlist-preview-props.interface';

const noop = () => undefined;
const noopAsync = async () => undefined;

export const GuestWishlistPreview: React.FC<GuestWishlistPreviewProps> = ({
  wishlist: previewWishlist,
  items,
  groups,
}) => {
  const wishlist = toGuestWishlist(previewWishlist);
  const importStripRef = useRef<ImportStripHandle | null>(null);
  const [viewMode, setViewMode] = useState<ItemViewMode>(() =>
    normalizeStoredViewMode(
      typeof localStorage === 'undefined' ? null : localStorage.getItem(ITEM_VIEW_MODE_STORAGE_KEY)
    )
  );
  const supportsKanbanViewMode = useSupportsKanbanViewMode();
  const effectiveViewMode = useMemo(
    () => resolveEffectiveViewMode(viewMode, supportsKanbanViewMode),
    [viewMode, supportsKanbanViewMode]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(new Set());
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLinkingModeActive, setIsLinkingModeActive] = useState(false);
  const [isRelatingModeActive, setIsRelatingModeActive] = useState(false);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [linkedItemIds, setLinkedItemIds] = useState<string[]>([]);
  const [relatedItemIds, setRelatedItemIds] = useState<string[]>([]);

  const groupedItems = useMemo(
    () => groupGuestPreviewItems(items, groups, searchQuery),
    [items, groups, searchQuery]
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.Id === selectedItemId) ?? null,
    [items, selectedItemId]
  );

  const selectedItemPriorityLabel = useMemo(() => {
    if (!selectedItemId) return undefined;
    return groupedItems.find((group) => group.items.some((item) => item.Id === selectedItemId))?.label;
  }, [groupedItems, selectedItemId]);

  const resolvedLinkedItems = useMemo(
    () => items.filter((item) => linkedItemIds.includes(item.Id)),
    [items, linkedItemIds]
  );

  const resolvedRelatedItems = useMemo(
    () => items.filter((item) => relatedItemIds.includes(item.Id)),
    [items, relatedItemIds]
  );

  const handleSetViewMode = (mode: ItemViewMode) => {
    if (isKanbanViewMode(mode) && !supportsKanbanViewMode) {
      return;
    }
    setViewMode(mode);
    localStorage.setItem(ITEM_VIEW_MODE_STORAGE_KEY, mode);
  };

  const openItemViewer = (item: Item) => {
    const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
    const sourceContext = linkingContextFromItem(sourceItem);
    setSelectedItemId(null);
    setIsCommentsOpen(false);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
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
    setViewingItem(sourceItem);
  };

  return (
    <GuestWishlistPreviewTemplate
      isWishlistLoading={false}
      wishlistError={null}
      wishlist={wishlist}
      items={items}
      priorities={[]}
      isOwner={false}
      canCollaborate={false}
      canSuggest={false}
      isPublicGuest
      isExpired={isWishlistExpired(wishlist.ExpiresAt)}
      isArchived={isWishlistArchived(wishlist.IsActive)}
      isAddOpen={false}
      setIsAddOpen={noop}
      openAddDrawer={noop}
      isAutoAddOpen={false}
      openAutoAdd={noop}
      closeAutoAdd={noop}
      onAutoAddStarted={noop}
      enrichingItemIds={new Set()}
      editingItem={null}
      setEditingItem={noop}
      openItemEditor={noop}
      viewingItem={viewingItem}
      setViewingItem={setViewingItem}
      openItemViewer={openItemViewer}
      openClaimerSubstitutionCreate={noop}
      claimerSubstitutionCreateNonce={0}
      openClaimerSubstitutionEdit={noop}
      claimerSubstitutionEditNonce={0}
      claimerSubstitutionEditId={null}
      deleteClaimerSubstitution={async () => undefined}
      openSubstitutionEdit={noop}
      deleteSubstitutionOption={async () => undefined}
      clearSubstitutionAutoOpen={noop}
      shouldOpenItemViewer={false}
      setEditingItemDraft={noop}
      linkedItemIds={linkedItemIds}
      setLinkedItemIds={setLinkedItemIds}
      relatedItemIds={relatedItemIds}
      setRelatedItemIds={setRelatedItemIds}
      linkableItems={items}
      resolvedLinkedItems={resolvedLinkedItems}
      resolvedRelatedItems={resolvedRelatedItems}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActive}
      isRelatingModeActive={isRelatingModeActive}
      setIsRelatingModeActive={setIsRelatingModeActive}
      doesAddSidebarOverlayList={false}
      handleLinkingAudienceChange={noop}
      isItemLinkCompatible={() => false}
      isItemRelateCompatible={() => false}
      handleLinkItemToggle={noop}
      handleRelateItemToggle={noop}
      loadData={noopAsync}
      reloadListContent={noopAsync}
      onItemsChange={noop}
      itemActions={GUEST_ITEM_ACTIONS}
      confirmAction={null}
      setConfirmAction={noop}
      isDeactivating={false}
      isActivating={false}
      isDeleting={false}
      handleDeactivateConfirm={noop}
      handleActivateConfirm={noop}
      handleDeleteConfirm={noop}
      saveTitle={noopAsync}
      saveDate={noopAsync}
      formatDate={formatWishlistExpirationDate}
      isCommentsOpen={isCommentsOpen}
      setIsCommentsOpen={setIsCommentsOpen}
      showDeletedComments={false}
      onToggleShowDeletedComments={noop}
      isShareOpen={false}
      setIsShareOpen={noop}
      isMobileFab={false}
      isImportOpen={false}
      setIsImportOpen={noop}
      importStripRef={importStripRef}
      viewMode={effectiveViewMode}
      supportsKanbanViewMode={supportsKanbanViewMode}
      handleSetViewMode={handleSetViewMode}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      selectedItem={selectedItem}
      setSelectedItemId={setSelectedItemId}
      selectedItemId={selectedItemId}
      selectedItemPriorityLabel={selectedItemPriorityLabel}
      groupedItems={groupedItems}
      collapsedGroupKeys={collapsedGroupKeys}
      toggleGroupCollapsed={(categoryKey) => {
        setCollapsedGroupKeys((prev) => {
          const next = new Set(prev);
          if (next.has(categoryKey)) {
            next.delete(categoryKey);
          } else {
            next.add(categoryKey);
          }
          return next;
        });
      }}
      displayItems={items}
      listShares={[]}
      handleItemTaggedClick={noop}
      onLinkedItemsUnsupported={noop}
      isTaggingModeActive={false}
      setIsTaggingModeActive={noop}
      taggedItemIds={[]}
      setTaggedItemIds={noop}
      isReplyTaggingModeActive={false}
      setIsReplyTaggingModeActive={noop}
      replyTaggedItemIds={[]}
      setReplyTaggedItemIds={noop}
      handleSelectTag={noop}
      handleSelectReplyTag={noop}
      isLoading={false}
      activeJob={null}
      isCancellingJob={false}
      onCancelJob={noop}
      canShowAi={false}
    />
  );
};
