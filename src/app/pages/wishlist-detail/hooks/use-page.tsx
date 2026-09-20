import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ITEM_VIEW_MODE_STORAGE_KEY } from 'features/items/constants/item-view-mode.constants';
import {
  isKanbanViewMode,
  normalizeStoredViewMode,
  resolveEffectiveViewMode,
} from 'features/items/utils/item-view-mode.util';
import type { ItemViewMode } from 'features/items/interfaces/item-view-mode.type';
import { LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE } from 'features/items/constants/linked-items-messages.constant';
import { resolveShouldOpenItemViewer } from 'features/items/utils/resolve-should-open-item-viewer.util';
import {
  isWishlistArchived,
  isWishlistExpired,
  isWishlistLocked,
} from 'features/wishlists';
import { useAuth } from 'features/auth';
import { useToast } from 'shared/providers/toast';
import { useIsMobileFab } from 'shared/hooks/use-is-mobile-fab';
import { useSupportsKanbanViewMode } from 'shared/hooks/use-supports-kanban-view-mode';
import { formatWishlistExpirationDate } from 'shared/utils/format-date.util';
import { OVERLAY_BREAKPOINT_MEDIA_QUERY } from '../constants/overlay-breakpoint.constant';
import type { UseItemSessionAssociationApi } from '../interfaces/use-item-session-association-api.interface';
import type { UsePageResult } from '../interfaces/use-page-result.interface';
import { groupItems } from '../utils/group-items.util';
import { getPageClassName } from '../utils/get-page-class-name.util';
import { getPageShellFlags } from '../utils/get-page-shell-flags.util';
import { useCommentTagPeek } from './use-comment-tag-peek';
import { useItemAssociations } from './use-item-associations';
import { useItemSession } from './use-item-session';
import { useListData } from './use-list-data';
import { useListLifecycle } from './use-list-lifecycle';
import { useListSettings } from './use-list-settings';

