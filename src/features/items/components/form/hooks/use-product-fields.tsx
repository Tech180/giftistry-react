import { useCallback, useRef, useState } from 'react';
import type React from 'react';
import { createCustomFieldRow } from '../../../utils/add-item-custom-fields.util';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemSubstitutionOption } from '../../../interfaces/item-substitution.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { ExtractMetadataResult } from '../../../interfaces/extract-metadata-result.interface';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
} from '../../../constants/linked-items-messages.constant';
import type { UseProductFieldsResult } from '../interfaces/use-product-fields-result.interface';

export function useProductFields(options: {
  canManageItems: boolean;
  isSuggestion: boolean;
  linkedItemIds: string[];
  setLinkedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
}): UseProductFieldsResult {
  const {
    canManageItems,
    isSuggestion,
    linkedItemIds,
    setLinkedItemIds,
    isLinkingModeActive,
    setIsLinkingModeActive,
  } = options;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityWeight, setPriorityWeight] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(!canManageItems);
  const [otherUsersCanSee, setOtherUsersCanSee] = useState(true);
  const [allowSubstitutions, setAllowSubstitutions] = useState(true);
  const [substitutionOptions, setSubstitutionOptions] = useState<ItemSubstitutionOption[]>([]);
  const [claimOnCreate, setClaimOnCreate] = useState(false);

  const [linkUrl, setLinkUrl] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [websiteName, setWebsiteName] = useState('');
  const [category, setCategory] = useState('uncategorized');
  const [price, setPrice] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasScraped, setHasScraped] = useState(false);

  const [desiredQuantity, setDesiredQuantityState] = useState<number | ''>(1);
  const isUnlimitedQuantity = desiredQuantity === 0;
  const isMultiCount =
    typeof desiredQuantity === 'number' && (isUnlimitedQuantity || desiredQuantity > 1);
  const [variations, setVariations] = useState<{ name: string; quantity: number }[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [warningMsg, setWarningMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);

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
  const pendingExtractedRef = useRef<ExtractMetadataResult | null>(null);
  const lastPartitionDefKeysRef = useRef<string>('');
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});

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

  const hasIncompleteCustomFields = customFields.some(
    (field) => !field.name.trim() || !field.value.trim()
  );

  const handleUpdateDynamicValue = (key: string, val: string) => {
    setDynamicValues((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const onCopyLink = useCallback(async () => {
    if (!linkUrl.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(linkUrl.trim());
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Clipboard unavailable — no-op
    }
  }, [linkUrl]);

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
  };

  return {
    name,
    setName,
    description,
    setDescription,
    priorityWeight,
    setPriorityWeight,
    isHiddenIdea,
    setIsHiddenIdea,
    otherUsersCanSee,
    setOtherUsersCanSee,
    allowSubstitutions,
    setAllowSubstitutions,
    substitutionOptions,
    setSubstitutionOptions,
    claimOnCreate,
    setClaimOnCreate,
    linkUrl,
    setLinkUrl,
    linkCopied,
    setLinkCopied,
    websiteName,
    setWebsiteName,
    category,
    setCategory,
    price,
    setPrice,
    isFavorite,
    setIsFavorite,
    hasScraped,
    setHasScraped,
    desiredQuantity,
    setDesiredQuantityState,
    setDesiredQuantity,
    isUnlimitedQuantity,
    isMultiCount,
    variations,
    setVariations,
    customFields,
    setCustomFields,
    editingCustomFieldNameId,
    setEditingCustomFieldNameId,
    showExtraFields,
    setShowExtraFields,
    photoEntries,
    setPhotoEntries,
    photoError,
    setPhotoError,
    initialPhotosSnapshotRef,
    loadedMetadataRef,
    pendingExtractedRef,
    lastPartitionDefKeysRef,
    dynamicValues,
    setDynamicValues,
    isLoading,
    setIsLoading,
    errorMsg,
    setErrorMsg,
    warningMsg,
    setWarningMsg,
    loadedItemId,
    setLoadedItemId,
    handleSetIsLinkingModeActive,
    handleAddCustomField,
    handleRemoveCustomField,
    handleUpdateCustomField,
    hasIncompleteCustomFields,
    handleUpdateDynamicValue,
    onCopyLink,
    resetOptionalFields,
  };
}
