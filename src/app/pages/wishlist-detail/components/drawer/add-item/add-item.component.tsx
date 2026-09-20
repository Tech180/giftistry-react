import React, { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Eye, ArrowLeft } from 'lucide-react';
import { formatItemAsGiftistryMarkdown } from 'features/items/utils/format-item-as-giftistry-markdown.util';
import type { SubstitutionDrawerChrome } from 'features/items/interfaces/substitution-drawer-chrome.interface';
import { useAuth } from 'features/auth';
import { useToast } from 'shared/providers/toast';
import type { Props } from './interfaces/props.interface';
import { getDrawerTitle } from './utils/get-drawer-title.util';
import { getExistingCategories } from './utils/get-existing-categories.util';
import { AddItemTemplate } from './add-item.html';

export const AddItem: React.FC<Props> = ({
  isOpen,
  editingItem,
  viewingItem = null,
  items: _items,
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
  canCollaborate = isOwner,
  listId,
  listAiEnabled,
  listManualJobBackground = true,
  canUseWebSearchOnList = false,
  listShares,
  onClose,
  onSuccess,
  onAutoEnrichStarted,
  setEditingItemDraft,
  loadData,
  onItemTaggedClick,
  autoOpenClaimerSubstitutionNonce = 0,
  autoOpenClaimerSubstitutionEditNonce = 0,
  autoOpenClaimerSubstitutionEditId = null,
}) => {
  const { canShowAi } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(true);
  const [substitutionChrome, setSubstitutionChrome] = useState<SubstitutionDrawerChrome | null>(
    null
  );
  const [substitutionExitNonce, setSubstitutionExitNonce] = useState(0);

  useEffect(() => {
    setIsFormDirty(!editingItem && !viewingItem);
  }, [editingItem, viewingItem]);

  useEffect(() => {
    if (isOpen) {
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
  const substitutionUsesBack = isSubstitutionMode && substitutionChrome.nestedBack;

  const title = getDrawerTitle({
    isSubstitutionMode,
    substitutionMode: substitutionChrome?.mode,
    isView,
    isEdit,
  });

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

  const closeIcon = substitutionUsesBack ? <ArrowLeft size={20} /> : undefined;

  const backFromSubstitution = () => {
    setSubstitutionExitNonce((n) => n + 1);
  };

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

  const handleCopyMarkdown = async () => {
    if (!formItem) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formatItemAsGiftistryMarkdown(formItem));
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  return (
    <AddItemTemplate
      isOpen = {
        isOpen
      }
      isDrawerOpen = {
        isDrawerOpen
      }
      isView = {
        isView
      }
      isEdit = {
        isEdit
      }
      isSubstitutionMode = {
        isSubstitutionMode
      }
      title = {
        title
      }
      titleIcon = {
        titleIcon
      }
      closeIcon = {
        closeIcon
      }
      closeAriaLabel = {
        substitutionUsesBack ? 'Back' : undefined
      }
      formItem = {
        formItem
      }
      existingCategories = {
        getExistingCategories(linkableItems)
      }
      linkableItems = {
        linkableItems
      }
      resolvedLinkedItems = {
        resolvedLinkedItems
      }
      resolvedRelatedItems = {
        resolvedRelatedItems
      }
      linkedItemIds = {
        linkedItemIds
      }
      setLinkedItemIds = {
        setLinkedItemIds
      }
      relatedItemIds = {
        relatedItemIds
      }
      setRelatedItemIds = {
        setRelatedItemIds
      }
      isLinkingModeActive = {
        isLinkingModeActive
      }
      setIsLinkingModeActive = {
        setIsLinkingModeActive
      }
      isRelatingModeActive = {
        isRelatingModeActive
      }
      setIsRelatingModeActive = {
        setIsRelatingModeActive
      }
      handleLinkingAudienceChange = {
        handleLinkingAudienceChange
      }
      isOwner = {
        isOwner
      }
      canCollaborate = {
        canCollaborate
      }
      listId = {
        listId
      }
      listAiEnabled = {
        listAiEnabled
      }
      listManualJobBackground = {
        listManualJobBackground
      }
      canUseWebSearchOnList = {
        canUseWebSearchOnList
      }
      canShowAi = {
        canShowAi
      }
      listShares = {
        listShares
      }
      onClose = {
        onClose
      }
      onSuccess = {
        onSuccess
      }
      onAutoEnrichStarted = {
        onAutoEnrichStarted
      }
      setEditingItemDraft = {
        setEditingItemDraft
      }
      loadData = {
        loadData
      }
      isLoading = {
        isLoading
      }
      isFormDirty = {
        isFormDirty
      }
      onFormLoadingChange = {
        setIsLoading
      }
      onFormDirtyChange = {
        setIsFormDirty
      }
      onItemTaggedClick = {
        onItemTaggedClick
      }
      autoOpenClaimerSubstitutionNonce = {
        autoOpenClaimerSubstitutionNonce
      }
      autoOpenClaimerSubstitutionEditNonce = {
        autoOpenClaimerSubstitutionEditNonce
      }
      autoOpenClaimerSubstitutionEditId = {
        autoOpenClaimerSubstitutionEditId
      }
      substitutionChrome = {
        substitutionChrome
      }
      substitutionExitNonce = {
        substitutionExitNonce
      }
      onSubstitutionChromeChange = {
        setSubstitutionChrome
      }
      onCopyMarkdown = {
        () => {
          void handleCopyMarkdown();
        }
      }
      onDrawerClose = {
        handleDrawerClose
      }
      onDismissSubstitution = {
        dismissSubstitution
      }
      showAiBadge = {
        canShowAi && !isSubstitutionMode
      }
      showCopyButton = {
        !!formItem && !isSubstitutionMode
      }
      showSuggestionBanner = {
        !!(formItem?.IsSuggestion || (!isView && !canCollaborate)) && !isSubstitutionMode
      }
      showViewModeBanner = {
        isView && !isSubstitutionMode
      }
      showSubstitutionBanner = {
        isSubstitutionMode
      }
    />
  );
};
