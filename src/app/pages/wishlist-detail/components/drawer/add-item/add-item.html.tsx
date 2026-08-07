import React from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { Drawer, MiniDrawer, Button, AiStatusBadge } from 'shared/ui';
import { AddItemForm, ADD_ITEM_FORM_ID } from 'features/items';
import { AddItemTemplateProps } from './interfaces/add-item-template-props.interface';

const ASSOCIATION_RAIL_MIN_WIDTH = '4.875rem';

const AssociationMiniDrawers: React.FC<{
  inlineOnMobile?: boolean;
  linkableItems: AddItemTemplateProps['linkableItems'];
  linkedItemIds: string[];
  relatedItemIds: string[];
  setLinkedItemIds: AddItemTemplateProps['setLinkedItemIds'];
  setRelatedItemIds: AddItemTemplateProps['setRelatedItemIds'];
  onItemTaggedClick?: (itemId: string) => void;
  isLinkingModeActive: boolean;
  isRelatingModeActive: boolean;
}> = ({
  inlineOnMobile = false,
  linkableItems,
  linkedItemIds,
  relatedItemIds,
  setLinkedItemIds,
  setRelatedItemIds,
  onItemTaggedClick,
  isLinkingModeActive,
  isRelatingModeActive,
}) => {
  const showLinked = isLinkingModeActive || linkedItemIds.length > 0;
  const showRelated = isRelatingModeActive || relatedItemIds.length > 0;
  const relatedEdgeOffset =
    !inlineOnMobile && showLinked && showRelated ? ASSOCIATION_RAIL_MIN_WIDTH : undefined;

  return (
    <>
      <MiniDrawer
        items={linkableItems}
        selectedIds={linkedItemIds}
        onRemoveId={(id) => setLinkedItemIds((prev) => prev.filter((lid) => lid !== id))}
        onItemClick={onItemTaggedClick}
        isActive={isLinkingModeActive}
        position="left"
        label="Linked"
        inlineOnMobile={inlineOnMobile}
      />
      <MiniDrawer
        items={linkableItems}
        selectedIds={relatedItemIds}
        onRemoveId={(id) => setRelatedItemIds((prev) => prev.filter((rid) => rid !== id))}
        onItemClick={onItemTaggedClick}
        isActive={isRelatingModeActive}
        position="left"
        label="Related"
        inlineOnMobile={inlineOnMobile}
        edgeOffset={relatedEdgeOffset}
      />
    </>
  );
};

export const AddItemTemplate: React.FC<AddItemTemplateProps> = ({
  isOpen,
  editingItem,
  linkableItems,
  resolvedLinkedItems,
  resolvedRelatedItems,
  linkedItemIds,
  setLinkedItemIds,
  relatedItemIds,
  setRelatedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  collapseDrawerWhileLinking = false,
  handleLinkingAudienceChange,
  isOwner,
  listId,
  listAiEnabled,
  listManualJobBackground = true,
  canUseWebSearchOnList = false,
  canShowAi,
  onClose,
  onSuccess,
  onAutoEnrichStarted,
  setEditingItemDraft,
  loadData,
  listShares,
  isLoading = false,
  isFormDirty = true,
  onFormLoadingChange,
  onFormDirtyChange,
  onItemTaggedClick,
}) => {
  const isEdit = !!editingItem;
  const isDrawerOpen = isOpen && !collapseDrawerWhileLinking;

  return (
    <Drawer
      isOpen={isDrawerOpen}
      position="left"
      title={isEdit ? 'Edit Item' : 'Add New Item'}
      titleIcon={isEdit ? <Pencil size={18} /> : <PlusCircle size={18} />}
      mobilePresentation="sheet"
      headerExtra={
        canShowAi ? (
          <AiStatusBadge
            size="compact"
            enabled={listAiEnabled}
            ariaLabelEnabled="AI reviews enabled for this list"
            ariaLabelDisabled="AI reviews disabled for this list"
          />
        ) : undefined
      }
      onClose={onClose}
      overflowVisible={true}
      miniDrawer={
        <AssociationMiniDrawers
          linkableItems={linkableItems}
          linkedItemIds={linkedItemIds}
          relatedItemIds={relatedItemIds}
          setLinkedItemIds={setLinkedItemIds}
          setRelatedItemIds={setRelatedItemIds}
          onItemTaggedClick={onItemTaggedClick}
          isLinkingModeActive={isLinkingModeActive}
          isRelatingModeActive={isRelatingModeActive}
        />
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            form={ADD_ITEM_FORM_ID}
            variant="primary"
            isLoading={isLoading}
            disabled={isEdit && !isFormDirty}
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <AddItemForm
        key={editingItem?.Id ?? 'add'}
        listId={listId}
        isOwner={isOwner}
        item={editingItem}
        existingCategories={Array.from(
          new Set(
            linkableItems
              .map((item) => item.Category?.trim())
              .filter((cat): cat is string => !!cat && cat !== 'uncategorized')
          )
        )}
        onDraftChange={setEditingItemDraft}
        wishlistItems={linkableItems}
        linkedItemIds={linkedItemIds}
        resolvedLinkedCount={resolvedLinkedItems.length}
        relatedItemIds={relatedItemIds}
        resolvedRelatedCount={resolvedRelatedItems.length}
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        isRelatingModeActive={isRelatingModeActive}
        setIsRelatingModeActive={setIsRelatingModeActive}
        onLinkingAudienceChange={handleLinkingAudienceChange}
        onPriorityChange={loadData}
        onItemEnriched={loadData}
        onAutoEnrichStarted={onAutoEnrichStarted}
        isOpen={isOpen}
        onSuccess={onSuccess}
        listShares={listShares}
        onLoadingChange={onFormLoadingChange}
        onDirtyChange={onFormDirtyChange}
        canShowAi={canShowAi}
        listAiEnabled={listAiEnabled}
        listManualJobBackground={listManualJobBackground}
        canUseWebSearchOnList={canUseWebSearchOnList}
      />
    </Drawer>
  );
};
