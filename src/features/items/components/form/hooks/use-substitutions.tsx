import { useCallback, useEffect, useRef } from 'react';
import type React from 'react';
import { itemsApi, type FieldDefinition } from '../../../api/items.api';
import type { Item } from '../../../interfaces/item.interface';
import type {
  CreateSubstitutionPayload,
  ItemSubstitutionOption,
  ItemSubstitutionSummary,
} from '../../../interfaces/item-substitution.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import type { SubstitutionDrawerChrome } from '../../../interfaces/substitution-drawer-chrome.interface';
import type { ParentFormSnapshot } from '../interfaces/parent-form-snapshot.interface';
import type { SubstitutionEditorState } from '../interfaces/substitution-editor-state.type';
import {
  definitionFieldKeysFromDefinitions,
  rowsFromItemMetadata,
  rowsFromItemMetadataAi,
} from '../../../utils/add-item-custom-fields.util';
import { parsePriorityWeight } from '../../../utils/parse-priority-weight.util';
import type { UseSubstitutionsResult } from '../interfaces/use-substitutions-result.interface';

export function useSubstitutions(options: {
  item: Item | null | undefined;
  canManageItems: boolean;
  canShowAi: boolean;
  userId?: string;
  userFirstName?: string;
  userLastName?: string;
  userUsername?: string;
  substitutionExitNonce: number;
  autoOpenClaimerSubstitutionNonce: number;
  autoOpenClaimerSubstitutionEditNonce: number;
  autoOpenClaimerSubstitutionEditId?: string | null;
  onSubstitutionChromeChange?: (chrome: SubstitutionDrawerChrome | null) => void;
  onSuccess: () => void;
  onItemEnriched?: () => void;
  definitions: FieldDefinition[];
  buildSubstitutionMetadata: () => ItemDescriptionMetadata;
  name: string;
  description: string;
  priorityWeight: string;
  linkUrl: string;
  websiteName: string;
  category: string;
  price: string;
  isFavorite: boolean;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  customFields: CustomFieldRow[];
  dynamicValues: Record<string, string>;
  showExtraFields: boolean;
  photoEntries: ItemPhotoGalleryEntry[];
  photoError: string | null;
  otherUsersCanSee: boolean;
  isHiddenIdea: boolean;
  claimOnCreate: boolean;
  allowSubstitutions: boolean;
  substitutionOptions: ItemSubstitutionOption[];
  errorMsg: string | null;
  hasScraped: boolean;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setPriorityWeight: (v: string) => void;
  setLinkUrl: (v: string) => void;
  setWebsiteName: (v: string) => void;
  setCategory: (v: string) => void;
  setPrice: (v: string) => void;
  setIsFavorite: (v: boolean) => void;
  setDesiredQuantityState: (v: number | '') => void;
  setVariations: React.Dispatch<React.SetStateAction<{ name: string; quantity: number }[]>>;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFieldRow[]>>;
  setDynamicValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setShowExtraFields: (v: boolean) => void;
  setPhotoEntries: React.Dispatch<React.SetStateAction<ItemPhotoGalleryEntry[]>>;
  setPhotoError: (v: string | null) => void;
  setOtherUsersCanSee: (v: boolean) => void;
  setIsHiddenIdea: (v: boolean) => void;
  setClaimOnCreate: (v: boolean) => void;
  setAllowSubstitutions: (v: boolean) => void;
  setSubstitutionOptions: React.Dispatch<React.SetStateAction<ItemSubstitutionOption[]>>;
  setErrorMsg: (v: string | null) => void;
  setHasScraped: (v: boolean) => void;
  setUndoDescription: (v: string | null) => void;
  resetOptionalFields: () => void;
  clearAiCategories: () => void;
  initialPhotosSnapshotRef: React.RefObject<string>;
  loadedMetadataRef: React.RefObject<{
    predefined: Record<string, string | null | undefined>;
    userDefined: Record<string, string>;
  } | null>;
  substitutionEditor: SubstitutionEditorState | null;
  setSubstitutionEditor: React.Dispatch<React.SetStateAction<SubstitutionEditorState | null>>;
  substitutionEditorRef: React.RefObject<SubstitutionEditorState | null>;
  subSaving: boolean;
  setSubSaving: React.Dispatch<React.SetStateAction<boolean>>;
}): UseSubstitutionsResult {
  const {
    item, canManageItems, canShowAi, userId, userFirstName, userLastName, userUsername,
    substitutionExitNonce, autoOpenClaimerSubstitutionNonce, autoOpenClaimerSubstitutionEditNonce,
    autoOpenClaimerSubstitutionEditId = null, onSubstitutionChromeChange, onSuccess, onItemEnriched,
    definitions, buildSubstitutionMetadata, name, description, priorityWeight, linkUrl, websiteName,
    category, price, isFavorite, desiredQuantity, variations, customFields, dynamicValues,
    showExtraFields, photoEntries, photoError, otherUsersCanSee, isHiddenIdea, claimOnCreate,
    allowSubstitutions, substitutionOptions, errorMsg, hasScraped, setName, setDescription,
    setPriorityWeight, setLinkUrl, setWebsiteName, setCategory, setPrice, setIsFavorite,
    setDesiredQuantityState, setVariations, setCustomFields, setDynamicValues, setShowExtraFields,
    setPhotoEntries, setPhotoError, setOtherUsersCanSee, setIsHiddenIdea, setClaimOnCreate,
    setAllowSubstitutions, setSubstitutionOptions, setErrorMsg, setHasScraped,     setUndoDescription,
    resetOptionalFields, clearAiCategories, initialPhotosSnapshotRef, loadedMetadataRef, substitutionEditor,
    setSubstitutionEditor, substitutionEditorRef, subSaving, setSubSaving,
  } = options;

  const parentFormSnapshotRef = useRef<ParentFormSnapshot | null>(null);
  const substitutionEntryNestedRef = useRef(true);
  const lastSubstitutionExitNonceRef = useRef(substitutionExitNonce);
  const lastAutoOpenClaimerNonceRef = useRef(0);
  const lastAutoOpenClaimerEditNonceRef = useRef(0);

  const user = userId
    ? { Id: userId, FirstName: userFirstName ?? '', LastName: userLastName ?? '', Username: userUsername ?? '' }
    : null;

  const refreshLocalSubstitutions = useCallback(async (parentItemId: string) => {
    const result = await itemsApi.listSubstitutions(parentItemId);
    setSubstitutionOptions(result.Options);
    return result;
  }, []);

  const captureParentFormSnapshot = useCallback((): ParentFormSnapshot => {
    return {
      name,
      description,
      priorityWeight,
      linkUrl,
      websiteName,
      category,
      price,
      isFavorite,
      desiredQuantity,
      variations,
      customFields,
      dynamicValues,
      showExtraFields,
      photoEntries,
      initialPhotosSnapshot: initialPhotosSnapshotRef.current,
      photoError,
      otherUsersCanSee,
      isHiddenIdea,
      claimOnCreate,
      allowSubstitutions,
      substitutionOptions,
      errorMsg,
      hasScraped,
      loadedMetadata: loadedMetadataRef.current,
    };
  }, [
    name,
    description,
    priorityWeight,
    linkUrl,
    websiteName,
    category,
    price,
    isFavorite,
    desiredQuantity,
    variations,
    customFields,
    dynamicValues,
    showExtraFields,
    photoEntries,
    photoError,
    otherUsersCanSee,
    isHiddenIdea,
    claimOnCreate,
    allowSubstitutions,
    substitutionOptions,
    errorMsg,
    hasScraped,
  ]);

  const restoreParentFormSnapshot = useCallback((snap: ParentFormSnapshot) => {
    setName(snap.name);
    setDescription(snap.description);
    setPriorityWeight(snap.priorityWeight);
    setLinkUrl(snap.linkUrl);
    setWebsiteName(snap.websiteName);
    setCategory(snap.category);
    setPrice(snap.price);
    setIsFavorite(snap.isFavorite);
    setDesiredQuantityState(snap.desiredQuantity);
    setVariations(snap.variations);
    setCustomFields(snap.customFields);
    setDynamicValues(snap.dynamicValues);
    setShowExtraFields(snap.showExtraFields);
    setPhotoEntries(snap.photoEntries);
    initialPhotosSnapshotRef.current = snap.initialPhotosSnapshot;
    setPhotoError(snap.photoError);
    setOtherUsersCanSee(snap.otherUsersCanSee);
    setIsHiddenIdea(snap.isHiddenIdea);
    setClaimOnCreate(snap.claimOnCreate);
    setAllowSubstitutions(snap.allowSubstitutions);
    setSubstitutionOptions(snap.substitutionOptions);
    setErrorMsg(snap.errorMsg);
    setHasScraped(snap.hasScraped);
    loadedMetadataRef.current = snap.loadedMetadata;
  }, []);

  const resetProductFieldsForSubstitution = useCallback(() => {
    setName('');
    setDescription('');
    setPriorityWeight('');
    setLinkUrl('');
    setWebsiteName('');
    setCategory('uncategorized');
    setPrice('');
    setIsFavorite(false);
    setOtherUsersCanSee(true);
    setIsHiddenIdea(true);
    setClaimOnCreate(false);
    resetOptionalFields();
    clearAiCategories();
    setPhotoEntries([]);
    initialPhotosSnapshotRef.current = '[]';
    setPhotoError(null);
    setHasScraped(false);
    setErrorMsg(null);
    setUndoDescription(null);
  }, [resetOptionalFields, clearAiCategories]);

  const hydrateFromSubstitutionSummary = useCallback(
    (summary: ItemSubstitutionSummary) => {
      resetOptionalFields();
      clearAiCategories();
      setName(summary.Name || '');
      setDescription(summary.Description || '');
      setPriorityWeight(
        summary.Priority != null && Number.isFinite(summary.Priority)
          ? String(summary.Priority)
          : ''
      );
      setCategory(summary.Category || 'uncategorized');
      setIsFavorite(summary.IsFavorite === true);
      setIsHiddenIdea(summary.IsHiddenIdea === true);
      setClaimOnCreate(false);

      const predefined = summary.CustomFields?.Predefined ?? {};
      const userDefined = summary.CustomFields?.UserDefined ?? {};
      loadedMetadataRef.current = { predefined, userDefined };

      if (canShowAi) {
        setCustomFields(rowsFromItemMetadataAi(predefined, userDefined));
        setDynamicValues({});
      } else if (definitions.length > 0) {
        const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
        const mapped = rowsFromItemMetadata(predefined, userDefined, fieldKeys, labels);
        setDynamicValues(mapped.dynamicValues);
        setCustomFields(mapped.customFieldRows);
      } else {
        setCustomFields(rowsFromItemMetadataAi(predefined, userDefined));
        setDynamicValues({});
      }

      const qty = summary.DesiredQuantity;
      if (summary.MultiCount) {
        setDesiredQuantityState(qty != null && (qty === 0 || qty > 1) ? qty : 2);
      } else {
        setDesiredQuantityState(qty != null ? qty : 1);
      }
      setVariations(
        (summary.Variations ?? []).map((v) => ({
          name: v.Name,
          quantity: v.Quantity,
        }))
      );
      setShowExtraFields(
        Object.keys(predefined).length > 0 || Object.keys(userDefined).length > 0
      );

      const sortedPhotos = [...(summary.Photos ?? [])].sort((a, b) => a.SortOrder - b.SortOrder);
      const loadedPhotos: ItemPhotoGalleryEntry[] = sortedPhotos.map((p) => ({
        localId: p.Id,
        id: p.Id,
        dataUrl: p.Url,
      }));
      setPhotoEntries(loadedPhotos);
      initialPhotosSnapshotRef.current = JSON.stringify(loadedPhotos.map((p) => p.dataUrl));
      setPhotoError(null);

      if (summary.Links && summary.Links.length > 0) {
        setLinkUrl(summary.Links[0]!.Url || '');
        setWebsiteName(summary.Links[0]!.RetailerName || '');
        setPrice(
          summary.Links[0]!.ExtractedPrice != null
            ? String(summary.Links[0]!.ExtractedPrice)
            : ''
        );
      } else {
        setLinkUrl('');
        setWebsiteName('');
        setPrice('');
      }

      setHasScraped(false);
      setErrorMsg(null);
      setUndoDescription(null);
    },
    [canShowAi, definitions, resetOptionalFields, clearAiCategories]
  );

  const openCreateSubstitution = () => {
    if (!item?.Id) return;
    substitutionEntryNestedRef.current = true;
    parentFormSnapshotRef.current = captureParentFormSnapshot();
    const next: SubstitutionEditorState = { mode: 'create', kind: 'owner_approved' };
    substitutionEditorRef.current = next;
    resetProductFieldsForSubstitution();
    setSubstitutionEditor(next);
  };

  const openCreateClaimerSubstitution = useCallback(
    (nested = true) => {
      if (!item?.Id || canManageItems) return;
      substitutionEntryNestedRef.current = nested;
      parentFormSnapshotRef.current = captureParentFormSnapshot();
      const next: SubstitutionEditorState = { mode: 'create', kind: 'claimer_custom' };
      substitutionEditorRef.current = next;
      resetProductFieldsForSubstitution();
      setSubstitutionEditor(next);
    },
    [item, canManageItems, captureParentFormSnapshot, resetProductFieldsForSubstitution]
  );

  useEffect(() => {
    if (autoOpenClaimerSubstitutionNonce === 0) return;
    if (autoOpenClaimerSubstitutionNonce === lastAutoOpenClaimerNonceRef.current) return;
    if (!item?.Id || canManageItems) return;
    const timerId = window.setTimeout(() => {
      lastAutoOpenClaimerNonceRef.current = autoOpenClaimerSubstitutionNonce;
      openCreateClaimerSubstitution(false);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [autoOpenClaimerSubstitutionNonce, item?.Id, canManageItems, openCreateClaimerSubstitution]);

  const openEditSubstitution = useCallback(
    (option: ItemSubstitutionOption, nested = true) => {
      substitutionEntryNestedRef.current = nested;
      parentFormSnapshotRef.current = captureParentFormSnapshot();
      const next: SubstitutionEditorState = { mode: 'edit', option };
      substitutionEditorRef.current = next;
      hydrateFromSubstitutionSummary(option.Item);
      setSubstitutionEditor(next);
    },
    [captureParentFormSnapshot, hydrateFromSubstitutionSummary]
  );

  useEffect(() => {
    if (autoOpenClaimerSubstitutionEditNonce === 0) return;
    if (autoOpenClaimerSubstitutionEditNonce === lastAutoOpenClaimerEditNonceRef.current) return;
    if (!item?.Id || !autoOpenClaimerSubstitutionEditId) return;

    const option = (item.SubstitutionOptions ?? []).find(
      (entry) => entry.Id === autoOpenClaimerSubstitutionEditId
    );
    if (!option) return;

    if (
      !canManageItems &&
      (option.Kind !== 'claimer_custom' ||
        !user?.Id ||
        option.CreatedByUserId !== user.Id)
    ) {
      return;
    }

    const timerId = window.setTimeout(() => {
      lastAutoOpenClaimerEditNonceRef.current = autoOpenClaimerSubstitutionEditNonce;
      openEditSubstitution(option, false);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [
    autoOpenClaimerSubstitutionEditNonce,
    autoOpenClaimerSubstitutionEditId,
    item?.Id,
    item?.SubstitutionOptions,
    canManageItems,
    user?.Id,
    openEditSubstitution,
  ]);

  const closeSubstitutionEditor = useCallback(() => {
    const snap = parentFormSnapshotRef.current;
    parentFormSnapshotRef.current = null;
    substitutionEditorRef.current = null;
    setSubstitutionEditor(null);
    setSubSaving(false);
    if (snap) {
      restoreParentFormSnapshot(snap);
    }
  }, [restoreParentFormSnapshot]);

  useEffect(() => {
    if (substitutionExitNonce === lastSubstitutionExitNonceRef.current) return;
    lastSubstitutionExitNonceRef.current = substitutionExitNonce;
    if (substitutionExitNonce === 0) return;
    closeSubstitutionEditor();
  }, [substitutionExitNonce, closeSubstitutionEditor]);

  useEffect(() => {
    if (!onSubstitutionChromeChange) return;
    if (!substitutionEditor) {
      onSubstitutionChromeChange(null);
      return;
    }
    const chrome: SubstitutionDrawerChrome = {
      mode: substitutionEditor.mode,
      isSaving: subSaving,
      canSubmit: !!name.trim() && !subSaving,
      nestedBack: substitutionEntryNestedRef.current,
    };
    onSubstitutionChromeChange(chrome);
  }, [substitutionEditor, subSaving, name, onSubstitutionChromeChange]);

  const handleCreateClaimerSubstitution = async (payload: CreateSubstitutionPayload) => {
    if (!item?.Id) {
      throw new Error('Item is required before adding a substitution.');
    }
    const option = await itemsApi.createClaimerSubstitution(item.Id, payload);
    if (claimOnCreate && option.Item?.Id) {
      try {
        const claimerName = user
          ? `${user.FirstName} ${user.LastName}`.trim() || user.Username
          : null;
        await itemsApi.claimItem(option.Item.Id, null, claimerName, false);
      } catch {
        // Ignore claim error; substitution was created.
      }
    }
    return refreshLocalSubstitutions(item.Id);
  };

  const handleCreateOwnerSubstitution = async (payload: CreateSubstitutionPayload) => {
    if (!item?.Id) {
      throw new Error('Save the item before adding substitutions.');
    }
    await itemsApi.createOwnerSubstitution(item.Id, payload);
    return refreshLocalSubstitutions(item.Id);
  };

  const handleUpdateOwnerSubstitution = async (
    substitutionId: string,
    payload: CreateSubstitutionPayload
  ) => {
    if (!item?.Id) {
      throw new Error('Save the item before editing substitutions.');
    }
    await itemsApi.updateSubstitution(substitutionId, payload);
    return refreshLocalSubstitutions(item.Id);
  };

  const handleDeleteOwnerSubstitution = async (substitutionId: string) => {
    if (!item?.Id) {
      throw new Error('Save the item before deleting substitutions.');
    }
    await itemsApi.deleteSubstitution(substitutionId);
    await refreshLocalSubstitutions(item.Id);
  };

  const handleReorderOwnerSubstitutions = async (orderedIds: string[]) => {
    if (!item?.Id) {
      throw new Error('Save the item before reordering substitutions.');
    }
    await itemsApi.reorderOwnerSubstitutions(item.Id, orderedIds);
    await refreshLocalSubstitutions(item.Id);
  };

  const handleSubstitutionSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!substitutionEditor) return;
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg('Name is required.');
      return;
    }
    const payload: CreateSubstitutionPayload = {
      Name: trimmed,
      Description: description.trim() || null,
      LinkUrl: linkUrl.trim() || null,
      WebsiteName: websiteName.trim() || null,
      Price: price.trim() ? Number(price) : null,
      Category: category || 'uncategorized',
      PriorityId: null,
      Priority: parsePriorityWeight(priorityWeight),
      Metadata: buildSubstitutionMetadata(),
    };
    const isClaimerCustomSurface =
      substitutionEditor.mode === 'create'
        ? substitutionEditor.kind === 'claimer_custom'
        : substitutionEditor.option.Kind === 'claimer_custom';
    if (isClaimerCustomSurface) {
      payload.IsHiddenIdea = isHiddenIdea;
    }
    setSubSaving(true);
    setErrorMsg(null);
    try {
      let refreshed: Awaited<ReturnType<typeof refreshLocalSubstitutions>> | undefined;
      if (substitutionEditor.mode === 'create') {
        if (substitutionEditor.kind === 'claimer_custom') {
          refreshed = await handleCreateClaimerSubstitution(payload);
        } else {
          refreshed = await handleCreateOwnerSubstitution(payload);
        }
      } else {
        refreshed = await handleUpdateOwnerSubstitution(substitutionEditor.option.Id, payload);
      }
      if (refreshed && parentFormSnapshotRef.current) {
        parentFormSnapshotRef.current = {
          ...parentFormSnapshotRef.current,
          substitutionOptions: refreshed.Options,
        };
      }
      if (!substitutionEntryNestedRef.current) {
        onSuccess();
        return;
      }
      closeSubstitutionEditor();
      if (
        substitutionEditor.mode === 'create' &&
        substitutionEditor.kind === 'claimer_custom'
      ) {
        onItemEnriched?.();
      }
      if (
        substitutionEditor.mode === 'edit' &&
        substitutionEditor.option.Kind === 'claimer_custom'
      ) {
        onItemEnriched?.();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save substitution.');
    } finally {
      setSubSaving(false);
    }
  };

  return {
    substitutionEditor,
    substitutionEditorRef,
    subSaving,
    openCreateSubstitution,
    openEditSubstitution: (option: ItemSubstitutionOption) => openEditSubstitution(option),
    handleDeleteOwnerSubstitution,
    handleReorderOwnerSubstitutions,
    handleSubstitutionSubmit,
  };
}
