import { useEffect } from 'react';
import type React from 'react';
import type { Item } from '../../../interfaces/item.interface';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { FieldDefinition } from '../../../api/items.api';
import type { ItemSubstitutionOption } from '../../../interfaces/item-substitution.interface';
import type { SubstitutionEditorState } from '../interfaces/substitution-editor-state.type';
import type { PendingManualJob } from '../../../interfaces/pending-manual-job.interface';
import { getItemFavoriteFlag, parseItemDescription } from 'shared/utils/parse-item-description.util';
import { normalizeItemDescriptionMetadata } from 'shared/utils/item-custom-fields.util';
import {
  definitionFieldKeysFromDefinitions,
  rowsFromItemMetadata,
  rowsFromItemMetadataAi,
} from '../../../utils/add-item-custom-fields.util';
import {
  getItemAudienceMode,
  sanitizeRestrictedUserIds,
} from '../../../utils/item-audience.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';

function hasOptionalMetadata(meta: ItemDescriptionMetadata) {
  const normalized = normalizeItemDescriptionMetadata(meta);
  const predefined = normalized.CustomFields?.Predefined ?? {};
  const userDefined = normalized.CustomFields?.UserDefined ?? {};
  const hasPredefined = Object.values(predefined).some(
    (value) => typeof value === 'string' && value.trim()
  );
  const hasUserDefined = Object.keys(userDefined).some((key) => userDefined[key]?.trim());
  return hasPredefined || hasUserDefined;
}