export function usePage(): UsePageResult {
  const navigate = useNavigate();
  const { user, canShowWebSearch, canShowAi } = useAuth();
  const { showToast } = useToast();
  const isMobileFab = useIsMobileFab();
  const supportsKanbanViewMode = useSupportsKanbanViewMode();

  const listData = useListData();
  const {
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
  } = listData;

  const isOwner = !!(wishlist && user && wishlist.UserId === user.Id);
  const canCollaborate = isOwner || wishlist?.Role === 'collaborator';
  const isExpired = isWishlistExpired(wishlist?.ExpiresAt);
  const isArchived = isWishlistArchived(wishlist?.IsActive);
  const isLocked = isWishlistLocked(isExpired, isArchived);
  const shouldOpenItemViewer = resolveShouldOpenItemViewer({
    isOwner,
    canCollaborate,
    isPublicGuest: false,
    isLocked,
  });
  const canSuggest = Boolean(user && wishlist && !isLocked);

  const lifecycle = useListLifecycle({ wishlist });
  const settings = useListSettings({
    wishlist,
    setWishlist,
    canShowWebSearch,
  });

  const associationsRef = useRef<UseItemSessionAssociationApi | null>(null);

  const session = useItemSession({
    items,
    wishlist,
    canCollaborate,
    canSuggest,
    canShowAi,
    loadData,
    softReloadItems,
    refreshJob: async () => {
      await refreshJob();
    },
    associationsRef,
  });

  const associations = useItemAssociations({
    items,
    isAddOpen: session.isAddOpen,
    editingItem: session.editingItem,
    viewingItem: session.viewingItem,
    editingItemDraft: session.editingItemDraft,
    canCollaborate,
    wishlistId: wishlist?.Id,
  });

  associationsRef.current = {
    primeForItem: associations.primeForItem,
    clear: associations.clear,
    resetForAdd: associations.resetForAdd,
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showDeletedComments, setShowDeletedComments] = useState(false);
  const [isTaggingModeActive, setIsTaggingModeActive] = useState(false);
  const [taggedItemIds, setTaggedItemIds] = useState<string[]>([]);
  const [isReplyTaggingModeActive, setIsReplyTaggingModeActive] = useState(false);
  const [replyTaggedItemIds, setReplyTaggedItemIds] = useState<string[]>([]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [collapsedGroupKeys, setCollapsedGroupKeys] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ItemViewMode>(() =>
    normalizeStoredViewMode(localStorage.getItem(ITEM_VIEW_MODE_STORAGE_KEY))
  );
  const [doesAddSidebarOverlayList, setDoesAddSidebarOverlayList] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return true;
    }
    return !window.matchMedia(OVERLAY_BREAKPOINT_MEDIA_QUERY).matches;
  });

  const effectiveViewMode = resolveEffectiveViewMode(viewMode, supportsKanbanViewMode);

  const commentPeek = useCommentTagPeek({
    isCommentsOpen,
    setIsCommentsOpen,
    isTaggingModeActive,
    isReplyTaggingModeActive,
  });

  useEffect(() => {
    if (selectedItemId !== null) {
      setIsCommentsOpen(false);
      session.setIsAddOpen(false);
      session.setEditingItem(null);
      session.setViewingItem(null);
    }
  }, [selectedItemId]);

  useEffect(() => {
    if (isCommentsOpen) {
      setSelectedItemId(null);
      session.setIsAddOpen(false);
      session.setEditingItem(null);
      session.setViewingItem(null);
    }
  }, [isCommentsOpen]);

  useEffect(() => {
    if (session.isAddOpen || session.editingItem || session.viewingItem) {
      setSelectedItemId(null);
      setIsCommentsOpen(false);
    }
  }, [session.isAddOpen, session.editingItem, session.viewingItem]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(OVERLAY_BREAKPOINT_MEDIA_QUERY);
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

  const toggleGroupCollapsed = (categoryKey: string) => {
    setCollapsedGroupKeys((prev) => {
      const next = new Set(prev);
      if (next.has(categoryKey)) {
        next.delete(categoryKey);
      } else {
        next.add(categoryKey);
      }
      return next;
    });
  };

  const handleSelectTag = (itemId: string) => {
    setTaggedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectReplyTag = (itemId: string) => {
    setReplyTaggedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const displayItems = useMemo(() => {
    return items.map((item) => {
      if (session.editingItem && session.editingItemDraft && item.Id === session.editingItem.Id) {
        return {
          ...item,
          ...session.editingItemDraft,
          Links:
            session.editingItemDraft.Links !== undefined
              ? session.editingItemDraft.Links
              : item.Links,
          SharedWith:
            session.editingItemDraft.SharedWith !== undefined
              ? session.editingItemDraft.SharedWith
              : item.SharedWith,
        };
      }
      return item;
    });
  }, [items, session.editingItem, session.editingItemDraft]);

  const groupedItems = useMemo(
    () =>
      groupItems({
        visibleItems: displayItems,
        searchQuery,
        itemGroups,
        enrichingItemIds,
      }),
    [displayItems, searchQuery, itemGroups, enrichingItemIds]
  );

  const selectedItem = useMemo(
    () => displayItems.find((i) => i.Id === selectedItemId) ?? null,
    [displayItems, selectedItemId]
  );

  const selectedItemPriorityLabel = useMemo(() => {
    if (!selectedItemId) {
      return undefined;
    }
    const group = groupedItems.find((g) => g.items.some((i) => i.Id === selectedItemId));
    return group?.label;
  }, [groupedItems, selectedItemId]);

  useEffect(() => {
    if (selectedItemId && !displayItems.some((i) => i.Id === selectedItemId)) {
      setSelectedItemId(null);
    }
  }, [displayItems, selectedItemId]);

  const mobileActions = {
    wishlist,
    isOwner,
    canCollaborate,
    isArchived,
    isLocked,
    canShowAi,
    canShowWebSearch,
    isDeactivating: lifecycle.isDeactivating,
    isActivating: lifecycle.isActivating,
    isDeleting: lifecycle.isDeleting,
    isDuplicating: lifecycle.isDuplicating,
    isMobileFab,
    user,
    reloadListContent,
    handleDuplicate: lifecycle.handleDuplicate,
    handleActivateConfirm: lifecycle.handleActivateConfirm,
    handleDeactivateConfirm: lifecycle.handleDeactivateConfirm,
    handleDeleteConfirm: lifecycle.handleDeleteConfirm,
    setIsCommentsOpen,
    setIsShareOpen,
    toggleAiEnabled: settings.toggleAiEnabled,
    toggleWebSearchEnabled: settings.toggleWebSearchEnabled,
    toggleManualJobBackground: settings.toggleManualJobBackground,
    toggleAutoRollover: settings.toggleAutoRollover,
    toggleAllowGroupFunds: settings.toggleAllowGroupFunds,
  };

  const onGoHome = () => {
    navigate('/dashboard');
  };

  const shellFlags = getPageShellFlags({
    canSuggest,
    canShowAi,
    aiEnabled: wishlist?.AiEnabled,
    isExpired,
    isArchived,
    isAddOpen: session.isAddOpen,
    hasEditingItem: !!session.editingItem,
    hasViewingItem: !!session.viewingItem,
    isLinkingModeActive: associations.isLinkingModeActive,
    isRelatingModeActive: associations.isRelatingModeActive,
    isTaggingModeActive,
    isReplyTaggingModeActive,
    doesAddSidebarOverlayList,
    isCommentsOpen,
    selectedItemId,
  });

  return {
    isWishlistLoading,
    wishlistError,
    onGoHome,
    ...shellFlags,
    pageClassName: getPageClassName(shellFlags.isItemDrawerVisible, viewMode, isCommentsOpen),
    wishlist,
    items: displayItems,
    priorities,
    isOwner,
    canCollaborate,
    canSuggest,
    isPublicGuest: false,
    isExpired,
    isArchived,
    isAddOpen: session.isAddOpen,
    setIsAddOpen: session.setIsAddOpen,
    openAddDrawer: session.openAddDrawer,
    isAutoAddOpen: session.isAutoAddOpen,
    openAutoAdd: session.openAutoAdd,
    closeAutoAdd: session.closeAutoAdd,
    onAutoAddStarted: session.onAutoAddStarted,
    enrichingItemIds,
    editingItem: session.editingItem,
    setEditingItem: session.setEditingItem,
    openItemEditor: session.openItemEditor,
    viewingItem: session.viewingItem,
    setViewingItem: session.setViewingItem,
    openItemViewer: session.openItemViewer,
    openClaimerSubstitutionCreate: session.openClaimerSubstitutionCreate,
    claimerSubstitutionCreateNonce: session.claimerSubstitutionCreateNonce,
    openClaimerSubstitutionEdit: session.openClaimerSubstitutionEdit,
    claimerSubstitutionEditNonce: session.claimerSubstitutionEditNonce,
    claimerSubstitutionEditId: session.claimerSubstitutionEditId,
    deleteClaimerSubstitution: session.deleteClaimerSubstitution,
    openSubstitutionEdit: session.openSubstitutionEdit,
    deleteSubstitutionOption: session.deleteSubstitutionOption,
    clearSubstitutionAutoOpen: session.clearSubstitutionAutoOpen,
    shouldOpenItemViewer,
    setEditingItemDraft: session.setEditingItemDraft,
    linkedItemIds: associations.linkedItemIds,
    setLinkedItemIds: associations.setLinkedItemIds,
    relatedItemIds: associations.relatedItemIds,
    setRelatedItemIds: associations.setRelatedItemIds,
    linkableItems: items,
    resolvedLinkedItems: associations.resolvedLinkedItems,
    resolvedRelatedItems: associations.resolvedRelatedItems,
    isLinkingModeActive: associations.isLinkingModeActive,
    setIsLinkingModeActive: associations.setIsLinkingModeActive,
    isRelatingModeActive: associations.isRelatingModeActive,
    setIsRelatingModeActive: associations.setIsRelatingModeActive,
    doesAddSidebarOverlayList,
    handleLinkingAudienceChange: associations.handleLinkingAudienceChange,
    isItemLinkCompatible: associations.isItemLinkCompatible,
    isItemRelateCompatible: associations.isItemRelateCompatible,
    handleLinkItemToggle: associations.handleLinkItemToggle,
    handleRelateItemToggle: associations.handleRelateItemToggle,
    loadData,
    reloadListContent,
    onItemsChange: softReloadItems,
    itemActions,
    confirmAction: lifecycle.confirmAction,
    setConfirmAction: lifecycle.setConfirmAction,
    isDeactivating: lifecycle.isDeactivating,
    isActivating: lifecycle.isActivating,
    isDeleting: lifecycle.isDeleting,
    handleDeactivateConfirm: lifecycle.handleDeactivateConfirm,
    handleActivateConfirm: lifecycle.handleActivateConfirm,
    handleDeleteConfirm: lifecycle.handleDeleteConfirm,
    handleDuplicate: lifecycle.handleDuplicate,
    isDuplicating: lifecycle.isDuplicating,
    saveTitle: settings.saveTitle,
    saveDate: settings.saveDate,
    toggleAiEnabled: settings.toggleAiEnabled,
    toggleWebSearchEnabled: settings.toggleWebSearchEnabled,
    toggleManualJobBackground: settings.toggleManualJobBackground,
    toggleAutoRollover: settings.toggleAutoRollover,
    toggleAllowGroupFunds: settings.toggleAllowGroupFunds,
    canUseWebSearchOnList: settings.canUseWebSearchOnList,
    formatDate: formatWishlistExpirationDate,
    isCommentsOpen,
    setIsCommentsOpen,
    showDeletedComments,
    onToggleShowDeletedComments: () => setShowDeletedComments((prev) => !prev),
    isShareOpen,
    setIsShareOpen,
    isMobileFab,
    isImportOpen: session.isImportOpen,
    setIsImportOpen: session.setIsImportOpen,
    importStripRef: session.importStripRef,
    viewMode: effectiveViewMode,
    supportsKanbanViewMode,
    handleSetViewMode,
    searchQuery,
    setSearchQuery,
    selectedItem,
    setSelectedItemId,
    selectedItemId,
    selectedItemPriorityLabel,
    groupedItems,
    collapsedGroupKeys,
    toggleGroupCollapsed,
    displayItems,
    listShares,
    handleItemTaggedClick: commentPeek.handleItemTaggedClick,
    onLinkedItemsUnsupported: () =>
      showToast(LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE, 'error'),
    isHighlightInteractionLocked: commentPeek.isHighlightInteractionLocked,
    isTaggingModeActive,
    setIsTaggingModeActive,
    taggedItemIds,
    setTaggedItemIds,
    isReplyTaggingModeActive,
    setIsReplyTaggingModeActive,
    replyTaggedItemIds,
    setReplyTaggedItemIds,
    handleSelectTag,
    handleSelectReplyTag,
    isLoading: isItemsLoading,
    activeJob,
    isCancellingJob,
    onCancelJob,
    canShowAi,
    mobileActions,
  };
}
