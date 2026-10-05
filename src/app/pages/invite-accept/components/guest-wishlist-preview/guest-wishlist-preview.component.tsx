import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X } from 'lucide-react';
import type { ImportStripHandle, Item } from 'features/items';
import { ItemsSessionProvider } from 'features/items';
import { CommentsSessionProvider } from 'features/comments';
import {
  ITEM_VIEW_MODE_STORAGE_KEY,
} from 'features/items/constants/item-view-mode.constants';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
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
import {
  isWishlistArchived,
  isWishlistExpired,
  isWishlistLocked,
  groupGuestPreviewItems,
  toGuestWishlist,
} from 'features/wishlists';
import { resolveShouldOpenItemViewer } from 'features/items/utils/resolve-should-open-item-viewer.util';
import { GUEST_ITEM_ACTIONS } from './constants/guest-item-actions.constant';
import { GuestWishlistPreviewTemplate } from './guest-wishlist-preview.html';
import type { GuestWishlistPreviewProps } from './interfaces/guest-wishlist-preview-props.interface';
import { noop } from './utils/noop.util';
import { noopAsync } from './utils/noop-async.util';
import { useDoesAddSidebarOverlayList } from 'app/pages/wishlist-detail/hooks/use-does-add-sidebar-overlay-list';
import { getPageClassName } from 'app/pages/wishlist-detail/utils/get-page-class-name.util';
import { getPageShellFlags } from 'app/pages/wishlist-detail/utils/get-page-shell-flags.util';
import styles from './guest-wishlist-preview.module.css';

