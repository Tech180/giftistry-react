import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { itemsApi, FieldDefinition } from '../../api/items.api';
import { Item } from '../../interfaces/item.interface';
import type {
  CreateSubstitutionPayload,
  ItemSubstitutionOption,
} from '../../interfaces/item-substitution.interface';
import { AddItemFormProps } from '../../interfaces/add-item-form-props.interface';
import { AddItemFormTemplate, ADD_ITEM_FORM_ID } from './add-item-form.html';
import { useAuth } from 'app/providers/auth-context';
import { getFriendlyCategoryLabel } from '../../utils/category-label.util';
import { STANDARD_CATEGORIES } from '../../constants/standard-categories';
import { getItemFavoriteFlag, parseItemDescription } from 'shared/utils/parse-item-description.util';
import {
  buildSummarizeCustomFields,
  getMetadataText,
  METADATA_BADGE_EMOJI,
  normalizeItemDescriptionMetadata,
} from 'shared/utils/item-custom-fields.util';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { getSiteName } from 'shared/utils/get-site-name.util';
import {
  hasItemMetadataDisplay,
  resolveItemMetadataDisplay,
} from '../../utils/resolve-item-metadata-display.util';
import { syncBidirectionalItemLinks, resolveEditorLinkedItemIds } from '../../utils/item-links-sync.util';
import {
  syncBidirectionalItemRelated,
  resolveEditorRelatedItemIds,
} from '../../utils/item-related-sync.util';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
} from '../../constants/linked-items-messages.constant';
import { parsePriorityWeight } from '../../utils/parse-priority-weight.util';
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
import type { SubstitutionDrawerChrome } from '../../interfaces/substitution-drawer-chrome.interface';
import { SUBSTITUTION_FORM_ID } from '../../constants/substitution-form.constant';
import type { ItemSubstitutionSummary } from '../../interfaces/item-substitution.interface';

type ExtractedMetadataResponse = ExtractMetadataResult;

type SubstitutionEditorState =
  | { mode: 'create'; kind: 'claimer_custom' | 'owner_approved' }
  | { mode: 'edit'; option: ItemSubstitutionOption };

