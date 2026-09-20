import { useCallback, useEffect, useRef } from 'react';
import type { Item } from '../../../interfaces/item.interface';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import {
  buildDraftSharedWithUsers,
  resolveItemSharedWithUserIds,
} from '../../../utils/item-audience.util';
import { parsePriorityWeight } from '../../../utils/parse-priority-weight.util';
import type { SubstitutionEditorState } from '../interfaces/substitution-editor-state.type';
import type { UseEditDirtyResult } from '../interfaces/use-edit-dirty-result.interface';

export function useEditDirty(options: {
  item: Item | null | undefined;
  loadedItemId: string | null;
  readOnly: boolean;
  substitutionEditor: SubstitutionEditorState | null;
  onDirtyChange?: (isDirty: boolean) => void;
  onDraftChange?: (draft: Partial<Item> | null) => void;
  name: string;
  description: string;
  priorityWeight: string;
  category: string;
  linkUrl: string;
  websiteName: string;
  price: string;
  isFavorite: boolean;
  customFields: CustomFieldRow[];
  dynamicValues: Record<string, string>;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  visibilityMode: 'everyone' | 'restricted' | 'private';
  sharedWithUserIds: string[];
  otherUsersCanSee: boolean;
  allowSubstitutions: boolean;
  isHiddenIdea: boolean;
  linkedItemIds: string[];
  relatedItemIds: string[];
  photoEntries: ItemPhotoGalleryEntry[];
  listShares: ListShare[];
  userId?: string;
  canManageItems: boolean;
  isMultiCount: boolean;
  buildDescriptionPayload: (opts: {
    canManageItems: boolean;
    isFavorite: boolean;
  }) => ItemDescriptionMetadata | null;
}): UseEditDirtyResult {
  const {
    item,
    loadedItemId,
    readOnly,
    substitutionEditor,
    onDirtyChange,
    onDraftChange,
    name,
    description,
    priorityWeight,
    category,
    linkUrl,
    websiteName,
    price,
    isFavorite,
    customFields,
    dynamicValues,
    desiredQuantity,
    variations,
    visibilityMode,
    sharedWithUserIds,
    otherUsersCanSee,
    allowSubstitutions,
    isHiddenIdea,
    linkedItemIds,
    relatedItemIds,
    photoEntries,
    listShares,
    userId,
    canManageItems,
    isMultiCount,
    buildDescriptionPayload,
  } = options;

  const initialEditSnapshotRef = useRef<string | null>(null);

  const buildEditSnapshot = useCallback(() => {
    const comparableCustomFields = customFields
      .filter((field) => field.name.trim() && field.value.trim())
      .map((field) => ({
        name: field.name.trim(),
        value: field.value.trim(),
        bucket: field.bucket,
        storageKey: field.storageKey,
      }))
      .sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));

    const comparableDynamicValues = Object.keys(dynamicValues)
      .filter((key) => dynamicValues[key]?.trim())
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = dynamicValues[key].trim();
        return acc;
      }, {});

    const comparableSharedWith = resolveItemSharedWithUserIds(
      visibilityMode,
      sharedWithUserIds,
      {
        ownerUserId: userId,
        listShareUserIds: listShares.map((share) => share.UserId),
      }
    ).sort();

    return JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      priorityWeight: priorityWeight.trim(),
      category,
      linkUrl: linkUrl.trim(),
      websiteName: websiteName.trim(),
      price: price.trim(),
      isFavorite,
      customFields: comparableCustomFields,
      dynamicValues: comparableDynamicValues,
      desiredQuantity,
      variations,
      visibilityMode,
      sharedWithUserIds: comparableSharedWith,
      otherUsersCanSee,
      allowSubstitutions,
      isHiddenIdea,
      linkedItemIds: [...linkedItemIds].sort(),
      relatedItemIds: [...relatedItemIds].sort(),
      photos: photoEntries.map((p) => p.dataUrl),
    });
  }, [
    name,
    description,
    priorityWeight,
    category,
    linkUrl,
    websiteName,
    price,
    isFavorite,
    customFields,
    dynamicValues,
    desiredQuantity,
    variations,
    visibilityMode,
    sharedWithUserIds,
    otherUsersCanSee,
    allowSubstitutions,
    isHiddenIdea,
    linkedItemIds,
    relatedItemIds,
    photoEntries,
    listShares,
    userId,
  ]);

  const isEditDirty =
    !!item &&
    loadedItemId === item.Id &&
    !!initialEditSnapshotRef.current &&
    buildEditSnapshot() !== initialEditSnapshotRef.current;

  useEffect(() => {
    if (!item || loadedItemId !== item.Id) {
      if (!item) {
        initialEditSnapshotRef.current = null;
      }
      return;
    }
    initialEditSnapshotRef.current = buildEditSnapshot();
    // Snapshot only when the item finishes loading, not on every field change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedItemId, item?.Id]);

  useEffect(() => {
    if (readOnly) {
      onDirtyChange?.(false);
      return;
    }
    if (substitutionEditor) {
      onDirtyChange?.(true);
      return;
    }
    onDirtyChange?.(!item || isEditDirty);
  }, [item, isEditDirty, onDirtyChange, readOnly, substitutionEditor]);

  useEffect(() => {
    return () => {
      onDraftChange?.(null);
    };
  }, [onDraftChange]);

  useEffect(() => {
    if (!onDraftChange) {
      return;
    }

    if (substitutionEditor) {
      return;
    }

    if (item && loadedItemId !== item.Id) {
      return;
    }

    const metaPayload = buildDescriptionPayload({ canManageItems, isFavorite });
    const quantityFields = {
      DesiredQuantity: typeof desiredQuantity === 'number' ? desiredQuantity : 1,
      IsMultiCount: isMultiCount,
      Metadata: metaPayload,
    };

    if (!item) {
      onDraftChange(quantityFields);
      return;
    }

    onDraftChange({
      Id: item.Id,
      Name: name.trim(),
      Description: metaPayload?.Text ?? (description.trim() || null),
      ...quantityFields,
      Photos: photoEntries.map((p, index) => ({
        Id: p.id ?? p.localId,
        Url: p.dataUrl,
        SortOrder: index,
      })),
      Category: category === 'uncategorized' ? '' : category,
      PriorityId: null,
      Priority: parsePriorityWeight(priorityWeight),
      SharedWith: buildDraftSharedWithUsers(
        visibilityMode,
        sharedWithUserIds,
        listShares,
        userId
      ),
      Links: linkUrl.trim()
        ? [
            {
              Id: item.Links?.[0]?.Id || 'temp-link-id',
              ItemId: item.Id,
              Url: linkUrl.trim(),
              RetailerName: websiteName.trim() || null,
              ExtractedPrice: price.trim() ? parseFloat(price) : null,
              ExtractedImageUrl: item.Links?.[0]?.ExtractedImageUrl || null,
            },
          ]
        : [],
    });
  }, [
    name,
    description,
    category,
    priorityWeight,
    linkUrl,
    websiteName,
    price,
    customFields,
    otherUsersCanSee,
    dynamicValues,
    canManageItems,
    item,
    onDraftChange,
    loadedItemId,
    isMultiCount,
    desiredQuantity,
    variations,
    linkedItemIds,
    relatedItemIds,
    buildDescriptionPayload,
    isFavorite,
    visibilityMode,
    sharedWithUserIds,
    listShares,
    userId,
    photoEntries,
    substitutionEditor,
  ]);

  return {
    isEditDirty,
    buildEditSnapshot,
    initialEditSnapshotRef,
  };
}
