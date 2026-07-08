import React from 'react';
import { PlusCircle, Pencil } from 'lucide-react';
import { Drawer, MiniDrawer, Button } from 'shared/ui';
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
  onClose,
  onSuccess,
  setEditingItemDraft,
  loadData,
  listShares,
  isLoading = false,
  onFormLoadingChange,
  onItemTaggedClick,
}) => {
  const isEdit = !!editingItem;

  return (
    <Drawer
      isOpen={isOpen}
      position="left"
      title={isEdit ? 'Edit Item' : 'Add New Item'}
      titleIcon={isEdit ? <Pencil size={18} /> : <PlusCircle size={18} />}
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
        existingCategories={Array.from(new Set(items.map(item => item.Category).filter(Boolean)))}
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
      />
    </Drawer>
  );
};
