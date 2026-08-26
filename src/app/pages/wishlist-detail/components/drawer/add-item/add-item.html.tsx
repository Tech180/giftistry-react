import React, { useState } from 'react';
import { PlusCircle, Pencil, Eye, ArrowLeft, Copy } from 'lucide-react';
import { Drawer, MiniDrawer, Button, AiStatusBadge } from 'shared/ui';
import { AddItemForm, ADD_ITEM_FORM_ID, SUBSTITUTION_FORM_ID } from 'features/items';
import { formatItemAsGiftistryMarkdown } from 'features/items/utils/format-item-as-giftistry-markdown.util';
import type { SubstitutionDrawerChrome } from 'features/items/interfaces/substitution-drawer-chrome.interface';
import {
  VIEW_MODE_BANNER_DESCRIPTION,
} from 'features/items/constants/view-mode-banner.constant';
import { useToast } from 'app/providers/toast-context';
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
  autoOpenClaimerSubstitutionNonce = 0,
  autoOpenClaimerSubstitutionEditNonce = 0,
  autoOpenClaimerSubstitutionEditId = null,
}) => {
  const { showToast } = useToast();
  const [substitutionChrome, setSubstitutionChrome] = useState<SubstitutionDrawerChrome | null>(
    null
  );
  const [substitutionExitNonce, setSubstitutionExitNonce] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      // Avoid a stale exit bump from the previous close immediately undoing auto-open.
      setSubstitutionExitNonce(0);
      return;
    }
    setSubstitutionChrome(null);
    setSubstitutionExitNonce((n) => n + 1);
  }, [isOpen]);

  const isView = !!viewingItem;
  const isEdit = !!editingItem && !isView;
  const formItem = viewingItem ?? editingItem;
  const isDrawerOpen = isOpen && !collapseDrawerWhileLinking;
  const isSubstitutionMode = !!substitutionChrome;

  const handleCopyMarkdown = async () => {
    if (!formItem) return;
    try {
      await navigator.clipboard.writeText(formatItemAsGiftistryMarkdown(formItem));
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const title = isSubstitutionMode
    ? substitutionChrome.mode === 'edit'
      ? 'Edit Substitution Item'
      : 'Add Substitution Item'
    : isView
      ? 'View Item'
      : isEdit
        ? 'Edit Item'
        : 'Add New Item';
  const titleIcon = isSubstitutionMode ? (
    substitutionChrome.mode === 'edit' ? (
      <Pencil size={18} />
    ) : (
      <PlusCircle size={18} />
    )
  ) : isView ? (
    <Eye size={18} />
  ) : isEdit ? (
    <Pencil size={18} />
  ) : (
    <PlusCircle size={18} />
  );

  const backFromSubstitution = () => {
    setSubstitutionExitNonce((n) => n + 1);
  };

  const substitutionUsesBack = isSubstitutionMode && substitutionChrome.nestedBack;

  const dismissSubstitution = () => {
    if (substitutionUsesBack) {
      backFromSubstitution();
      return;
    }
    onClose();
  };

  const handleDrawerClose = () => {
    if (isSubstitutionMode) {
      dismissSubstitution();
      return;
    }
    onClose();
  };

  return (
    <Drawer
      isOpen={isDrawerOpen}
      position="left"
      title={title}
      titleIcon={titleIcon}
      mobilePresentation="sheet"
      closeIcon={substitutionUsesBack ? <ArrowLeft size={20} /> : undefined}
      closeAriaLabel={substitutionUsesBack ? 'Back' : undefined}
      headerExtra={
        <>
          {canShowAi && !isSubstitutionMode ? (
            <AiStatusBadge
              size="compact"
              enabled={listAiEnabled}
              ariaLabelEnabled="AI reviews enabled for this list"
              ariaLabelDisabled="AI reviews disabled for this list"
            />
          ) : null}
          {formItem && !isSubstitutionMode ? (
            <button
              type="button"
              className={styles['copy-markdown-btn']}
              onClick={() => {
                void handleCopyMarkdown();
              }}
              title="Copy item as Markdown"
              aria-label="Copy item as Markdown"
            >
              <Copy size={16} />
            </button>
          ) : null}
        </>
      }
      onClose={handleDrawerClose}
      overflowVisible={true}
      miniDrawer={
        isSubstitutionMode ? undefined : (
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
        )
      }
      footer={
        isView && !isSubstitutionMode ? (
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        ) : isSubstitutionMode ? (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={dismissSubstitution}
              disabled={substitutionChrome.isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={SUBSTITUTION_FORM_ID}
              variant="primary"
              isLoading={substitutionChrome.isSaving}
              disabled={!substitutionChrome.canSubmit}
            >
              Save
            </Button>
          </>
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
      {isSubstitutionMode && (
        <p className={styles.substitutionBanner} role="status">
          Substitution item
        </p>
      )}
      {(formItem?.IsSuggestion || (!isView && !isOwner)) && !isSubstitutionMode && (
        <p className={styles.suggestionBanner} role="status">
          Suggestion
        </p>
      )}
      {isView && !isSubstitutionMode ? (
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
        onSubstitutionChromeChange={setSubstitutionChrome}
        substitutionExitNonce={substitutionExitNonce}
        autoOpenClaimerSubstitutionNonce={autoOpenClaimerSubstitutionNonce}
        autoOpenClaimerSubstitutionEditNonce={autoOpenClaimerSubstitutionEditNonce}
        autoOpenClaimerSubstitutionEditId={autoOpenClaimerSubstitutionEditId}
      />
    </Drawer>
  );
};
