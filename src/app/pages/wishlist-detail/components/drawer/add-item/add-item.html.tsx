import React from 'react';
import { Drawer, MiniDrawer } from 'shared/ui';
import { AddItemForm } from 'features/items';
import { AddItemTemplateProps } from './interfaces/add-item-template-props.interface';

export const AddItemTemplate: React.FC<AddItemTemplateProps> = ({
  isOpen,
  editingItem,
  items,
  linkedItemIds,
  setLinkedItemIds,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isOwner,
  listId,
  onClose,
  onSuccess,
  setEditingItemDraft,
  loadData,
}) => {
  return (
    <Drawer
      isOpen={isOpen}
      position="left"
      title={editingItem ? 'Edit Gift Item' : 'Add Item to Wishlist'}
      onClose={onClose}
      overflowVisible={true}
      miniDrawer={
        <MiniDrawer
          items={items}
          selectedIds={linkedItemIds}
          onRemoveId={(id) => setLinkedItemIds(prev => prev.filter(lid => lid !== id))}
          isActive={isLinkingModeActive}
          position="left"
          label="Linked"
        />
      }
    >
      <AddItemForm
        listId={listId}
        isOwner={isOwner}
        item={editingItem}
        existingCategories={Array.from(new Set(items.map(item => item.Category).filter(Boolean)))}
        onDraftChange={setEditingItemDraft}
        wishlistItems={items}
        linkedItemIds={linkedItemIds}
        setLinkedItemIds={setLinkedItemIds}
        isLinkingModeActive={isLinkingModeActive}
        setIsLinkingModeActive={setIsLinkingModeActive}
        onPriorityChange={loadData}
        isOpen={isOpen}
        onSuccess={onSuccess}
      />
    </Drawer>
  );
};
