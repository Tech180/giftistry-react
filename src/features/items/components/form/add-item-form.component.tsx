import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { itemsApi, FieldDefinition } from '../../api/items.api';
import { Item } from '../../interfaces/item.interface';
import { AddItemFormProps } from '../../interfaces/add-item-form-props.interface';
import { AddItemFormTemplate } from './add-item-form.html';
import { useAuth } from 'app/providers/auth-context';
import { getFriendlyCategoryLabel } from '../../utils/category-label.util';
import { STANDARD_CATEGORIES } from '../../constants/standard-categories';
import { getItemFavoriteFlag, parseItemDescription } from 'shared/utils/parse-item-description.util';
import { isValidUrl } from 'shared/utils/is-valid-url.util';
import { syncBidirectionalItemLinks, resolveEditorLinkedItemIds } from '../../utils/item-links-sync.util';
import {
  buildLinkingAudienceContext,
  canLinkItemsByAudience,
  LINK_AUDIENCE_MISMATCH_MESSAGE,
} from '../../utils/item-audience.util';

const DYNAMIC_FIELD_KEYS = [
  'text', 'custom', 'multiCount', 'desiredQuantity', 'variations', 'linkedItemIds',
  'pantsSize', 'shirtSize', 'shoesSize', 'socksSize', 'color', 'otherUsersCanSee',
  'isFavorite', 'isPinned',
];