export const GuestWishlistPreview: React.FC<GuestWishlistPreviewProps> = ({
  wishlist: previewWishlist,
  items,
  groups,
  refreshError = null,
  onDismissRefreshError = noop,
}) => {
  const navigate = useNavigate();
  const wishlist = toGuestWishlist(previewWishlist);
  const importStripRef = useRef<ImportStripHandle | null>(null);
  const [viewMode, setViewMode] = useState<ItemViewMode>(() =>
    normalizeStoredViewMode(
      typeof localStorage === 'undefined' ? null : localStorage.getItem(ITEM_VIEW_MODE_STORAGE_KEY)
    )
  );
  const supportsKanbanViewMode = useSupportsKanbanViewMode();
  const doesAddSidebarOverlayList = useDoesAddSidebarOverlayList();
  const effectiveViewMode = useMemo(
    () => resolveEffectiveViewMode(viewMode, supportsKanbanViewMode),
    [viewMode, supportsKanbanViewMode]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(new Set());
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showDeletedComments, setShowDeletedComments] = useState(false);
  const [hasDeletedComments, setHasDeletedComments] = useState(false);
  const handleHasDeletedCommentsChange = (hasDeleted: boolean) => {
    setHasDeletedComments(hasDeleted);
    if (!hasDeleted) {
      setShowDeletedComments(false);
    }
  };
  const [isLinkingModeActive, setIsLinkingModeActive] = useState(false);
  const [isRelatingModeActive, setIsRelatingModeActive] = useState(false);
  const [viewingItemId, setViewingItemId] = useState<string | null>(null);
  const viewingItem = useMemo(
    () => (viewingItemId ? items.find((item) => item.Id === viewingItemId) ?? null : null),
    [items, viewingItemId]
  );
  const setViewingItem = useCallback((item: Item | null) => {
    setViewingItemId(item?.Id ?? null);
  }, []);
  const { linkedItemIds, relatedItemIds } = useMemo(() => {
    if (!viewingItem) {
      return { linkedItemIds: [] as string[], relatedItemIds: [] as string[] };
    }

    const sourceContext = linkingContextFromItem(viewingItem);
    const isCompatibleLink = (id: string) => {
      const target = items.find((i) => i.Id === id);
      return !!target && canLinkItemsByAudience(sourceContext, target);
    };

    return {
      linkedItemIds: resolveEditorLinkedItemIds(viewingItem.Id, items).filter(isCompatibleLink),
      relatedItemIds: resolveEditorRelatedItemIds(viewingItem.Id, items).filter(isCompatibleLink),
    };
  }, [viewingItem, items]);

  const isExpired = isWishlistExpired(wishlist.ExpiresAt);
  const isArchived = isWishlistArchived(wishlist.IsActive);
  const isLocked = isWishlistLocked(isExpired, isArchived);
  const shouldOpenItemViewer = resolveShouldOpenItemViewer({
    isOwner: false,
    canCollaborate: false,
    isPublicGuest: true,
    isLocked,
  });

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

  const [viewingSubstitutionOptionId, setViewingSubstitutionOptionId] = useState<string | null>(
    null
  );

  const openItemViewer = (item: Item, options?: { substitutionOptionId?: string }) => {
    setSelectedItemId(null);
    setIsCommentsOpen(false);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
    setViewingItemId(item.Id);
    setViewingSubstitutionOptionId(options?.substitutionOptionId ?? null);
  };

  const shellFlags = getPageShellFlags({
    canSuggest: false,
    canShowAi: false,
    aiEnabled: false,
    isExpired,
    isArchived,
    isAddOpen: false,
    hasEditingItem: false,
    hasViewingItem: !!viewingItem,
    isLinkingModeActive,
    isRelatingModeActive,
    isTaggingModeActive: false,
    isReplyTaggingModeActive: false,
    doesAddSidebarOverlayList,
    isCommentsOpen,
    selectedItemId,
  });

  return (
    <ItemsSessionProvider>
      <CommentsSessionProvider>
        <>
          {refreshError ? (
            <div className={styles['refresh-banner']} role="alert">
              <AlertTriangle size={16} className={styles['refresh-banner__icon']} aria-hidden />
              <span className={styles['refresh-banner__text']}>{refreshError}</span>
              <button
                type="button"
                className={styles['refresh-banner__dismiss']}
                onClick={onDismissRefreshError}
                aria-label="Dismiss"
              >
                <X size={14} aria-hidden />
              </button>
            </div>
          ) : null}
          <GuestWishlistPreviewTemplate
      isWishlistLoading={false}
      wishlistError={null}
      onGoHome={() => navigate('/login')}
      {...shellFlags}
      pageClassName={getPageClassName(shellFlags.isItemDrawerVisible, viewMode, isCommentsOpen)}
      wishlist={wishlist}
      items={items}
      priorities={[]}
      isOwner={false}
      canCollaborate={false}
      canSuggest={false}
      isPublicGuest
      isExpired={isExpired}
      isArchived={isArchived}
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
      viewingSubstitutionOptionId={viewingSubstitutionOptionId}
      openClaimerSubstitutionCreate={noop}
      claimerSubstitutionCreateNonce={0}
      openClaimerSubstitutionEdit={noop}
      claimerSubstitutionEditNonce={0}
      claimerSubstitutionEditId={null}
      deleteClaimerSubstitution={async () => undefined}
      openSubstitutionEdit={noop}
      deleteSubstitutionOption={async () => undefined}
      clearSubstitutionAutoOpen={noop}
      shouldOpenItemViewer={shouldOpenItemViewer}
      setEditingItemDraft={noop}
      linkedItemIds={linkedItemIds}
      setLinkedItemIds={noop}
      relatedItemIds={relatedItemIds}
      setRelatedItemIds={noop}
      linkableItems={items}
      resolvedLinkedItems={resolvedLinkedItems}
      resolvedRelatedItems={resolvedRelatedItems}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActive}
      isRelatingModeActive={isRelatingModeActive}
      setIsRelatingModeActive={setIsRelatingModeActive}
      doesAddSidebarOverlayList={doesAddSidebarOverlayList}
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
      handleDuplicate={noop}
      isDuplicating={false}
      saveTitle={noopAsync}
      saveDate={noopAsync}
      formatDate={formatWishlistExpirationDate}
      isCommentsOpen={isCommentsOpen}
      setIsCommentsOpen={setIsCommentsOpen}
      showDeletedComments={showDeletedComments}
      hasDeletedComments={hasDeletedComments}
      onHasDeletedCommentsChange={handleHasDeletedCommentsChange}
      onToggleShowDeletedComments={() => setShowDeletedComments((prev) => !prev)}
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
        </>
      </CommentsSessionProvider>
    </ItemsSessionProvider>
  );
};