export function useItemHydrate(options: {
  item: Item | null | undefined;
  isOpen?: boolean;
  canManageItems: boolean;
  canShowAi: boolean;
  readOnly: boolean;
  listShares: ListShare[];
  definitions: FieldDefinition[];
  substitutionEditorRef: React.RefObject<SubstitutionEditorState | null>;
  runAbandonPendingJob: () => Promise<void>;
  jobRunRef: React.RefObject<number>;
  pendingJobRef: React.RefObject<PendingManualJob | null>;
  resetOptionalFields: () => void;
  clearAiCategories: () => void;
  setName: (val: string) => void;
  setDescription: (val: string) => void;
  setPriorityWeight: (val: string) => void;
  setIsHiddenIdea: (val: boolean) => void;
  setSharedWithUserIds: (val: string[]) => void;
  setVisibilityMode: (val: 'everyone' | 'restricted' | 'private') => void;
  setLinkUrl: (val: string) => void;
  setWebsiteName: (val: string) => void;
  setCategory: (val: string) => void;
  setPrice: (val: string) => void;
  setIsFavorite: (val: boolean) => void;
  setAllowSubstitutions: (val: boolean) => void;
  setSubstitutionOptions: (val: ItemSubstitutionOption[]) => void;
  setPhotoEntries: (val: ItemPhotoGalleryEntry[]) => void;
  setPhotoError: (val: string | null) => void;
  setLoadedItemId: (val: string | null) => void;
  setHasScraped: (val: boolean) => void;
  setUndoDescription: (val: string | null) => void;
  setIsSummarizingNotes: (val: boolean) => void;
  setIsAutopopulating: (val: boolean) => void;
  setErrorMsg: (val: string | null) => void;
  setWarningMsg: (val: string | null) => void;
  setOtherUsersCanSee: (val: boolean) => void;
  setDesiredQuantityState: (val: number | '') => void;
  setVariations: (val: { name: string; quantity: number }[]) => void;
  setShowExtraFields: (val: boolean) => void;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFieldRow[]>>;
  setDynamicValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  initialPhotosSnapshotRef: React.RefObject<string>;
  loadedMetadataRef: React.RefObject<{
    predefined: Record<string, string | null | undefined>;
    userDefined: Record<string, string>;
  } | null>;
}): void {
  const {
    item,
    isOpen,
    canManageItems,
    canShowAi,
    readOnly,
    listShares,
    definitions,
    substitutionEditorRef,
    runAbandonPendingJob,
    jobRunRef,
    pendingJobRef,
    resetOptionalFields,
    clearAiCategories,
    setName,
    setDescription,
    setPriorityWeight,
    setIsHiddenIdea,
    setSharedWithUserIds,
    setVisibilityMode,
    setLinkUrl,
    setWebsiteName,
    setCategory,
    setPrice,
    setIsFavorite,
    setAllowSubstitutions,
    setSubstitutionOptions,
    setPhotoEntries,
    setPhotoError,
    setLoadedItemId,
    setHasScraped,
    setUndoDescription,
    setIsSummarizingNotes,
    setIsAutopopulating,
    setErrorMsg,
    setWarningMsg,
    setOtherUsersCanSee,
    setDesiredQuantityState,
    setVariations,
    setShowExtraFields,
    setCustomFields,
    setDynamicValues,
    initialPhotosSnapshotRef,
    loadedMetadataRef,
  } = options;

  useEffect(() => {
    if (substitutionEditorRef.current) {
      return;
    }
    if (item) {
      resetOptionalFields();
      clearAiCategories();
      setName(item.Name || '');

      const parsed = parseItemDescription(item.Description, item.Metadata);
      if (parsed.isJson && parsed.metadata) {
        const meta = normalizeItemDescriptionMetadata(parsed.metadata);
        setDescription(parsed.text || '');

        loadedMetadataRef.current = {
          predefined: meta.CustomFields?.Predefined ?? {},
          userDefined: meta.CustomFields?.UserDefined ?? {},
        };

        if (canShowAi) {
          setCustomFields(
            rowsFromItemMetadataAi(
              loadedMetadataRef.current.predefined,
              loadedMetadataRef.current.userDefined
            )
          );
          setDynamicValues({});
        } else if (definitions.length > 0) {
          const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
          const mapped = rowsFromItemMetadata(
            loadedMetadataRef.current.predefined,
            loadedMetadataRef.current.userDefined,
            fieldKeys,
            labels
          );
          setDynamicValues(mapped.dynamicValues);
          setCustomFields(mapped.customFieldRows);
        } else {
          setCustomFields(
            rowsFromItemMetadataAi(
              loadedMetadataRef.current.predefined,
              loadedMetadataRef.current.userDefined
            )
          );
          setDynamicValues({});
        }

        setDesiredQuantityState(meta.DesiredQuantity != null ? meta.DesiredQuantity : 1);
        setVariations(
          (meta.Variations ?? []).map((variation) => ({
            name: variation.Name,
            quantity: variation.Quantity,
          }))
        );
        setOtherUsersCanSee(meta.OtherUsersCanSee !== undefined ? meta.OtherUsersCanSee : true);
        setShowExtraFields(!readOnly && hasOptionalMetadata(meta));
      } else {
        setDescription(parsed.text || item.Description || '');
        setOtherUsersCanSee(true);
        setDesiredQuantityState(1);
        setVariations([]);
      }

      setAllowSubstitutions(item.AllowSubstitutions !== false);
      setSubstitutionOptions(item.SubstitutionOptions ?? []);
      setIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
      setPriorityWeight(
        item.Priority !== undefined && item.Priority !== null ? item.Priority.toString() : ''
      );
      setIsHiddenIdea(item.IsHiddenIdea || false);
      const audienceMode = getItemAudienceMode(item);
      setVisibilityMode(audienceMode);
      if (audienceMode === 'restricted') {
        setSharedWithUserIds(
          sanitizeRestrictedUserIds(
            item.SharedWith?.map((u) => u.UserId) ?? [],
            listShares.map((share) => share.UserId)
          )
        );
      } else {
        setSharedWithUserIds([]);
      }
      setCategory(item.Category || 'uncategorized');

      const sortedPhotos = [...(item.Photos ?? [])].sort((a, b) => a.SortOrder - b.SortOrder);
      const loadedPhotos: ItemPhotoGalleryEntry[] = sortedPhotos.map((p) => ({
        localId: p.Id,
        id: p.Id,
        dataUrl: p.Url,
      }));
      setPhotoEntries(loadedPhotos);
      initialPhotosSnapshotRef.current = JSON.stringify(loadedPhotos.map((p) => p.dataUrl));
      setPhotoError(null);

      if (item.Links && item.Links.length > 0) {
        setLinkUrl(item.Links[0].Url || '');
        setWebsiteName(item.Links[0].RetailerName || '');
        setPrice(
          item.Links[0].ExtractedPrice !== null ? item.Links[0].ExtractedPrice.toString() : ''
        );
      } else {
        setLinkUrl('');
        setWebsiteName('');
        setPrice('');
      }
      setLoadedItemId(item.Id);
    } else {
      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(!canManageItems);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      setAllowSubstitutions(true);
      setSubstitutionOptions([]);
      resetOptionalFields();
      clearAiCategories();
      setPhotoEntries([]);
      initialPhotosSnapshotRef.current = '[]';
      setPhotoError(null);
      setLoadedItemId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.Id]);

  useEffect(() => {
    if (isOpen === false) {
      void runAbandonPendingJob();
      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(!canManageItems);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      setAllowSubstitutions(true);
      setSubstitutionOptions([]);
      resetOptionalFields();
      clearAiCategories();
      setPhotoEntries([]);
      initialPhotosSnapshotRef.current = '[]';
      setPhotoError(null);
      setHasScraped(false);
      setLoadedItemId(null);
      setUndoDescription(null);
      jobRunRef.current += 1;
      pendingJobRef.current = null;
      setIsSummarizingNotes(false);
      setIsAutopopulating(false);
      setErrorMsg(null);
      setWarningMsg(null);
    }
  }, [isOpen, runAbandonPendingJob]);
}
