import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { itemsApi, FieldDefinition } from '../../api/items.api';
import { Item } from '../../interfaces/item.interface';
import { AddItemFormProps } from '../../interfaces/add-item-form-props.interface';
import { AddItemFormTemplate } from './add-item-form.html';
import { useAuth } from 'app/providers/auth-context';
import { getFriendlyCategoryLabel } from '../../utils/category-label.util';
import { STANDARD_CATEGORIES } from '../../constants/standard-categories';
import { getItemFavoriteFlag, parseItemDescription } from 'shared/utils/parse-item-description.util';
import {
  buildSummarizeCustomFields,
  getMetadataText,
  normalizeItemDescriptionMetadata,
} from 'shared/utils/item-custom-fields.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { getSiteName } from 'shared/utils/get-site-name.util';
import { syncBidirectionalItemLinks, resolveEditorLinkedItemIds } from '../../utils/item-links-sync.util';
import {
  syncBidirectionalItemRelated,
  resolveEditorRelatedItemIds,
} from '../../utils/item-related-sync.util';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
} from '../../constants/linked-items-messages.constant';
import {
  itemSupportsLinkedItems,
  linkGroupSupportsLinkedItems,
} from '../../utils/item-supports-linked-items.util';
import {
  buildLinkingAudienceContext,
  buildDraftSharedWithUsers,
  canLinkItemsByAudience,
  getItemAudienceMode,
  LINK_AUDIENCE_MISMATCH_MESSAGE,
  resolveItemSharedWithUserIds,
  sanitizeRestrictedUserIds,
} from '../../utils/item-audience.util';
import {
  createCustomFieldRow,
  definitionFieldKeysFromDefinitions,
  partitionExtractedCustomFields,
  rowsFromExtractedMetadata,
  rowsFromItemMetadata,
  rowsFromItemMetadataAi,
  splitCustomFieldRowsForSave,
  type CustomFieldRow,
} from '../../utils/add-item-custom-fields.util';
import { jobsApi, waitForJob } from 'features/jobs';
import { toExtractMetadataResult, toSummarizedDescription } from '../../utils/ai-job-result.util';
import { formatAiHelperFailure } from '../../utils/format-ai-helper-failure.util';
import {
  ENRICH_FAILURE_FALLBACK,
  SUMMARIZE_FAILURE_FALLBACK,
} from '../../constants/ai-helper-failure.constants';
import { abandonPendingManualJob } from '../../utils/abandon-pending-manual-job.util';
import type { PendingManualJob } from '../../interfaces/pending-manual-job.interface';
import type { ExtractMetadataResult } from '../../interfaces/extract-metadata-result.interface';
import type { ItemPhotoGalleryEntry } from '../photo-gallery/interfaces/item-photo-gallery-props.interface';

type ExtractedMetadataResponse = ExtractMetadataResult;

