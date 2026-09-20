import { useCallback, useEffect, useRef, useState } from 'react';
import type { Item } from 'features/items';
import { itemsApi } from 'features/items/api/items.api';
import type { ImportStripHandle } from 'features/items';
import type { ItemEnrichJobResult } from 'features/jobs';
import { useAuth } from 'features/auth';
import { useToast } from 'shared/providers/toast';
import type { UseItemSessionOptions } from '../interfaces/use-item-session-options.interface';
import type { UseItemSessionResult } from '../interfaces/use-item-session-result.interface';

export function useItemSession({
  items,
  wishlist,
  canCollaborate,
  canSuggest,
  canShowAi,
  loadData,
  softReloadItems,
  refreshJob,
  associationsRef,
}: UseItemSessionOptions): UseItemSessionResult {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAutoAddOpen, setIsAutoAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const importStripRef = useRef<ImportStripHandle>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewingItem, setViewingItem] = useState<Item | null>(null);
  const [editingItemDraft, setEditingItemDraft] = useState<Partial<Item> | null>(null);
  const [claimerSubstitutionCreateNonce, setClaimerSubstitutionCreateNonce] = useState(0);
  const [claimerSubstitutionEditNonce, setClaimerSubstitutionEditNonce] = useState(0);
  const [claimerSubstitutionEditId, setClaimerSubstitutionEditId] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem && !items.some((item) => item.Id === editingItem.Id)) {
      setEditingItem(null);
      setEditingItemDraft(null);
    }
  }, [items, editingItem]);

  useEffect(() => {
    if (viewingItem && !items.some((item) => item.Id === viewingItem.Id)) {
      setViewingItem(null);
    }
  }, [items, viewingItem]);

  const clearSubstitutionAutoOpen = useCallback(() => {
    setClaimerSubstitutionEditId(null);
    setClaimerSubstitutionEditNonce(0);
    setClaimerSubstitutionCreateNonce(0);
  }, []);

  const openItemEditor = useCallback(
    (item: Item) => {
      clearSubstitutionAutoOpen();
      const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
      setIsAddOpen(false);
      setViewingItem(null);
      setEditingItemDraft(null);
      associationsRef.current?.primeForItem(sourceItem);
      setEditingItem(sourceItem);
    },
    [items, clearSubstitutionAutoOpen, associationsRef]
  );

  const openItemViewer = useCallback(
    (item: Item) => {
      clearSubstitutionAutoOpen();
      const sourceItem = items.find((i) => i.Id === item.Id) ?? item;
      setIsAddOpen(false);
      setEditingItem(null);
      setEditingItemDraft(null);
      associationsRef.current?.primeForItem(sourceItem);
      setViewingItem(sourceItem);
    },
    [items, clearSubstitutionAutoOpen, associationsRef]
  );

  const openClaimerSubstitutionCreate = useCallback(
    (item: Item) => {
      openItemViewer(item);
      setClaimerSubstitutionCreateNonce((n) => n + 1);
    },
    [openItemViewer]
  );

  const openSubstitutionEdit = useCallback(
    (item: Item, substitutionId: string) => {
      const option = (item.SubstitutionOptions ?? []).find((entry) => entry.Id === substitutionId);
      if (!option) {
        return;
      }

      if (canCollaborate) {
        openItemEditor(item);
      } else {
        openItemViewer(item);
      }
      setClaimerSubstitutionEditId(option.Id);
      setClaimerSubstitutionEditNonce((n) => n + 1);
    },
    [canCollaborate, openItemEditor, openItemViewer]
  );

  const openClaimerSubstitutionEdit = useCallback(
    (item: Item) => {
      const option = (item.SubstitutionOptions ?? []).find(
        (entry) => entry.Kind === 'claimer_custom' && entry.CreatedByUserId === user?.Id
      );
      if (!option) {
        return;
      }

      openSubstitutionEdit(item, option.Id);
    },
    [user?.Id, openSubstitutionEdit]
  );

  const deleteSubstitutionOption = useCallback(
    async (substitutionId: string) => {
      await itemsApi.deleteSubstitution(substitutionId);
      await loadData();
    },
    [loadData]
  );

  const deleteClaimerSubstitution = useCallback(
    async (item: Item) => {
      const option = (item.SubstitutionOptions ?? []).find(
        (entry) => entry.Kind === 'claimer_custom' && entry.CreatedByUserId === user?.Id
      );
      if (!option) {
        return;
      }

      await deleteSubstitutionOption(option.Id);
    },
    [user?.Id, deleteSubstitutionOption]
  );

  const canAutoAdd = Boolean(canSuggest && canShowAi && wishlist?.AiEnabled);

  useEffect(() => {
    if (!canAutoAdd) {
      setIsAutoAddOpen(false);
    }
  }, [canAutoAdd]);

  const openAddDrawer = useCallback(() => {
    clearSubstitutionAutoOpen();
    setEditingItem(null);
    setViewingItem(null);
    setEditingItemDraft(null);
    associationsRef.current?.resetForAdd();
    setIsAutoAddOpen(false);
    setIsAddOpen(true);
  }, [clearSubstitutionAutoOpen, associationsRef]);

  const openAutoAdd = useCallback(() => {
    if (!canAutoAdd) {
      return;
    }

    setIsAddOpen(false);
    setEditingItem(null);
    setViewingItem(null);
    setEditingItemDraft(null);
    setIsAutoAddOpen(true);
  }, [canAutoAdd]);

  const closeAutoAdd = useCallback(() => {
    setIsAutoAddOpen(false);
  }, []);

  const handleAutoAddStarted = useCallback(
    async (result: ItemEnrichJobResult) => {
      setIsAutoAddOpen(false);
      showToast(
        result.Item?.Name
          ? `Fetching details for ${result.Item.Name}...`
          : 'Fetching product details in the background...',
        'info'
      );
      await Promise.all([softReloadItems(), refreshJob()]);
    },
    [refreshJob, showToast, softReloadItems]
  );

  return {
    isAddOpen,
    setIsAddOpen,
    openAddDrawer,
    isAutoAddOpen,
    openAutoAdd,
    closeAutoAdd,
    onAutoAddStarted: (result) => {
      void handleAutoAddStarted(result);
    },
    editingItem,
    setEditingItem,
    openItemEditor,
    viewingItem,
    setViewingItem,
    openItemViewer,
    openClaimerSubstitutionCreate,
    claimerSubstitutionCreateNonce,
    openClaimerSubstitutionEdit,
    claimerSubstitutionEditNonce,
    claimerSubstitutionEditId,
    deleteClaimerSubstitution,
    openSubstitutionEdit,
    deleteSubstitutionOption,
    clearSubstitutionAutoOpen,
    setEditingItemDraft,
    editingItemDraft,
    isImportOpen,
    setIsImportOpen,
    importStripRef,
  };
}
