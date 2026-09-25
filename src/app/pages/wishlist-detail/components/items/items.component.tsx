import React from 'react';
import type { Item } from 'features/items';
import type { ItemCardProps } from 'features/items';
import { TOUR_TARGETS, useTourDemoOptional } from 'features/tour';
import type { Props } from './interfaces/props.interface';
import type { ItemCardRender } from './interfaces/item-card-render.interface';
import { getGroupsClassName } from './utils/get-groups-class-name.util';
import { ItemsTemplate } from './items.html';

export const Items: React.FC<Props> = (props) => {
  const demo = useTourDemoOptional();
  const {
    enrichingItemIds,
    viewMode,
    isOwner,
    isExpired,
    isArchived,
    canCollaborate,
    isPublicGuest = false,
    isLocked,
    allowGroupFunds,
    aiEnabled,
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

  const isFormSessionActive = isAddOpen || !!editingItem;
  const isAssociationModeActive = isLinkingModeActive || isRelatingModeActive;
  const claimerSubsLocked = isLocked || canCollaborate;
  const compactTaggingActive =
    isTaggingModeActive || isReplyTaggingModeActive || (isFormSessionActive && isAssociationModeActive);
  const canShowTrailingActions =
    (isPublicGuest && shouldOpenItemViewer) || (!isPublicGuest && (canCollaborate || !isOwner) && !isLocked);

  const buildItemCard = (item: Item, priorityLabel: string): ItemCardRender => {
    if (enrichingItemIds.has(item.Id)) {
      return { kind: 'skeleton', viewMode };
    }

    const isEditingSelf = !!editingItem && item.Id === editingItem.Id;
    const associationTaggable =
      isAssociationModeActive &&
      !isEditingSelf &&
      (isLinkingModeActive ? isItemLinkCompatible(item) : isItemRelateCompatible(item));

    const onSelectTag = () => {
      if (isFormSessionActive) {
        if (isEditingSelf) {
          return;
        }
        if (isRelatingModeActive) {
          handleRelateItemToggle(item.Id);
          return;
        }
        handleLinkItemToggle(item.Id);
        return;
      }
      if (isReplyTaggingModeActive) {
        handleSelectReplyTag(item.Id);
        return;
      }
      handleSelectTag(item.Id);
    };

    let onSelect: ItemCardProps['onSelect'];
    if (viewMode === 'grid') {
      onSelect = shouldOpenItemViewer ? () => openItemViewer(item) : () => setSelectedItemId(item.Id);
    }

    const cardProps: ItemCardProps = {
      item,
      priorityLabel,
      isOwner,
      isExpired,
      isArchived,
      canCollaborate: canCollaborate && !isLocked,
      isPublicGuest,
      allowGroupFunds,
      itemActions,
      onEdit: isLocked ? undefined : () => openItemEditor(item),
      onAddSubstitution: claimerSubsLocked ? undefined : () => openClaimerSubstitutionCreate(item),
      onEditSubstitution: claimerSubsLocked ? undefined : () => openClaimerSubstitutionEdit(item),
      onDeleteSubstitution: claimerSubsLocked ? undefined : () => deleteClaimerSubstitution(item),
      onEditSubstitutionOption: isLocked ? undefined : (option) => openSubstitutionEdit(item, option.Id),
      onDeleteSubstitutionOption: isLocked ? undefined : (option) => deleteSubstitutionOption(option.Id),
      aiEnabled,
      isTaggingModeActive: isFormSessionActive ? associationTaggable : isTaggingModeActive || isReplyTaggingModeActive,
      isTaggedSelection: isFormSessionActive
        ? (isLinkingModeActive && linkedItemIds.includes(item.Id)) || (isRelatingModeActive && relatedItemIds.includes(item.Id))
        : (isReplyTaggingModeActive ? replyTaggedItemIds : taggedItemIds).includes(item.Id),
      onSelectTag,
      viewMode,
      isSelected: selectedItemId === item.Id || viewingItem?.Id === item.Id,
      onSelect,
      onView: shouldOpenItemViewer && viewMode !== 'grid' ? () => openItemViewer(item) : undefined,
      wishlistItems: displayItems,
      isLinkingContext: isFormSessionActive && isLinkingModeActive,
      isRelatingContext: isFormSessionActive && isRelatingModeActive,
      onLinkedItemNavigate: handleItemTaggedClick,
      onLinkedItemsUnsupported,
    };

    return { kind: 'card', props: cardProps };
  };

  return (
    <ItemsTemplate
      items = {
        props.items
      }
      groupedItems = {
        props.groupedItems
      }
      collapsedGroupKeys = {
        props.collapsedGroupKeys
      }
      toggleGroupCollapsed = {
        props.toggleGroupCollapsed
      }
      viewMode = {
        viewMode
      }
      isLoading = {
        props.isLoading
      }
      searchQuery = {
        props.searchQuery
      }
      setSearchQuery = {
        props.setSearchQuery
      }
      canSuggest = {
        props.canSuggest
      }
      canAutoAdd = {
        props.canAutoAdd
      }
      openAutoAdd = {
        props.openAutoAdd
      }
      openAddDrawer = {
        props.openAddDrawer
      }
      allowGroupFunds = {
        allowGroupFunds
      }
      isOwner = {
        isOwner
      }
      compactTaggingActive = {
        compactTaggingActive
      }
      canShowTrailingActions = {
        canShowTrailingActions
      }
      chevronSize = {
        viewMode === 'grid' ? 14 : 16
      }
      groupsClassName = {
        getGroupsClassName(viewMode)
      }
      buildItemCard = {
        buildItemCard
      }
      demoItemsTourTarget = {
        demo?.active ? TOUR_TARGETS.demoItems : undefined
      }
      highlightedItemId = {
        demo?.highlightedItemId ?? null
      }
    />
  );
};