export const AddItemForm: React.FC<AddItemFormProps> = ({
  listId,
  isOwner,
  onSuccess,
  existingCategories = [],
  item,
  onItemEnriched,
  onAutoEnrichStarted,
  onDraftChange,
  wishlistItems = [],
  linkedItemIds,
  setLinkedItemIds,
  resolvedLinkedCount,
  relatedItemIds,
  resolvedRelatedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  isRelatingModeActive,
  setIsRelatingModeActive,
  onLinkingAudienceChange,
  onPriorityChange,
  isOpen,
  listShares = [],
  onLoadingChange,
  onDirtyChange,
  canShowAi = false,
  listAiEnabled = false,
  listManualJobBackground = true,
  canUseWebSearchOnList = false,
  readOnly = false,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityWeight, setPriorityWeight] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(!isOwner);
  const [otherUsersCanSee, setOtherUsersCanSee] = useState(true);
  const [sharedWithUserIds, setSharedWithUserIds] = useState<string[]>([]);
  const [visibilityMode, setVisibilityMode] = useState<'everyone' | 'restricted' | 'private'>('everyone');
  const [claimOnCreate, setClaimOnCreate] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');
  const [websiteName, setWebsiteName] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [price, setPrice] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAutopopulating, setIsAutopopulating] = useState(false);
  const [hasScraped, setHasScraped] = useState(false);

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomInput, setNewCustomInput] = useState('');
  const [sessionCustomCategories, setSessionCustomCategories] = useState<string[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<string[]>([]);
  const [aiCategoryPrimary, setAiCategoryPrimary] = useState<string | null>(null);
  const [aiCategoryAlternatives, setAiCategoryAlternatives] = useState<string[]>([]);

  // Advanced fields (multi-count and linked items)
  const [desiredQuantity, setDesiredQuantityState] = useState<number | ''>(1);
  const isUnlimitedQuantity = desiredQuantity === 0;
  const isMultiCount =
    typeof desiredQuantity === 'number' &&
    (isUnlimitedQuantity || desiredQuantity > 1);
  const isSuggestion = item?.IsSuggestion ?? !isOwner;
  const [variations, setVariations] = useState<{ name: string; quantity: number }[]>([]);

  const setDesiredQuantity = useCallback(
    (val: number | '') => {
      const nextBlocksLinks = typeof val === 'number' && (val === 0 || val > 1);
      if (nextBlocksLinks && linkedItemIds.length > 0) {
        setLinkedItemIds([]);
        setIsLinkingModeActive(false);
        setErrorMsg(LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE);
      }
      setDesiredQuantityState(val);
    },
    [linkedItemIds.length, setLinkedItemIds, setIsLinkingModeActive]
  );

  const handleSetIsLinkingModeActive = useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === 'function' ? value(isLinkingModeActive) : value;
      if (next && isSuggestion) {
        setErrorMsg(LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE);
        return;
      }
      if (next && isMultiCount) {
        setErrorMsg(LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE);
        return;
      }
      setIsLinkingModeActive(value);
    },
    [isLinkingModeActive, isMultiCount, isSuggestion, setIsLinkingModeActive]
  );

  const [customFields, setCustomFields] = useState<CustomFieldRow[]>([]);
  const [editingCustomFieldNameId, setEditingCustomFieldNameId] = useState<string | null>(null);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [photoEntries, setPhotoEntries] = useState<ItemPhotoGalleryEntry[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const initialPhotosSnapshotRef = useRef<string>('[]');
  const loadedMetadataRef = useRef<{
    predefined: Record<string, string | null | undefined>;
    userDefined: Record<string, string>;
  } | null>(null);
  const pendingExtractedRef = useRef<ExtractedMetadataResponse | null>(null);
  const lastPartitionDefKeysRef = useRef<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [isSummarizingNotes, setIsSummarizingNotes] = useState(false);
  const [undoDescription, setUndoDescription] = useState<string | null>(null);
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);
  const initialEditSnapshotRef = useRef<string | null>(null);

  // AI helpers run as background jobs; each run gets a token so a newer run (or
  // an unmount/close) stops the previous poll from writing into the form.
  const pendingJobRef = useRef<PendingManualJob | null>(null);
  const jobRunRef = useRef(0);
  const isUnmountedRef = useRef(false);
  const abandonContextRef = useRef({
    listId,
    background: listManualJobBackground !== false,
    onAutoEnrichStarted,
  });
  abandonContextRef.current = {
    listId,
    background: listManualJobBackground !== false,
    onAutoEnrichStarted,
  };

  const runAbandonPendingJob = useCallback(async () => {
    const pending = pendingJobRef.current;
    pendingJobRef.current = null;
    if (!pending) return;

    const { listId: abandonListId, background, onAutoEnrichStarted: onStarted } =
      abandonContextRef.current;
    try {
      const { outcome, result } = await abandonPendingManualJob({
        pending,
        listId: abandonListId,
        background,
      });
      if (outcome === 'promoted' && result) {
        onStarted?.(result);
      }
    } catch {
      // Best-effort; form is already closing.
    }
  }, []);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
      void runAbandonPendingJob();
    };
  }, [runAbandonPendingJob]);

  const startJobRun = useCallback(() => {
    const runId = jobRunRef.current + 1;
    jobRunRef.current = runId;
    return () => isUnmountedRef.current || jobRunRef.current !== runId;
  }, []);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Dynamic fields
  const [definitions, setDefinitions] = useState<FieldDefinition[]>([]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});

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
        ownerUserId: user?.Id,
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
    isHiddenIdea,
    linkedItemIds,
    relatedItemIds,
    photoEntries,
    user?.Id,
    listShares,
  ]);

  const isEditDirty = useMemo(() => {
    if (!item || loadedItemId !== item.Id || !initialEditSnapshotRef.current) {
      return false;
    }
    return buildEditSnapshot() !== initialEditSnapshotRef.current;
  }, [item, loadedItemId, buildEditSnapshot]);

  useEffect(() => {
    if (!onLinkingAudienceChange) return;
    if (item && loadedItemId !== item.Id) return;
    const audienceSharedWith = resolveItemSharedWithUserIds(
      visibilityMode,
      sharedWithUserIds,
      {
        ownerUserId: user?.Id,
        listShareUserIds: listShares.map((share) => share.UserId),
      }
    );
    onLinkingAudienceChange?.(
      buildLinkingAudienceContext(visibilityMode, audienceSharedWith, user?.Id)
    );
  }, [visibilityMode, sharedWithUserIds, user?.Id, onLinkingAudienceChange, item, loadedItemId, listShares]);

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
    onDirtyChange?.(!item || isEditDirty);
  }, [item, isEditDirty, onDirtyChange, readOnly]);

  const mapCategoryForDefinitions = (cat: string): string => {
    const c = cat.toLowerCase();
    if (c === 'apparel_accessories' || c === 'clothing') return 'clothing';
    if (c === 'digital_tech' || c === 'tech') return 'tech';
    return c;
  };

  useEffect(() => {
    if (canShowAi) {
      setDefinitions([]);
      return;
    }

    const fetchDefinitions = async () => {
      const mappedCat = mapCategoryForDefinitions(category);
      try {
        const res = await itemsApi.getFieldDefinitions(mappedCat);
        setDefinitions(res || []);
      } catch (err) {
        setDefinitions([]);
      }
    };
    if (category) {
      fetchDefinitions();
    } else {
      setDefinitions([]);
    }
  }, [category, canShowAi]);

  useEffect(() => {
    if (canShowAi || !loadedMetadataRef.current || !item || loadedItemId !== item.Id) return;
    if (definitions.length === 0) return;

    const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
    const mapped = rowsFromItemMetadata(
      loadedMetadataRef.current.predefined,
      loadedMetadataRef.current.userDefined,
      fieldKeys,
      labels
    );
    setDynamicValues(mapped.dynamicValues);
    setCustomFields(mapped.customFieldRows);
  }, [definitions, canShowAi, item, loadedItemId]);

  const applyExtractedCustomFields = useCallback(
    (data: ExtractedMetadataResponse) => {
      if (canShowAi) {
        const rows = rowsFromExtractedMetadata(data);
        if (rows.length > 0) {
          setCustomFields(rows);
        }
        return;
      }

      const { fieldKeys, labels } = definitionFieldKeysFromDefinitions(definitions);
      const { dynamicValues: scrapedDynamic, customFieldRows } = partitionExtractedCustomFields(
        data,
        fieldKeys,
        labels
      );
      setDynamicValues((prev) => ({ ...prev, ...scrapedDynamic }));
      setCustomFields(customFieldRows);
      lastPartitionDefKeysRef.current = fieldKeys.slice().sort().join('|');
    },
    [canShowAi, definitions]
  );

  useEffect(() => {
    if (canShowAi || !pendingExtractedRef.current) return;

    const { fieldKeys } = definitionFieldKeysFromDefinitions(definitions);
    const defSig = fieldKeys.slice().sort().join('|');
    if (!defSig || defSig === lastPartitionDefKeysRef.current) return;

    applyExtractedCustomFields(pendingExtractedRef.current);
  }, [definitions, canShowAi, applyExtractedCustomFields]);

  const isFieldVisible = React.useCallback((def: FieldDefinition) => {
    if (!def.Dependencies || def.Dependencies.length === 0) {
      return true;
    }
    return def.Dependencies.every(dep => {
      const triggerVal = dynamicValues[dep.TriggerFieldKey] || '';
      if (dep.TriggerValue === 'any') {
        return triggerVal.trim().length > 0;
      }
      return triggerVal.toLowerCase() === dep.TriggerValue.toLowerCase();
    });
  }, [dynamicValues]);

  const handleUpdateDynamicValue = (key: string, val: string) => {
    setDynamicValues(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const resetOptionalFields = () => {
    setCustomFields([]);
    setEditingCustomFieldNameId(null);
    setDynamicValues({});
    setShowExtraFields(false);
    setDesiredQuantityState(1);
    setVariations([]);
    loadedMetadataRef.current = null;
    pendingExtractedRef.current = null;
    lastPartitionDefKeysRef.current = '';
    setAiCategoryPrimary(null);
    setAiCategoryAlternatives([]);
  };

  const hasOptionalMetadata = (meta: ItemDescriptionMetadata) => {
    const normalized = normalizeItemDescriptionMetadata(meta);
    const predefined = normalized.CustomFields?.Predefined ?? {};
    const userDefined = normalized.CustomFields?.UserDefined ?? {};
    const hasPredefined = Object.values(predefined).some(
      (value) => typeof value === 'string' && value.trim()
    );
    const hasUserDefined = Object.keys(userDefined).some((key) => userDefined[key]?.trim());
    return hasPredefined || hasUserDefined;
  };

  const buildDescriptionPayload = useCallback(
    (options: { isOwner: boolean; isFavorite: boolean }): ItemDescriptionMetadata | null => {
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

      const shouldSerialize = !!(
        hasVisibleDynamic ||
        hasExtraFields ||
        description.trim() ||
        !options.isOwner ||
        options.isFavorite ||
        includePhotos
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
          typeof desiredQuantity === 'number' && desiredQuantity > 1
            ? variations.map((v) => ({ Name: v.name, Quantity: v.quantity }))
            : undefined,
        LinkedItemIds: linkedItemIds.length > 0 ? linkedItemIds : undefined,
        RelatedItemIds: relatedItemIds.length > 0 ? relatedItemIds : undefined,
        OtherUsersCanSee: options.isOwner ? true : otherUsersCanSee,
        IsFavorite: options.isOwner ? options.isFavorite || undefined : undefined,
        IsPinned: !options.isOwner ? options.isFavorite || undefined : undefined,
      });

      // Always send Photos when gallery is available and there are photos,
      // or when photos were cleared after having some (empty array on edit).
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
      photoEntries,
    ]
  );

  useEffect(() => {
    if (item) {
      resetOptionalFields();
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

        setDesiredQuantityState(
          meta.DesiredQuantity != null ? meta.DesiredQuantity : 1
        );
        setVariations(
          (meta.Variations ?? []).map((variation) => ({
            name: variation.Name,
            quantity: variation.Quantity,
          }))
        );
        setOtherUsersCanSee(meta.OtherUsersCanSee !== undefined ? meta.OtherUsersCanSee : true);
        setShowExtraFields(hasOptionalMetadata(meta));
      } else {
        setDescription(parsed.text || item.Description || '');
        setOtherUsersCanSee(true);
        setDesiredQuantityState(1);
        setVariations([]);
      }

      setIsFavorite(getItemFavoriteFlag(item.Description, item.Metadata));
      setPriorityWeight(item.Priority !== undefined && item.Priority !== null ? item.Priority.toString() : '');
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
        setPrice(item.Links[0].ExtractedPrice !== null ? item.Links[0].ExtractedPrice.toString() : '');
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
      setIsHiddenIdea(!isOwner);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      resetOptionalFields();
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
      setIsHiddenIdea(!isOwner);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      resetOptionalFields();
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

  useEffect(() => {
    return () => {
      onDraftChange?.(null);
    };
  }, [onDraftChange]);

  // Trigger draft change callback for live item preview + linking qty gates
  useEffect(() => {
    if (!onDraftChange) {
      return;
    }

    if (item && loadedItemId !== item.Id) {
      return;
    }

    const metaPayload = buildDescriptionPayload({ isOwner, isFavorite });
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
      Priority: priorityWeight ? parseInt(priorityWeight, 10) : null,
      SharedWith: buildDraftSharedWithUsers(
        visibilityMode,
        sharedWithUserIds,
        listShares,
        user?.Id
      ),
      Links: linkUrl.trim()
        ? [
          {
            Id: item.Links?.[0]?.Id || 'temp-link-id',
            ItemId: item.Id,
            Url: linkUrl.trim(),
            RetailerName: websiteName.trim() || null,
            ExtractedPrice: price.trim() ? parseFloat(price) : null,
            ExtractedImageUrl: item.Links?.[0]?.ExtractedImageUrl || null
          }
        ]
        : []
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
    definitions,
    isOwner,
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
    user?.Id,
    photoEntries,
  ]);

  useEffect(() => {
    setHasScraped(false);
  }, [linkUrl]);

  const canSummarizeNotes = canShowAi && listAiEnabled && !!name.trim();

  const handleSummarizeNotes = async () => {
    if (!canSummarizeNotes || isSummarizingNotes || isAutopopulating) return;

    const visibleDynamicValues: Record<string, string> = {};
    definitions.forEach((def) => {
      if (isFieldVisible(def)) {
        const val = dynamicValues[def.FieldKey];
        if (val?.trim()) {
          visibleDynamicValues[def.FieldKey] = val.trim();
        }
      }
    });

    const isCancelled = startJobRun();
    setUndoDescription(description);
    setIsSummarizingNotes(true);
    setErrorMsg(null);
    setWarningMsg(null);

    try {
      const summarizeCustomFields = buildSummarizeCustomFields({
        dynamicValues: visibleDynamicValues,
        customFieldRows: customFields.filter(
          (field) => field.name.trim() && field.value.trim()
        ),
      });

      const { Job } = await jobsApi.startItemSummarize({
        listId,
        itemId: item?.Id,
        writeBack: false,
        name: name.trim(),
        text: description.trim() || undefined,
        linkUrl: linkUrl.trim() || undefined,
        websiteName: websiteName.trim() || undefined,
        price: price.trim() ? parseFloat(price) : null,
        category: category === 'uncategorized' ? undefined : category,
        priority: priorityWeight.trim() ? parseInt(priorityWeight, 10) : null,
        customFields: summarizeCustomFields,
        variations:
          typeof desiredQuantity === 'number' && desiredQuantity > 1
            ? variations.map((variation) => ({
              Name: variation.name,
              Quantity: variation.quantity,
            }))
            : undefined,
        desiredQuantity: typeof desiredQuantity === 'number' ? desiredQuantity : undefined,
      });

      if (isCancelled()) return;
      pendingJobRef.current = { jobId: Job.Id, kind: 'summarize' };

      const finished = await waitForJob(Job.Id, { isCancelled });
      if (!finished || isCancelled()) return;

      const summarized =
        finished.Status === 'completed' ? toSummarizedDescription(finished.Result) : null;
      if (!summarized) {
        throw new Error(finished.Error || finished.Message || 'Summarize job failed');
      }

      setDescription(summarized);
    } catch (err) {
      if (isCancelled()) return;
      setUndoDescription(null);
      setErrorMsg(formatAiHelperFailure(err, SUMMARIZE_FAILURE_FALLBACK));
    } finally {
      if (!isCancelled()) {
        pendingJobRef.current = null;
        setIsSummarizingNotes(false);
      }
    }
  };

  const handleUndoSummarize = () => {
    if (undoDescription === null) return;
    setDescription(undoDescription);
    setUndoDescription(null);
  };

  const runExtractMetadata = async () => {
    if (!linkUrl.trim() || isAutopopulating || isSummarizingNotes) return;

    if (!isValidUrl(linkUrl)) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    const isCancelled = startJobRun();
    setIsAutopopulating(true);
    setErrorMsg(null);
    setWarningMsg(null);
    try {
      const intent = item?.Id ? 'update-item' : 'draft-populate';
      const { Job } = await jobsApi.startItemEnrich({
        intent,
        listId,
        url: linkUrl.trim(),
        itemId: item?.Id,
        writeBack: intent === 'update-item',
      });

      if (isCancelled()) return;
      pendingJobRef.current = {
        jobId: Job.Id,
        kind: 'enrich',
        intent,
        url: linkUrl.trim(),
      };

      const finished = await waitForJob(Job.Id, { isCancelled });
      if (!finished || isCancelled()) return;

      const data = finished.Status === 'completed' ? toExtractMetadataResult(finished.Result) : null;
      if (!data) {
        throw new Error(finished.Error || finished.Message || 'Enrich job failed');
      }

      applyExtractedMetadata(data);
      if (canShowAi && data.Diagnostics?.AiPopulate === 'failed') {
        setWarningMsg('Product details were found, but AI summarization has failed.');
      }
      if (intent === 'update-item') {
        onItemEnriched?.();
      }
    } catch (err) {
      if (isCancelled()) return;
      setWarningMsg(null);
      setErrorMsg(formatAiHelperFailure(err, ENRICH_FAILURE_FALLBACK));
    } finally {
      if (!isCancelled()) {
        pendingJobRef.current = null;
        setIsAutopopulating(false);
      }
    }
  };

  const handleScrapeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await runExtractMetadata();
  };

  const applyExtractedMetadata = (data: ExtractedMetadataResponse) => {
    setHasScraped(true);
    setName(data.Title || '');
    setPrice(data.Price !== null && data.Price !== undefined ? data.Price.toString() : '');
    setDescription(data.Description || '');
    const resolvedWebsiteName =
      data.WebsiteName?.trim() || getSiteName(linkUrl.trim()) || '';
    if (resolvedWebsiteName) {
      setWebsiteName(resolvedWebsiteName);
    }

    const resolvedCategory = data.Category?.trim() || 'uncategorized';
    if (canShowAi && resolvedCategory !== 'uncategorized') {
      const isStandard = STANDARD_CATEGORIES.some((s) => s.id === resolvedCategory);
      if (!isStandard && !sessionCustomCategories.includes(resolvedCategory)) {
        setSessionCustomCategories((prev) => [...prev, resolvedCategory]);
      }
      if (deletedCategories.includes(resolvedCategory)) {
        setDeletedCategories((prev) => prev.filter((c) => c !== resolvedCategory));
      }
      setAiCategoryPrimary(resolvedCategory);
      setAiCategoryAlternatives(
        (data.CategoryAlternatives ?? []).filter(
          (alt) => alt && alt !== 'uncategorized' && alt !== resolvedCategory
        )
      );
      setCategory(resolvedCategory);
    } else {
      setAiCategoryPrimary(null);
      setAiCategoryAlternatives([]);
      setCategory(resolvedCategory);
    }

    pendingExtractedRef.current = data;
    applyExtractedCustomFields(data);
    setShowExtraFields(true);
  };

  const handleAddCustomField = () => {
    const row = createCustomFieldRow({ name: '', value: '', bucket: 'userDefined' });
    setCustomFields((prev) => [...prev, row]);
    setEditingCustomFieldNameId(row.id);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
    setEditingCustomFieldNameId((current) => (current === id ? null : current));
  };

  const handleUpdateCustomField = (id: string, key: 'name' | 'value', value: string) => {
    if (key === 'name') {
      setEditingCustomFieldNameId(id);
    }
    setCustomFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const hasIncompleteCustomFields = useMemo(
    () =>
      customFields.some((field) => !field.name.trim() || !field.value.trim()),
    [customFields]
  );

  const handleVisibilityModeChange = useCallback(
    (mode: 'everyone' | 'restricted' | 'private') => {
      setVisibilityMode(mode);
      setSharedWithUserIds((prev) => {
        if (mode === 'everyone' || mode === 'private') {
          return [];
        }
        return sanitizeRestrictedUserIds(
          prev,
          listShares.map((share) => share.UserId)
        );
      });
    },
    [listShares]
  );

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (readOnly) {
      return;
    }
    if (item && !isEditDirty) {
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Please enter an item name.');
      return;
    }

    if (desiredQuantity === '') {
      setErrorMsg('Please enter a quantity.');
      return;
    }

    const limit =
      desiredQuantity === 0
        ? Number.POSITIVE_INFINITY
        : Number(desiredQuantity) || 1;
    const varTotal = variations.reduce((sum, v) => sum + v.quantity, 0);
    if (typeof desiredQuantity === 'number' && desiredQuantity > 1 && varTotal > limit) {
      setErrorMsg('Cannot exceed the total limit.');
      return;
    }

    if (visibilityMode === 'restricted' && sharedWithUserIds.length === 0) {
      setErrorMsg('Please select at least one person to share with.');
      return;
    }

    if (hasIncompleteCustomFields) {
      setErrorMsg('Each custom field needs both a name and a value.');
      setShowExtraFields(true);
      return;
    }

    const listShareUserIds = listShares.map((share) => share.UserId);
    const finalSharedWith = resolveItemSharedWithUserIds(
      visibilityMode,
      sharedWithUserIds,
      { ownerUserId: user?.Id, listShareUserIds }
    );

    if (visibilityMode === 'restricted' && finalSharedWith.length === 0) {
      setErrorMsg('Please select at least one person to share with.');
      return;
    }

    const linkingContext = buildLinkingAudienceContext(
      visibilityMode,
      visibilityMode === 'restricted' ? finalSharedWith : [],
      user?.Id
    );
    const incompatibleLink = linkedItemIds.find((linkedId) => {
      const linked = wishlistItems.find((i) => i.Id === linkedId);
      return !linked || !canLinkItemsByAudience(linkingContext, linked);
    });
    if (incompatibleLink) {
      setErrorMsg(LINK_AUDIENCE_MISMATCH_MESSAGE);
      return;
    }

    const incompatibleRelated = relatedItemIds.find((relatedId) => {
      const related = wishlistItems.find((i) => i.Id === relatedId);
      return !related || !canLinkItemsByAudience(linkingContext, related);
    });
    if (incompatibleRelated) {
      setErrorMsg(LINK_AUDIENCE_MISMATCH_MESSAGE);
      return;
    }

    if (linkedItemIds.length > 0) {
      const draftSource: Item = {
        ...(item ?? {
          Id: 'draft',
          ListId: listId,
          PriorityId: null,
          SuggestedByUserId: user?.Id ?? null,
          Name: name.trim() || 'Draft',
          Description: null,
          IsHiddenIdea: false,
          Category: category,
          Links: [],
          Claims: [],
          IsClaimed: false,
        }),
        DesiredQuantity: typeof desiredQuantity === 'number' ? desiredQuantity : 1,
        IsMultiCount: isMultiCount,
        IsSuggestion: item?.IsSuggestion ?? !isOwner,
      };
      const linkedPeers = linkedItemIds
        .map((id) => wishlistItems.find((i) => i.Id === id))
        .filter((peer): peer is Item => !!peer);
      if (
        !itemSupportsLinkedItems(draftSource) ||
        !linkGroupSupportsLinkedItems(draftSource, linkedPeers)
      ) {
        const isSuggestionBlock =
          draftSource.IsSuggestion === true ||
          linkedPeers.some((peer) => peer.IsSuggestion === true);
        setErrorMsg(
          isSuggestionBlock
            ? LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE
            : LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE
        );
        return;
      }
    }

    setIsLoading(true);
    setErrorMsg(null);
    setWarningMsg(null);

    try {
      const metadataPayload = buildDescriptionPayload({ isOwner, isFavorite });

      const priorityVal = priorityWeight.trim() ? parseInt(priorityWeight, 10) : null;

      let savedItemId: string;
      let createdItem: Item | null = null;
      const previousLinkedIds = item
        ? resolveEditorLinkedItemIds(item.Id, wishlistItems)
        : [];
      const previousRelatedIds = item
        ? resolveEditorRelatedItemIds(item.Id, wishlistItems)
        : [];

      if (item) {
        await itemsApi.updateItem(
          item.Id,
          name.trim(),
          null,
          null,
          category === 'uncategorized' ? null : category,
          priorityVal,
          finalSharedWith,
          linkUrl.trim() || null,
          price.trim() ? parseFloat(price) : null,
          websiteName.trim() || null,
          metadataPayload,
          isOwner ? false : isHiddenIdea
        );
        savedItemId = item.Id;
      } else {
        createdItem = await itemsApi.addItem(
          listId,
          name.trim(),
          null,
          null,
          isOwner ? false : isHiddenIdea,
          linkUrl.trim() || null,
          price.trim() ? parseFloat(price) : null,
          websiteName.trim() || null,
          category === 'uncategorized' ? null : category,
          priorityVal,
          finalSharedWith,
          metadataPayload
        );
        savedItemId = createdItem.Id;

        if (!isOwner && claimOnCreate && createdItem?.Id) {
          try {
            const claimerName = user ? `${user.FirstName} ${user.LastName}`.trim() || user.Username : null;
            await itemsApi.claimItem(createdItem.Id, null, claimerName, false);
          } catch (err) {
            // Ignore claim error
          }
        }
      }

      const hadLinks = previousLinkedIds.length > 0;
      if (linkedItemIds.length > 0 || hadLinks) {
        const baseItems = createdItem
          ? [...wishlistItems, createdItem]
          : wishlistItems;
        const itemsForSync = baseItems.map((wishlistItem) =>
          wishlistItem.Id === savedItemId
            ? {
                ...wishlistItem,
                Metadata: metadataPayload,
              }
            : wishlistItem
        );
        await syncBidirectionalItemLinks(
          savedItemId,
          linkedItemIds,
          itemsForSync,
          previousLinkedIds
        );
      }

      const hadRelated = previousRelatedIds.length > 0;
      if (relatedItemIds.length > 0 || hadRelated) {
        await syncBidirectionalItemRelated(savedItemId, relatedItemIds);
      }

      // Reset all states
      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(!isOwner);
      setSharedWithUserIds([]);
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setAiCategoryPrimary(null);
      setAiCategoryAlternatives([]);
      setPrice('');
      setIsFavorite(false);
      setCustomFields([]);
      setEditingCustomFieldNameId(null);
      setShowExtraFields(false);
      setPhotoEntries([]);
      initialPhotosSnapshotRef.current = '[]';
      setPhotoError(null);
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add item.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compile list of categories
  const listCategorySet = useMemo(
    () =>
      new Set(
        (existingCategories ?? []).filter(
          (cat): cat is string => !!cat && cat !== 'uncategorized'
        )
      ),
    [existingCategories]
  );

  const renderedCategories = useMemo(() => {
    const categories: { id: string; label: string; isCustom?: boolean; isFromList?: boolean }[] = [];

    STANDARD_CATEGORIES.forEach((c) => {
      categories.push({
        ...c,
        isCustom: false,
        isFromList: listCategorySet.has(c.id),
      });
    });

    listCategorySet.forEach((cat) => {
      if (
        !STANDARD_CATEGORIES.some((s) => s.id === cat) &&
        !categories.some((r) => r.id === cat) &&
        !deletedCategories.includes(cat)
      ) {
        categories.push({
          id: cat,
          label: getFriendlyCategoryLabel(cat),
          isCustom: true,
          isFromList: true,
        });
      }
    });

    sessionCustomCategories.forEach((cat) => {
      if (cat && !categories.some((r) => r.id === cat) && !deletedCategories.includes(cat)) {
        categories.push({
          id: cat,
          label: getFriendlyCategoryLabel(cat),
          isCustom: true,
          isFromList: listCategorySet.has(cat),
        });
      }
    });

    if (
      category &&
      category !== 'uncategorized' &&
      !categories.some((r) => r.id === category) &&
      !deletedCategories.includes(category)
    ) {
      categories.push({
        id: category,
        label: getFriendlyCategoryLabel(category),
        isCustom: true,
        isFromList: listCategorySet.has(category),
      });
    }

    return categories;
  }, [listCategorySet, sessionCustomCategories, deletedCategories, category]);

  const aiCategoryIds = useMemo(() => {
    const ids = new Set<string>();
    if (aiCategoryPrimary && aiCategoryPrimary !== 'uncategorized') {
      ids.add(aiCategoryPrimary);
    }
    aiCategoryAlternatives.forEach((alt) => {
      if (alt && alt !== 'uncategorized') ids.add(alt);
    });
    return ids;
  }, [aiCategoryPrimary, aiCategoryAlternatives]);

  const aiCategoryChips = useMemo(() => {
    if (!canShowAi || aiCategoryIds.size === 0) return [];

    const chips: Array<{ id: string; label: string; variant: 'primary' | 'suggestion' }> = [];

    if (aiCategoryPrimary && aiCategoryPrimary !== 'uncategorized') {
      chips.push({
        id: aiCategoryPrimary,
        label: getFriendlyCategoryLabel(aiCategoryPrimary),
        variant: 'primary',
      });
    }

    aiCategoryAlternatives.forEach((alt) => {
      if (!alt || alt === 'uncategorized' || alt === aiCategoryPrimary) return;
      if (chips.some((chip) => chip.id === alt)) return;
      chips.push({
        id: alt,
        label: getFriendlyCategoryLabel(alt),
        variant: 'suggestion',
      });
    });

    return chips;
  }, [aiCategoryAlternatives, aiCategoryIds, aiCategoryPrimary, canShowAi]);

  const handleAddCustomCategory = () => {
    const val = newCustomInput.trim();
    if (!val) return;

    if (deletedCategories.includes(val)) {
      setDeletedCategories(prev => prev.filter(c => c !== val));
    }
    if (!sessionCustomCategories.includes(val)) {
      setSessionCustomCategories(prev => [...prev, val]);
    }
    setCategory(val);
    setIsAddingCustom(false);
    setNewCustomInput('');
  };

  const handleDeleteCustomCategory = (catId: string) => {
    setDeletedCategories(prev => [...prev, catId]);
    setSessionCustomCategories(prev => prev.filter(c => c !== catId));
    if (category === catId) {
      setCategory('uncategorized');
    }
  };

  const isScrapeButtonPulsing = isValidUrl(linkUrl) && !hasScraped && !isAutopopulating && !isSummarizingNotes;

  const [varName, setVarName] = useState('');
  const [varQty, setVarQty] = useState<number | ''>(1);
  const [varError, setVarError] = useState<string | null>(null);
  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;
  const showFieldDefinitions = showOptionalSizing && !canShowAi && definitions.length > 0;

  useEffect(() => {
    setVarError(null);
  }, [desiredQuantity, variations]);

  const handleVarQtyChange = (val: string) => {
    if (val === '') {
      setVarQty('');
    } else {
      const num = parseInt(val, 10);
      if (!isNaN(num)) {
        setVarQty(Math.max(1, num));
      }
    }
  };

  const handleAddVariation = () => {
    if (!varName.trim()) return;
    if (varQty === '') {
      setVarError('Please enter a quantity for the variation.');
      return;
    }
    const limit = Number(desiredQuantity) || 1;
    const currentVarTotal = variations.reduce((sum, v) => sum + v.quantity, 0);
    const remaining = limit - currentVarTotal;

    if (remaining <= 0) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }

    if (Number(varQty) > remaining) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }

    setVarError(null);
    setVariations((prev) => [...prev, { name: varName.trim(), quantity: Number(varQty) }]);
    setVarName('');
    setVarQty(1);
  };

  return (
    <AddItemFormTemplate
      name={name}
      setName={setName}
      description={description}
      setDescription={setDescription}
      priorityWeight={priorityWeight}
      setPriorityWeight={setPriorityWeight}
      isHiddenIdea={isHiddenIdea}
      setIsHiddenIdea={setIsHiddenIdea}
      isOwner={isOwner}
      isLoading={isLoading}
      errorMsg={errorMsg}
      warningMsg={warningMsg}
      handleSubmit={handleSubmit}
      linkUrl={linkUrl}
      setLinkUrl={setLinkUrl}
      websiteName={websiteName}
      setWebsiteName={setWebsiteName}
      category={category}
      setCategory={setCategory}
      price={price}
      setPrice={setPrice}
      isFavorite={isFavorite}
      setIsFavorite={setIsFavorite}
      isAutopopulating={isAutopopulating}
      hasScraped={hasScraped}
      handleScrapeClick={handleScrapeClick}
      canUseWebSearchOnList={canUseWebSearchOnList}
      customFields={customFields}
      handleAddCustomField={handleAddCustomField}
      handleRemoveCustomField={handleRemoveCustomField}
      handleUpdateCustomField={handleUpdateCustomField}
      editingCustomFieldNameId={editingCustomFieldNameId}
      onStartEditCustomFieldName={setEditingCustomFieldNameId}
      onFinishEditCustomFieldName={() => setEditingCustomFieldNameId(null)}
      hasIncompleteCustomFields={hasIncompleteCustomFields}
      showExtraFields={showExtraFields}
      setShowExtraFields={setShowExtraFields}
      renderedCategories={renderedCategories}
      aiCategoryChips={aiCategoryChips}
      aiCategoryIds={aiCategoryIds}
      isAddingCustom={isAddingCustom}
      setIsAddingCustom={setIsAddingCustom}
      newCustomInput={newCustomInput}
      setNewCustomInput={setNewCustomInput}
      handleDeleteCustomCategory={handleDeleteCustomCategory}
      handleAddCustomCategory={handleAddCustomCategory}
      isScrapeButtonPulsing={isScrapeButtonPulsing}
      isEdit={!!item}
      definitions={definitions}
      dynamicValues={dynamicValues}
      isFieldVisible={isFieldVisible}
      handleUpdateDynamicValue={handleUpdateDynamicValue}
      currentUserId={user?.Id}
      otherUsersCanSee={otherUsersCanSee}
      setOtherUsersCanSee={setOtherUsersCanSee}
      claimOnCreate={claimOnCreate}
      setClaimOnCreate={setClaimOnCreate}
      isMultiCount={isMultiCount}
      isSuggestion={isSuggestion}
      desiredQuantity={desiredQuantity}
      setDesiredQuantity={setDesiredQuantity}
      variations={variations}
      setVariations={setVariations}
      linkedItemIds={linkedItemIds}
      resolvedLinkedCount={resolvedLinkedCount}
      relatedItemIds={relatedItemIds}
      resolvedRelatedCount={resolvedRelatedCount}
      wishlistItems={wishlistItems}
      itemId={item?.Id}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={handleSetIsLinkingModeActive}
      isRelatingModeActive={isRelatingModeActive}
      setIsRelatingModeActive={setIsRelatingModeActive}
      getFriendlyCategoryLabel={getFriendlyCategoryLabel}
      showFieldDefinitions={showFieldDefinitions}
      varName={varName}
      setVarName={setVarName}
      varQty={varQty}
      setVarQty={setVarQty}
      varError={varError}
      handleAddVariation={handleAddVariation}
      handleVarQtyChange={handleVarQtyChange}
      listShares={listShares}
      sharedWithUserIds={sharedWithUserIds}
      setSharedWithUserIds={setSharedWithUserIds}
      visibilityMode={visibilityMode}
      onVisibilityModeChange={handleVisibilityModeChange}
      canShowAi={canShowAi}
      listAiEnabled={listAiEnabled}
      canSummarizeNotes={canSummarizeNotes}
      isSummarizingNotes={isSummarizingNotes}
      canUndoSummarize={undoDescription !== null}
      onSummarizeNotes={handleSummarizeNotes}
      onUndoSummarize={handleUndoSummarize}
      showPhotoGallery={user?.Policy?.CanUploadImages !== false}
      photoEntries={photoEntries}
      onPhotoEntriesChange={setPhotoEntries}
      photoError={photoError}
      onPhotoError={setPhotoError}
      readOnly={readOnly}
    />
  );
};