type ParentFormSnapshot = {
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
  initialPhotosSnapshot: string;
  photoError: string | null;
  otherUsersCanSee: boolean;
  isHiddenIdea: boolean;
  claimOnCreate: boolean;
  allowSubstitutions: boolean;
  substitutionOptions: ItemSubstitutionOption[];
  errorMsg: string | null;
  hasScraped: boolean;
  loadedMetadata: {
    predefined: Record<string, string | null>;
    userDefined: Record<string, string>;
  } | null;
};

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
  onSubstitutionChromeChange,
  substitutionExitNonce = 0,
  autoOpenClaimerSubstitutionNonce = 0,
  autoOpenClaimerSubstitutionEditNonce = 0,
  autoOpenClaimerSubstitutionEditId = null,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityWeight, setPriorityWeight] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(!isOwner);
  const [otherUsersCanSee, setOtherUsersCanSee] = useState(true);
  const [allowSubstitutions, setAllowSubstitutions] = useState(true);
  const [substitutionOptions, setSubstitutionOptions] = useState<ItemSubstitutionOption[]>([]);
  const [substitutionEditor, setSubstitutionEditor] = useState<SubstitutionEditorState | null>(
    null
  );
  const [subSaving, setSubSaving] = useState(false);
  const parentFormSnapshotRef = useRef<ParentFormSnapshot | null>(null);
  const substitutionEditorRef = useRef<SubstitutionEditorState | null>(null);
  substitutionEditorRef.current = substitutionEditor;
  const substitutionEntryNestedRef = useRef(true);
  const lastSubstitutionExitNonceRef = useRef(substitutionExitNonce);
  const lastAutoOpenClaimerNonceRef = useRef(0);
  const lastAutoOpenClaimerEditNonceRef = useRef(0);
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
    allowSubstitutions,
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
    if (substitutionEditor) {
      onDirtyChange?.(true);
      return;
    }
    onDirtyChange?.(!item || isEditDirty);
  }, [item, isEditDirty, onDirtyChange, readOnly, substitutionEditor]);

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

    if (readOnly && !substitutionEditor) {
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
  }, [category, canShowAi, readOnly, substitutionEditor]);

  useEffect(() => {
    // Substitution create/edit owns its own field state — do not re-apply parent metadata.
    if (substitutionEditorRef.current) return;
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

      const loadedAllowSubstitutions = item?.AllowSubstitutions !== false;
      const allowSubstitutionsDirty =
        options.isOwner && allowSubstitutions !== loadedAllowSubstitutions;

      const shouldSerialize = !!(
        hasVisibleDynamic ||
        hasExtraFields ||
        description.trim() ||
        !options.isOwner ||
        options.isFavorite ||
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
        OtherUsersCanSee: options.isOwner ? true : otherUsersCanSee,
        IsFavorite: options.isOwner ? options.isFavorite || undefined : undefined,
        IsPinned: !options.isOwner ? options.isFavorite || undefined : undefined,
        AllowSubstitutions: options.isOwner ? allowSubstitutions : undefined,
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
      allowSubstitutions,
      photoEntries,
      item?.AllowSubstitutions,
    ]
  );

  useEffect(() => {
    if (substitutionEditorRef.current) return;
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
      setAllowSubstitutions(true);
      setSubstitutionOptions([]);
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
      setAllowSubstitutions(true);
      setSubstitutionOptions([]);
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

    if (substitutionEditor) {
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
      Priority: parsePriorityWeight(priorityWeight),
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
    substitutionEditor,
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
        priority: parsePriorityWeight(priorityWeight),
        customFields: summarizeCustomFields,
        variations:
          isMultiCount && typeof desiredQuantity === 'number'
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
    const resolvedLink = data.ResolvedUrl?.trim();
    if (resolvedLink) {
      setLinkUrl(resolvedLink);
    }
    const resolvedWebsiteName =
      data.WebsiteName?.trim() || getSiteName((resolvedLink || linkUrl).trim()) || '';
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
    const varTotal = variations.reduce(
      (sum, variation) => sum + (variation.quantity > 0 ? variation.quantity : 0),
      0
    );
    if (isMultiCount && varTotal > limit) {
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

      const priorityVal = parsePriorityWeight(priorityWeight);

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
  const [varQty, setVarQty] = useState(1);
  const [varError, setVarError] = useState<string | null>(null);
  const variationFiniteTotal = variations.reduce(
    (sum, variation) => sum + (variation.quantity > 0 ? variation.quantity : 0),
    0
  );
  const variationQtyRemaining =
    typeof desiredQuantity === 'number' && desiredQuantity === 0
      ? null
      : typeof desiredQuantity === 'number'
        ? Math.max(0, desiredQuantity - variationFiniteTotal)
        : 0;
  const variationQtyMax = variationQtyRemaining === null ? undefined : variationQtyRemaining;
  const variationQtyDisabled = variationQtyRemaining !== null && variationQtyRemaining <= 0;
  const variationQtyAllowInfinity = typeof desiredQuantity === 'number' && desiredQuantity === 0;
  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;
  const showFieldDefinitions =
    showOptionalSizing && !canShowAi && definitions.length > 0 && !(readOnly && !substitutionEditor);

  const readOnlyMetadataDisplay = useMemo(() => {
    if (!readOnly || substitutionEditor || !item) {
      return { predefinedDisplayEntries: [], userDefinedEntries: [] };
    }
    const parsed = parseItemDescription(item.Description, item.Metadata);
    const meta =
      parsed.isJson && parsed.metadata
        ? normalizeItemDescriptionMetadata(parsed.metadata)
        : null;
    return resolveItemMetadataDisplay(meta);
  }, [readOnly, substitutionEditor, item]);

  const hasReadOnlyMetadata = hasItemMetadataDisplay(readOnlyMetadataDisplay);

  useEffect(() => {
    setVarError(null);
  }, [desiredQuantity, variations]);

  useEffect(() => {
    if (variationQtyAllowInfinity) {
      return;
    }
    if (varQty === 0) {
      setVarQty(1);
    }
    if (variations.some((variation) => variation.quantity === 0)) {
      setVariations((prev) =>
        prev.map((variation) =>
          variation.quantity === 0 ? { ...variation, quantity: 1 } : variation
        )
      );
    }
  }, [variationQtyAllowInfinity, varQty, variations]);

  useEffect(() => {
    if (variationQtyRemaining === null) {
      return;
    }
    if (variationQtyRemaining <= 0) {
      if (varQty !== 1) {
        setVarQty(1);
      }
      return;
    }
    if (varQty > variationQtyRemaining) {
      setVarQty(variationQtyRemaining);
    }
  }, [variationQtyRemaining, varQty]);

  const handleAddVariation = () => {
    if (!varName.trim()) return;
    if (variationQtyDisabled) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }
    if (varQty === 0 && !variationQtyAllowInfinity) {
      setVarError('Unlimited variation quantity requires unlimited item quantity.');
      return;
    }
    const remaining = variationQtyRemaining ?? Number.POSITIVE_INFINITY;

    // Infinity (0) is allowed only when item qty is unlimited; finite qty must fit remaining.
    if (varQty > 0 && varQty > remaining) {
      setVarError('Cannot exceed the total quantity limit.');
      return;
    }

    setVarError(null);
    setVariations((prev) => [...prev, { name: varName.trim(), quantity: varQty }]);
    setVarName('');
    setVarQty(1);
  };

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
    setPhotoEntries([]);
    initialPhotosSnapshotRef.current = '[]';
    setPhotoError(null);
    setHasScraped(false);
    setErrorMsg(null);
    setUndoDescription(null);
  }, []);

  const hydrateFromSubstitutionSummary = useCallback(
    (summary: ItemSubstitutionSummary) => {
      resetOptionalFields();
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
    [canShowAi, definitions]
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
      if (!item?.Id || isOwner) return;
      substitutionEntryNestedRef.current = nested;
      parentFormSnapshotRef.current = captureParentFormSnapshot();
      const next: SubstitutionEditorState = { mode: 'create', kind: 'claimer_custom' };
      substitutionEditorRef.current = next;
      resetProductFieldsForSubstitution();
      setSubstitutionEditor(next);
    },
    [item, isOwner, captureParentFormSnapshot, resetProductFieldsForSubstitution]
  );

  useEffect(() => {
    if (autoOpenClaimerSubstitutionNonce === 0) return;
    if (autoOpenClaimerSubstitutionNonce === lastAutoOpenClaimerNonceRef.current) return;
    if (!item?.Id || isOwner) return;
    const timerId = window.setTimeout(() => {
      lastAutoOpenClaimerNonceRef.current = autoOpenClaimerSubstitutionNonce;
      openCreateClaimerSubstitution(false);
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [autoOpenClaimerSubstitutionNonce, item?.Id, isOwner, openCreateClaimerSubstitution]);

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
      !isOwner &&
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
    isOwner,
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
      isLoading={isLoading || subSaving}
      errorMsg={errorMsg}
      warningMsg={warningMsg}
      handleSubmit={substitutionEditor ? handleSubstitutionSubmit : handleSubmit}
      formId={substitutionEditor ? SUBSTITUTION_FORM_ID : ADD_ITEM_FORM_ID}
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
      variationQtyMax={variationQtyMax && variationQtyMax > 0 ? variationQtyMax : undefined}
      variationQtyDisabled={variationQtyDisabled}
      variationQtyAllowInfinity={variationQtyAllowInfinity}
      varError={varError}
      handleAddVariation={handleAddVariation}
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
      showPhotoGallery={
        user?.Policy?.CanUploadImages !== false || photoEntries.length > 0
      }
      photoEntries={photoEntries}
      onPhotoEntriesChange={setPhotoEntries}
      photoError={photoError}
      onPhotoError={setPhotoError}
      readOnly={readOnly && !substitutionEditor}
      readOnlyMetadataPredefined={readOnlyMetadataDisplay.predefinedDisplayEntries}
      readOnlyMetadataUserDefined={readOnlyMetadataDisplay.userDefinedEntries}
      hasReadOnlyMetadata={hasReadOnlyMetadata}
      metadataBadgeEmoji={METADATA_BADGE_EMOJI}
      allowSubstitutions={allowSubstitutions}
      setAllowSubstitutions={setAllowSubstitutions}
      substitutionOptions={substitutionOptions}
      onOpenCreateSubstitution={openCreateSubstitution}
      onOpenEditSubstitution={openEditSubstitution}
      onDeleteOwnerSubstitution={handleDeleteOwnerSubstitution}
      onReorderOwnerSubstitutions={handleReorderOwnerSubstitutions}
      substitutionEditor={substitutionEditor}
    />
  );
};

