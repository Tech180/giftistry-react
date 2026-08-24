import React from 'react';
import { PlusCircle, Pencil, Eye } from 'lucide-react';
import { Drawer, MiniDrawer, Button, AiStatusBadge } from 'shared/ui';
import { AddItemForm, ADD_ITEM_FORM_ID } from 'features/items';
import {
  VIEW_MODE_BANNER_DESCRIPTION,
} from 'features/items/constants/view-mode-banner.constant';
import { AddItemTemplateProps } from './interfaces/add-item-template-props.interface';
import styles from './add-item.module.css';

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
  readOnly?: boolean;
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
  readOnly = false,
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
        onRemoveId={
          readOnly
            ? undefined
            : (id) => setLinkedItemIds((prev) => prev.filter((lid) => lid !== id))
        }
        onItemClick={readOnly ? undefined : onItemTaggedClick}
        isActive={isLinkingModeActive}
        position="left"
        label="Linked"
        inlineOnMobile={inlineOnMobile}
      />
      <MiniDrawer
        items={linkableItems}
        selectedIds={relatedItemIds}
        onRemoveId={
          readOnly
            ? undefined
            : (id) => setRelatedItemIds((prev) => prev.filter((rid) => rid !== id))
        }
        onItemClick={readOnly ? undefined : onItemTaggedClick}
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
  viewingItem = null,
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
  const isView = !!viewingItem;
  const isEdit = !!editingItem && !isView;
  const formItem = viewingItem ?? editingItem;
  const isDrawerOpen = isOpen && !collapseDrawerWhileLinking;
  const title = isView ? 'View Item' : isEdit ? 'Edit Item' : 'Add New Item';
  const titleIcon = isView ? <Eye size={18} /> : isEdit ? <Pencil size={18} /> : <PlusCircle size={18} />;

  return (
    <Drawer
      isOpen={isDrawerOpen}
      position="left"
      title={title}
      titleIcon={titleIcon}
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
          readOnly={isView}
        />
      }
      footer={
        isView ? (
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        ) : (
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
        )
      }
    >
      {(formItem?.IsSuggestion || (!isView && !isOwner)) && (
        <p className={styles.suggestionBanner} role="status">
          Suggestion
        </p>
      )}
      {isView ? (
        <div className={styles['view-mode-banner']} role="status">
          <span className={styles['view-mode-banner-description']}>
            {VIEW_MODE_BANNER_DESCRIPTION}
          </span>
        </div>
      ) : null}
      <AddItemForm
        key={formItem?.Id ?? 'add'}
        listId={listId}
        isOwner={isOwner}
        item={formItem}
        readOnly={isView}
        existingCategories={Array.from(
          new Set(
            linkableItems
              .map((item) => item.Category?.trim())
              .filter((cat): cat is string => !!cat && cat !== 'uncategorized')
          )
        )}
        onDraftChange={isView ? undefined : setEditingItemDraft}
        wishlistItems={linkableItems}
        linkedItemIds={linkedItemIds}
        setLinkedItemIds={setLinkedItemIds}
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
