import React from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { Drawer, MiniDrawer, Button, AiStatusBadge } from 'shared/ui';
import { AddItemForm, ADD_ITEM_FORM_ID } from 'features/items';
import { AddItemTemplateProps } from './interfaces/add-item-template-props.interface';

export const AddItemTemplate: React.FC<AddItemTemplateProps> = ({
  isOpen,
  editingItem,
  items,
  linkableItems,
  resolvedLinkedItems,
  linkedItemIds,
  setLinkedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  handleLinkingAudienceChange,
  isOwner,
  listId,
  listAiEnabled,
  canShowAi,
  onClose,
  onSuccess,
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

  return (
    <Drawer
      isOpen={isOpen}
      position="left"
      title={isEdit ? 'Edit Item' : 'Add New Item'}
      titleIcon={isEdit ? <Pencil size={18} /> : <PlusCircle size={18} />}
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
        <MiniDrawer
          items={linkableItems}
          selectedIds={linkedItemIds}
          onRemoveId={(id) => setLinkedItemIds(prev => prev.filter(lid => lid !== id))}
          onItemClick={onItemTaggedClick}
          isActive={isLinkingModeActive}
          position="left"
          label="Linked"
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
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        onLinkingAudienceChange={handleLinkingAudienceChange}
        onPriorityChange={loadData}
        isOpen={isOpen}
        onSuccess={onSuccess}
        listShares={listShares}
        onLoadingChange={onFormLoadingChange}
        onDirtyChange={onFormDirtyChange}
        canShowAi={canShowAi}
        listAiEnabled={listAiEnabled}
      />
    </Drawer>
  );
};