export const AddItemForm: React.FC<AddItemFormProps> = ({
  listId,
  isOwner,
  onSuccess,
  existingCategories = [],
  item,
  onDraftChange,
  wishlistItems = [],
  linkedItemIds,
  resolvedLinkedCount,
  isLinkingModeActive,
  setIsLinkingModeActive,
  onLinkingAudienceChange,
  onPriorityChange,
  isOpen,
  listShares = [],
  onLoadingChange,
  onDirtyChange,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priorityWeight, setPriorityWeight] = useState('');
  const [isHiddenIdea, setIsHiddenIdea] = useState(false);
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

  // Advanced fields (multi-count and linked items)
  const [desiredQuantity, setDesiredQuantity] = useState<number | ''>(1);
  const isMultiCount = typeof desiredQuantity === 'number' && desiredQuantity > 1;
  const [variations, setVariations] = useState<{ name: string; quantity: number }[]>([]);

  // Optional and Custom Description Fields
  const [pantsSize, setPantsSize] = useState('');
  const [shirtSize, setShirtSize] = useState('');
  const [shoesSize, setShoesSize] = useState('');
  const [socksSize, setSocksSize] = useState('');
  const [color, setColor] = useState('');
  const [customFields, setCustomFields] = useState<{ id: string; name: string; value: string }[]>([]);
  const [showExtraFields, setShowExtraFields] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadedItemId, setLoadedItemId] = useState<string | null>(null);
  const initialEditSnapshotRef = useRef<string | null>(null);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  // Dynamic fields
  const [definitions, setDefinitions] = useState<FieldDefinition[]>([]);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});

  const buildEditSnapshot = useCallback(() => {
    const comparableCustomFields = customFields
      .filter((field) => field.name.trim() && field.value.trim())
      .map((field) => ({ name: field.name.trim(), value: field.value.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));

    const comparableDynamicValues = Object.keys(dynamicValues)
      .filter((key) => dynamicValues[key]?.trim())
      .sort()
      .reduce<Record<string, string>>((acc, key) => {
        acc[key] = dynamicValues[key].trim();
        return acc;
      }, {});

    const comparableSharedWith =
      visibilityMode === 'restricted'
        ? [...sharedWithUserIds].sort()
        : visibilityMode === 'private' && user?.Id
          ? [user.Id]
          : [];

    return JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      priorityWeight: priorityWeight.trim(),
      category,
      linkUrl: linkUrl.trim(),
      websiteName: websiteName.trim(),
      price: price.trim(),
      isFavorite,
      pantsSize: pantsSize.trim(),
      shirtSize: shirtSize.trim(),
      shoesSize: shoesSize.trim(),
      socksSize: socksSize.trim(),
      color: color.trim(),
      customFields: comparableCustomFields,
      dynamicValues: comparableDynamicValues,
      desiredQuantity,
      variations,
      visibilityMode,
      sharedWithUserIds: comparableSharedWith,
      otherUsersCanSee,
      linkedItemIds: [...linkedItemIds].sort(),
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
    pantsSize,
    shirtSize,
    shoesSize,
    socksSize,
    color,
    customFields,
    dynamicValues,
    desiredQuantity,
    variations,
    visibilityMode,
    sharedWithUserIds,
    otherUsersCanSee,
    linkedItemIds,
    user?.Id,
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
    onLinkingAudienceChange?.(
      buildLinkingAudienceContext(visibilityMode, sharedWithUserIds, user?.Id)
    );
  }, [visibilityMode, sharedWithUserIds, user?.Id, onLinkingAudienceChange, item, loadedItemId]);

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
    onDirtyChange?.(!item || isEditDirty);
  }, [item, isEditDirty, onDirtyChange]);

  const mapCategoryForDefinitions = (cat: string): string => {
    const c = cat.toLowerCase();
    if (c === 'apparel_accessories' || c === 'clothing') return 'clothing';
    if (c === 'digital_tech' || c === 'tech') return 'tech';
    return c;
  };

  useEffect(() => {
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
  }, [category]);

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
    setPantsSize('');
    setShirtSize('');
    setShoesSize('');
    setSocksSize('');
    setColor('');
    setCustomFields([]);
    setDynamicValues({});
    setShowExtraFields(false);
    setDesiredQuantity(1);
    setVariations([]);
  };

  const hasOptionalMetadata = (meta: Record<string, unknown>) => {
    const hasSizing = !!(
      meta.pantsSize ||
      meta.shirtSize ||
      meta.shoesSize ||
      meta.socksSize ||
      meta.color
    );
    const hasCustom = Array.isArray(meta.custom) && meta.custom.length > 0;
    const hasDynamic = Object.keys(meta).some(
      (key) => !DYNAMIC_FIELD_KEYS.includes(key) && meta[key] != null && meta[key] !== ''
    );
    return hasSizing || hasCustom || hasDynamic;
  };

  useEffect(() => {
    if (item) {
      resetOptionalFields();
      setName(item.Name || '');

      const parsed = parseItemDescription(item.Description);
      if (parsed.isJson && parsed.metadata) {
        const meta = parsed.metadata;
        setDescription(meta.text || '');

        const dynValues: Record<string, string> = {};
        for (const key of Object.keys(meta)) {
          if (!DYNAMIC_FIELD_KEYS.includes(key)) {
            dynValues[key] = String(meta[key] || '');
          }
        }
        setDynamicValues(dynValues);

        setPantsSize(meta.pantsSize || '');
        setShirtSize(meta.shirtSize || '');
        setShoesSize(meta.shoesSize || '');
        setSocksSize(meta.socksSize || '');
        setColor(meta.color || '');
        setDesiredQuantity(meta.desiredQuantity || 1);
        setVariations(meta.variations || []);
        setCustomFields(
          meta.custom?.length
            ? meta.custom.map((f) => ({
                id: Math.random().toString(),
                name: f.name,
                value: f.value,
              }))
            : []
        );
        setOtherUsersCanSee(meta.otherUsersCanSee !== undefined ? meta.otherUsersCanSee : true);
        setShowExtraFields(hasOptionalMetadata(meta));
      } else {
        setDescription(parsed.text || item.Description || '');
        setOtherUsersCanSee(true);
        setDesiredQuantity(1);
        setVariations([]);
      }

      setIsFavorite(getItemFavoriteFlag(item.Description));
      setPriorityWeight(item.Priority !== undefined && item.Priority !== null ? item.Priority.toString() : '');
      setIsHiddenIdea(item.IsHiddenIdea || false);
      const initialShared = item.SharedWith?.map(u => u.UserId) ?? [];
      setSharedWithUserIds(initialShared);
      if (initialShared.length === 0) {
        setVisibilityMode('everyone');
      } else if (initialShared.length === 1 && user && initialShared[0] === user.Id) {
        setVisibilityMode('private');
      } else {
        setVisibilityMode('restricted');
      }
      setCategory(item.Category || 'uncategorized');

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
      setIsHiddenIdea(false);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      resetOptionalFields();
      setLoadedItemId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.Id]);

  useEffect(() => {
    if (isOpen === false) {
      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(false);
      setSharedWithUserIds([]);
      setVisibilityMode('everyone');
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      resetOptionalFields();
      setHasScraped(false);
      setLoadedItemId(null);
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      onDraftChange?.(null);
    };
  }, [onDraftChange]);

  // Trigger draft change callback for live item preview
  useEffect(() => {
    if (!item) {
      onDraftChange?.(null);
      return;
    }

    if (loadedItemId !== item.Id) {
      return;
    }

    if (onDraftChange) {
      const visibleDynamicValues: Record<string, string> = {};
      definitions.forEach(def => {
        if (isFieldVisible(def)) {
          const val = dynamicValues[def.FieldKey];
          if (val && val.trim()) {
            visibleDynamicValues[def.FieldKey] = val.trim();
          }
        }
      });

      const hasVisibleDynamic = Object.keys(visibleDynamicValues).length > 0;
      const hasExtraFields =
        pantsSize.trim() ||
        shirtSize.trim() ||
        shoesSize.trim() ||
        socksSize.trim() ||
        color.trim() ||
        isMultiCount ||
        linkedItemIds.length > 0 ||
        customFields.some(f => f.name.trim() && f.value.trim());

      let descPayload = '';
      if (hasVisibleDynamic || hasExtraFields || description.trim() || !isOwner) {
        descPayload = JSON.stringify({
          text: description.trim() || null,
          pantsSize: pantsSize.trim() || null,
          shirtSize: shirtSize.trim() || null,
          shoesSize: shoesSize.trim() || null,
          socksSize: socksSize.trim() || null,
          color: color.trim() || null,
          multiCount: isMultiCount,
          desiredQuantity,
          variations,
          linkedItemIds,
          custom: customFields
            .filter(f => f.name.trim() && f.value.trim())
            .map(f => ({ name: f.name.trim(), value: f.value.trim() })),
          otherUsersCanSee: isOwner ? true : otherUsersCanSee,
          ...visibleDynamicValues
        });
      } else {
        descPayload = description.trim();
      }

      onDraftChange({
        Id: item.Id,
        Name: name.trim(),
        Description: descPayload,
        Category: category === 'uncategorized' ? '' : category,
        PriorityId: null,
        Priority: priorityWeight ? parseInt(priorityWeight, 10) : null,
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
    }
  }, [
    name,
    description,
    category,
    priorityWeight,
    linkUrl,
    websiteName,
    price,
    pantsSize,
    shirtSize,
    shoesSize,
    socksSize,
    color,
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
    isFieldVisible
  ]);

  useEffect(() => {
    setHasScraped(false);
  }, [linkUrl]);

  const handleScrapeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;

    if (!isValidUrl(linkUrl)) {
      setErrorMsg('Please enter a valid URL.');
      return;
    }

    // Automatically pre-populate/replace the Website Name from hostname
    try {
      const urlObj = new URL(linkUrl.trim());
      const hostname = urlObj.hostname;
      const retailerNameRaw = hostname.replace('www.', '').split('.')[0] || '';
      const extractedWebName = retailerNameRaw ? retailerNameRaw.charAt(0).toUpperCase() + retailerNameRaw.slice(1) : '';
      setWebsiteName(extractedWebName || '');
    } catch (_) {
      setWebsiteName('');
    }

    setIsAutopopulating(true);
    setErrorMsg(null);
    try {
      const data = await itemsApi.extractMetadata(linkUrl.trim());
      if (data) {
        setHasScraped(true);
        setName(data.title || '');
        setPrice(data.price !== null && data.price !== undefined ? data.price.toString() : '');
        setDescription(data.description || '');
        setCategory(data.category || 'uncategorized');
        
        const colorVal = data.color || '';
        setColor(colorVal);
        handleUpdateDynamicValue('preferredColor', colorVal);
        handleUpdateDynamicValue('color', colorVal);

        // Reset size fields first so they don't overlap/accumulate
        setPantsSize('');
        setShirtSize('');
        setShoesSize('');
        setSocksSize('');

        if (data.size) {
          const sizeVal = data.size.trim();
          const urlLower = linkUrl.toLowerCase();
          const titleLower = (data.title || '').toLowerCase();

          if (urlLower.includes('shoe') || urlLower.includes('boot') || urlLower.includes('sneaker') || titleLower.includes('shoe') || titleLower.includes('sneaker')) {
            setShoesSize(sizeVal);
            handleUpdateDynamicValue('shoesSize', sizeVal);
            setShowExtraFields(true);
          } else if (urlLower.includes('pant') || urlLower.includes('jeans') || urlLower.includes('trouser') || urlLower.includes('short') || titleLower.includes('pant') || titleLower.includes('jeans') || /^\d{2}x\d{2}$/i.test(sizeVal)) {
            setPantsSize(sizeVal);
            handleUpdateDynamicValue('pantsSize', sizeVal);
            setShowExtraFields(true);
          } else if (urlLower.includes('sock') || titleLower.includes('sock')) {
            setSocksSize(sizeVal);
            handleUpdateDynamicValue('socksSize', sizeVal);
            setShowExtraFields(true);
          } else {
            setShirtSize(sizeVal);
            handleUpdateDynamicValue('shirtSize', sizeVal);
            setShowExtraFields(true);
          }
        }
      }
    } catch (err) {
      setErrorMsg('Failed to fetch product details automatically. You can still enter them manually.');
    } finally {
      setIsAutopopulating(false);
    }
  };

  const handleAddCustomField = () => {
    setCustomFields(prev => [...prev, { id: Math.random().toString(), name: '', value: '' }]);
  };

  const handleRemoveCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateCustomField = (id: string, key: 'name' | 'value', value: string) => {
    setCustomFields(prev => prev.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const hasIncompleteCustomFields = useMemo(
    () =>
      customFields.some((field) => !field.name.trim() || !field.value.trim()),
    [customFields]
  );

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
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

    const limit = Number(desiredQuantity) || 1;
    const varTotal = variations.reduce((sum, v) => sum + v.quantity, 0);
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

    const linkingContext = buildLinkingAudienceContext(visibilityMode, sharedWithUserIds, user?.Id);
    const incompatibleLink = linkedItemIds.find((linkedId) => {
      const linked = wishlistItems.find((i) => i.Id === linkedId);
      return !linked || !canLinkItemsByAudience(linkingContext, linked);
    });
    if (incompatibleLink) {
      setErrorMsg(LINK_AUDIENCE_MISMATCH_MESSAGE);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Serialize optional and custom fields inside description as JSON if present
      let descPayload: string | null = null;

      const visibleDynamicValues: Record<string, string> = {};
      definitions.forEach(def => {
        if (isFieldVisible(def)) {
          const val = dynamicValues[def.FieldKey];
          if (val && val.trim()) {
            visibleDynamicValues[def.FieldKey] = val.trim();
          }
        }
      });

      const hasVisibleDynamic = Object.keys(visibleDynamicValues).length > 0;
      const hasExtraFields = pantsSize.trim() || shirtSize.trim() || shoesSize.trim() || socksSize.trim() || color.trim() || isMultiCount || linkedItemIds.length > 0 || customFields.some(f => f.name.trim() && f.value.trim());

      if (hasVisibleDynamic || hasExtraFields || description.trim() || !isOwner || isFavorite) {
        descPayload = JSON.stringify({
          text: description.trim() || null,
          pantsSize: pantsSize.trim() || null,
          shirtSize: shirtSize.trim() || null,
          shoesSize: shoesSize.trim() || null,
          socksSize: socksSize.trim() || null,
          color: color.trim() || null,
          multiCount: isMultiCount,
          desiredQuantity: isMultiCount ? desiredQuantity : 1,
          variations: isMultiCount ? variations : [],
          linkedItemIds,
          custom: customFields
            .filter(f => f.name.trim() && f.value.trim())
            .map(f => ({ name: f.name.trim(), value: f.value.trim() })),
          otherUsersCanSee: isOwner ? true : otherUsersCanSee,
          isFavorite: isOwner ? isFavorite : undefined,
          isPinned: !isOwner ? isFavorite : undefined,
          ...visibleDynamicValues
        });
      }

      const priorityVal = priorityWeight.trim() ? parseInt(priorityWeight, 10) : null;

      const finalSharedWith = visibilityMode === 'restricted'
        ? sharedWithUserIds
        : (visibilityMode === 'private' && user?.Id ? [user.Id] : []);

      let savedItemId: string;
      let createdItem: Item | null = null;
      const previousLinkedIds = item
        ? resolveEditorLinkedItemIds(item.Id, wishlistItems)
        : [];

      if (item) {
        await itemsApi.updateItem(
          item.Id,
          name.trim(),
          descPayload,
          null,
          category === 'uncategorized' ? null : category,
          priorityVal,
          finalSharedWith
        );
        savedItemId = item.Id;
      } else {
        createdItem = await itemsApi.addItem(
          listId,
          name.trim(),
          descPayload,
          null,
          isOwner ? false : isHiddenIdea,
          linkUrl.trim() || null,
          price.trim() ? parseFloat(price) : null,
          websiteName.trim() || null,
          category === 'uncategorized' ? null : category,
          priorityVal,
          finalSharedWith
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
            ? { ...wishlistItem, Description: descPayload }
            : wishlistItem
        );
        await syncBidirectionalItemLinks(
          savedItemId,
          linkedItemIds,
          itemsForSync,
          previousLinkedIds
        );
      }

      // Reset all states
      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(false);
      setSharedWithUserIds([]);
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      setPrice('');
      setIsFavorite(false);
      setPantsSize('');
      setShirtSize('');
      setShoesSize('');
      setSocksSize('');
      setColor('');
      setCustomFields([]);
      setShowExtraFields(false);
      onSuccess();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to add item.');
    } finally {
      setIsLoading(false);
    }
  };

  // Compile list of categories
  const renderedCategories: { id: string; label: string; isCustom?: boolean }[] = [];
  STANDARD_CATEGORIES.forEach(c => renderedCategories.push({ ...c, isCustom: false }));

  if (existingCategories) {
    existingCategories.forEach(cat => {
      if (cat && cat !== 'uncategorized' && !STANDARD_CATEGORIES.some(s => s.id === cat) && !renderedCategories.some(r => r.id === cat) && !deletedCategories.includes(cat)) {
        renderedCategories.push({ id: cat, label: getFriendlyCategoryLabel(cat), isCustom: true });
      }
    });
  }

  sessionCustomCategories.forEach(cat => {
    if (cat && !renderedCategories.some(r => r.id === cat) && !deletedCategories.includes(cat)) {
      renderedCategories.push({ id: cat, label: getFriendlyCategoryLabel(cat), isCustom: true });
    }
  });

  if (category && category !== 'uncategorized' && !renderedCategories.some(r => r.id === category) && !deletedCategories.includes(category)) {
    renderedCategories.push({ id: category, label: getFriendlyCategoryLabel(category), isCustom: true });
  }

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

  const isScrapeButtonPulsing = isValidUrl(linkUrl) && !hasScraped && !isAutopopulating;

  const [varName, setVarName] = useState('');
  const [varQty, setVarQty] = useState<number | ''>(1);
  const [varError, setVarError] = useState<string | null>(null);
  const showOptionalSizing = (category && category !== 'uncategorized') || hasScraped;

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
      pantsSize={pantsSize}
      setPantsSize={setPantsSize}
      shirtSize={shirtSize}
      setShirtSize={setShirtSize}
      shoesSize={shoesSize}
      setShoesSize={setShoesSize}
      socksSize={socksSize}
      setSocksSize={setSocksSize}
      color={color}
      setColor={setColor}
      customFields={customFields}
      handleAddCustomField={handleAddCustomField}
      handleRemoveCustomField={handleRemoveCustomField}
      handleUpdateCustomField={handleUpdateCustomField}
      hasIncompleteCustomFields={hasIncompleteCustomFields}
      showExtraFields={showExtraFields}
      setShowExtraFields={setShowExtraFields}
      renderedCategories={renderedCategories}
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
      desiredQuantity={desiredQuantity}
      setDesiredQuantity={setDesiredQuantity}
      variations={variations}
      setVariations={setVariations}
      linkedItemIds={linkedItemIds}
      resolvedLinkedCount={resolvedLinkedCount}
      wishlistItems={wishlistItems}
      itemId={item?.Id}
      isLinkingModeActive={isLinkingModeActive}
      setIsLinkingModeActive={setIsLinkingModeActive}
      getFriendlyCategoryLabel={getFriendlyCategoryLabel}
      showOptionalSizing={showOptionalSizing}
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
      setVisibilityMode={setVisibilityMode}
    />
  );
};
