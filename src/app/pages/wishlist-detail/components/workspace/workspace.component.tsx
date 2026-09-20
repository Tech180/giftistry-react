import React from 'react';
import { AddWidget } from '../add-widget/add-widget.component';
import type { Props } from './interfaces/props.interface';
import { WorkspaceTemplate } from './workspace.html';

export const Workspace: React.FC<Props> = (props) => {
  const {
    wishlist,
    canSuggest,
    canAutoAdd,
    isAutoAddOpen,
    openAutoAdd,
    closeAutoAdd,
    openAddDrawer,
    onAutoAddStarted,
    items,
    groupedItems,
    collapsedGroupKeys,
    toggleGroupCollapsed,
    viewMode,
    isLoading,
    searchQuery,
    setSearchQuery,
    enrichingItemIds,
    isOwner,
    isExpired,
    isArchived,
    canCollaborate,
    isPublicGuest,
    isLocked,
    itemActions,
    isAddOpen,
    editingItem,
    viewingItem,
    isLinkingModeActive,
    isRelatingModeActive,
    isTaggingModeActive,
    isReplyTaggingModeActive,
    linkedItemIds,
    relatedItemIds,
    taggedItemIds,
    replyTaggedItemIds,
    isItemLinkCompatible,
    isItemRelateCompatible,
    handleLinkItemToggle,
    handleRelateItemToggle,
    handleSelectTag,
    handleSelectReplyTag,
    openItemEditor,
    openItemViewer,
    openClaimerSubstitutionCreate,
    openClaimerSubstitutionEdit,
    deleteClaimerSubstitution,
    openSubstitutionEdit,
    deleteSubstitutionOption,
    shouldOpenItemViewer,
    selectedItemId,
    setSelectedItemId,
    displayItems,
    handleItemTaggedClick,
    onLinkedItemsUnsupported,
  } = props;

  const addItemWidget = canSuggest ? (
    <AddWidget
      listId = {
        wishlist.Id
      }
      isInputMode = {
        isAutoAddOpen
      }
      canAutoAdd = {
        canAutoAdd
      }
      onEnterInputMode = {
        openAutoAdd
      }
      onExitInputMode = {
        closeAutoAdd
      }
      onManual = {
        openAddDrawer
      }
      onStarted = {
        onAutoAddStarted
      }
    />
  ) : null;

  const itemsProps = {
    items,
    groupedItems,
    collapsedGroupKeys,
    toggleGroupCollapsed,
    viewMode,
    isLoading,
    searchQuery,
    setSearchQuery,
    canSuggest,
    canAutoAdd,
    openAutoAdd,
    openAddDrawer,
    enrichingItemIds,
    isOwner,
    isExpired,
    isArchived,
    canCollaborate,
    isPublicGuest,
    isLocked,
    allowGroupFunds: wishlist.AllowGroupFunds,
    aiEnabled: wishlist.AiEnabled,
    itemActions,
    isAddOpen,
    editingItem,
    viewingItem,
    isLinkingModeActive,
    isRelatingModeActive,
    isTaggingModeActive,
    isReplyTaggingModeActive,
    linkedItemIds,
    relatedItemIds,
    taggedItemIds,
    replyTaggedItemIds,
    isItemLinkCompatible,
    isItemRelateCompatible,
    handleLinkItemToggle,
    handleRelateItemToggle,
    handleSelectTag,
    handleSelectReplyTag,
    openItemEditor,
    openItemViewer,
    openClaimerSubstitutionCreate,
    openClaimerSubstitutionEdit,
    deleteClaimerSubstitution,
    openSubstitutionEdit,
    deleteSubstitutionOption,
    shouldOpenItemViewer,
    selectedItemId,
    setSelectedItemId,
    displayItems,
    handleItemTaggedClick,
    onLinkedItemsUnsupported,
  };

  return (
    <WorkspaceTemplate
      {...props}
      addItemWidget = {
        addItemWidget
      }
      itemsProps = {
        itemsProps
      }
    />
  );
};
