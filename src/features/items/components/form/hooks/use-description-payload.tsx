import { useCallback } from 'react';
import type React from 'react';
import type { FieldDefinition } from '../../../api/items.api';
import type { Item } from '../../../interfaces/item.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { normalizeItemDescriptionMetadata } from 'shared/utils/item-custom-fields.util';
import { splitCustomFieldRowsForSave } from '../../../utils/add-item-custom-fields.util';
import type { UseDescriptionPayloadResult } from '../interfaces/use-description-payload-result.interface';

export function useDescriptionPayload(options: {
  definitions: FieldDefinition[];
  dynamicValues: Record<string, string>;
  isFieldVisible: (def: FieldDefinition) => boolean;
  isMultiCount: boolean;
  linkedItemIds: string[];
  relatedItemIds: string[];
  customFields: CustomFieldRow[];
  description: string;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  otherUsersCanSee: boolean;
  allowSubstitutions: boolean;
  photoEntries: ItemPhotoGalleryEntry[];
  initialPhotosSnapshotRef: React.RefObject<string>;
  item: Item | null | undefined;
  isFavorite: boolean;
}): UseDescriptionPayloadResult {
  const {
    definitions,
    dynamicValues,
    isFieldVisible,
    isMultiCount,
    linkedItemIds,
    relatedItemIds,
    customFields,
    description,
    desiredQuantity,
    variations,
    otherUsersCanSee,
    allowSubstitutions,
    photoEntries,
    initialPhotosSnapshotRef,
    item,
    isFavorite,
  } = options;

  const buildDescriptionPayload = useCallback(
    (payloadOptions: {
      canManageItems: boolean;
      isFavorite: boolean;
    }): ItemDescriptionMetadata | null => {
      const visibleDynamicValues: Record<string, string> = {};
      definitions.forEach((def) => {
        if (isFieldVisible(def)) {
          const val = dynamicValues[def.FieldKey];
          if (val?.trim()) {
            visibleDynamicValues[def.FieldKey] = val.trim();
          }
        }
      });

      const hasVisibleDynamic = Object.keys(visibleDynamicValues).length > 0;
      const { predefined: rowPredefined, userDefined: rowUserDefined } =
        splitCustomFieldRowsForSave(customFields);
      const hasExtraFields =
        hasVisibleDynamic ||
        Object.keys(rowPredefined).length > 0 ||
        Object.keys(rowUserDefined).length > 0 ||
        isMultiCount ||
        linkedItemIds.length > 0 ||
        relatedItemIds.length > 0;

      const photosChanged =
        JSON.stringify(photoEntries.map((p) => p.dataUrl)) !== initialPhotosSnapshotRef.current;
      const includePhotos = photoEntries.length > 0 || photosChanged;

      const loadedAllowSubstitutions = item?.AllowSubstitutions !== false;
      const allowSubstitutionsDirty =
        payloadOptions.canManageItems && allowSubstitutions !== loadedAllowSubstitutions;

      const shouldSerialize = !!(
        hasVisibleDynamic ||
        hasExtraFields ||
        description.trim() ||
        !payloadOptions.canManageItems ||
        payloadOptions.isFavorite ||
        includePhotos ||
        allowSubstitutionsDirty
      );

      if (!shouldSerialize) {
        return null;
      }

      const payload = normalizeItemDescriptionMetadata({
        Text: description.trim() || null,
        CustomFields: {
          Predefined: {
            ...visibleDynamicValues,
            ...rowPredefined,
          },
          UserDefined: rowUserDefined,
        },
        MultiCount: isMultiCount || undefined,
        DesiredQuantity: isMultiCount ? (desiredQuantity as number) : undefined,
        Variations:
          isMultiCount && typeof desiredQuantity === 'number'
            ? variations.map((v) => ({ Name: v.name, Quantity: v.quantity }))
            : undefined,
        LinkedItemIds: linkedItemIds.length > 0 ? linkedItemIds : undefined,
        RelatedItemIds: relatedItemIds.length > 0 ? relatedItemIds : undefined,
        OtherUsersCanSee: payloadOptions.canManageItems ? true : otherUsersCanSee,
        IsFavorite: payloadOptions.canManageItems
          ? payloadOptions.isFavorite || undefined
          : undefined,
        IsPinned: !payloadOptions.canManageItems
          ? payloadOptions.isFavorite || undefined
          : undefined,
        AllowSubstitutions: payloadOptions.canManageItems ? allowSubstitutions : undefined,
      });

      if (photosChanged || photoEntries.length > 0) {
        payload.Photos = photoEntries.map((p) => ({ DataUrl: p.dataUrl }));
      }

      return payload;
    },
    [
      definitions,
      dynamicValues,
      isFieldVisible,
      isMultiCount,
      linkedItemIds,
      relatedItemIds,
      customFields,
      description,
      desiredQuantity,
      variations,
      otherUsersCanSee,
      allowSubstitutions,
      photoEntries,
      item?.AllowSubstitutions,
      initialPhotosSnapshotRef,
    ]
  );

  const buildSubstitutionMetadata = useCallback((): ItemDescriptionMetadata => {
    const visibleDynamicValues: Record<string, string> = {};
    definitions.forEach((def) => {
      if (isFieldVisible(def)) {
        const val = dynamicValues[def.FieldKey];
        if (val?.trim()) {
          visibleDynamicValues[def.FieldKey] = val.trim();
        }
      }
    });
    const { predefined: rowPredefined, userDefined: rowUserDefined } =
      splitCustomFieldRowsForSave(customFields);

    const payload = normalizeItemDescriptionMetadata({
      Text: description.trim() || null,
      CustomFields: {
        Predefined: {
          ...visibleDynamicValues,
          ...rowPredefined,
        },
        UserDefined: rowUserDefined,
      },
      MultiCount: isMultiCount || undefined,
      DesiredQuantity: isMultiCount ? (desiredQuantity as number) : undefined,
      Variations:
        isMultiCount && typeof desiredQuantity === 'number'
          ? variations.map((v) => ({ Name: v.name, Quantity: v.quantity }))
          : undefined,
      IsFavorite: isFavorite || undefined,
    });

    payload.Photos = photoEntries.map((p) => ({ DataUrl: p.dataUrl }));
    return payload;
  }, [
    definitions,
    isFieldVisible,
    dynamicValues,
    customFields,
    description,
    isMultiCount,
    desiredQuantity,
    variations,
    isFavorite,
    photoEntries,
  ]);

  return {
    buildDescriptionPayload,
    buildSubstitutionMetadata,
  };
}
