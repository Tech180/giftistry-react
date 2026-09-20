import type React from 'react';
import type { Item } from '../../../interfaces/item.interface';
import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { ItemPhotoGalleryEntry } from '../../photo-gallery/interfaces/item-photo-gallery-props.interface';
import type { CustomFieldRow } from '../../../interfaces/custom-field-row.interface';
import type { ItemDescriptionMetadata } from 'shared/interfaces/item-description-metadata.interface';
import { itemsApi } from '../../../api/items.api';
import {
  buildLinkingAudienceContext,
  canLinkItemsByAudience,
  resolveItemSharedWithUserIds,
} from '../../../utils/item-audience.util';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
  LINK_AUDIENCE_MISMATCH_MESSAGE,
} from '../../../constants/linked-items-messages.constant';
import {
  itemSupportsLinkedItems,
  linkGroupSupportsLinkedItems,
} from '../../../utils/item-supports-linked-items.util';
import { parsePriorityWeight } from '../../../utils/parse-priority-weight.util';
import { syncBidirectionalItemLinks, resolveEditorLinkedItemIds } from '../../../utils/item-links-sync.util';
import { syncBidirectionalItemRelated, resolveEditorRelatedItemIds } from '../../../utils/item-related-sync.util';
import type { UseSubmitItemResult } from '../interfaces/use-submit-item-result.interface';

export function useSubmitItem(options: {
  readOnly: boolean;
  item: Item | null | undefined;
  isEditDirty: boolean;
  name: string;
  desiredQuantity: number | '';
  variations: { name: string; quantity: number }[];
  isMultiCount: boolean;
  visibilityMode: 'everyone' | 'restricted' | 'private';
  sharedWithUserIds: string[];
  hasIncompleteCustomFields: boolean;
  listShares: ListShare[];
  userId?: string;
  userFirstName?: string;
  userLastName?: string;
  userUsername?: string;
  linkedItemIds: string[];
  relatedItemIds: string[];
  wishlistItems: Item[];
  listId: string;
  category: string;
  canManageItems: boolean;
  claimOnCreate: boolean;
  isHiddenIdea: boolean;
  isFavorite: boolean;
  priorityWeight: string;
  linkUrl: string;
  price: string;
  websiteName: string;
  buildDescriptionPayload: (opts: {
    canManageItems: boolean;
    isFavorite: boolean;
  }) => ItemDescriptionMetadata | null;
  setIsLoading: (val: boolean) => void;
  setErrorMsg: (val: string | null) => void;
  setWarningMsg: (val: string | null) => void;
  setShowExtraFields: (val: boolean) => void;
  setName: (val: string) => void;
  setDescription: (val: string) => void;
  setPriorityWeight: (val: string) => void;
  setIsHiddenIdea: (val: boolean) => void;
  setSharedWithUserIds: (val: string[]) => void;
  setLinkUrl: (val: string) => void;
  setWebsiteName: (val: string) => void;
  setCategory: (val: string) => void;
  clearAiCategories: () => void;
  setPrice: (val: string) => void;
  setIsFavorite: (val: boolean) => void;
  setCustomFields: React.Dispatch<React.SetStateAction<CustomFieldRow[]>>;
  setEditingCustomFieldNameId: (val: string | null) => void;
  setPhotoEntries: (val: ItemPhotoGalleryEntry[]) => void;
  setPhotoError: (val: string | null) => void;
  initialPhotosSnapshotRef: React.RefObject<string>;
  onSuccess: () => void;
}): UseSubmitItemResult {
  const {
    readOnly,
    item,
    isEditDirty,
    name,
    desiredQuantity,
    variations,
    isMultiCount,
    visibilityMode,
    sharedWithUserIds,
    hasIncompleteCustomFields,
    listShares,
    userId,
    userFirstName,
    userLastName,
    userUsername,
    linkedItemIds,
    relatedItemIds,
    wishlistItems,
    listId,
    category,
    canManageItems,
    claimOnCreate,
    isHiddenIdea,
    isFavorite,
    priorityWeight,
    linkUrl,
    price,
    websiteName,
    buildDescriptionPayload,
    setIsLoading,
    setErrorMsg,
    setWarningMsg,
    setShowExtraFields,
    setName,
    setDescription,
    setPriorityWeight,
    setIsHiddenIdea,
    setSharedWithUserIds,
    setLinkUrl,
    setWebsiteName,
    setCategory,
    clearAiCategories,
    setPrice,
    setIsFavorite,
    setCustomFields,
    setEditingCustomFieldNameId,
    setPhotoEntries,
    setPhotoError,
    initialPhotosSnapshotRef,
    onSuccess,
  } = options;

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
      desiredQuantity === 0 ? Number.POSITIVE_INFINITY : Number(desiredQuantity) || 1;
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
    const finalSharedWith = resolveItemSharedWithUserIds(visibilityMode, sharedWithUserIds, {
      ownerUserId: userId,
      listShareUserIds,
    });

    if (visibilityMode === 'restricted' && finalSharedWith.length === 0) {
      setErrorMsg('Please select at least one person to share with.');
      return;
    }

    const linkingContext = buildLinkingAudienceContext(
      visibilityMode,
      visibilityMode === 'restricted' ? finalSharedWith : [],
      userId
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
          SuggestedByUserId: userId ?? null,
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
        IsSuggestion: item?.IsSuggestion ?? !canManageItems,
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
      const metadataPayload = buildDescriptionPayload({ canManageItems, isFavorite });
      const priorityVal = parsePriorityWeight(priorityWeight);

      let savedItemId: string;
      let createdItem: Item | null = null;
      const previousLinkedIds = item ? resolveEditorLinkedItemIds(item.Id, wishlistItems) : [];
      const previousRelatedIds = item ? resolveEditorRelatedItemIds(item.Id, wishlistItems) : [];

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
          canManageItems ? false : isHiddenIdea
        );
        savedItemId = item.Id;
      } else {
        createdItem = await itemsApi.addItem(
          listId,
          name.trim(),
          null,
          null,
          canManageItems ? false : isHiddenIdea,
          linkUrl.trim() || null,
          price.trim() ? parseFloat(price) : null,
          websiteName.trim() || null,
          category === 'uncategorized' ? null : category,
          priorityVal,
          finalSharedWith,
          metadataPayload
        );
        savedItemId = createdItem.Id;

        if (!canManageItems && claimOnCreate && createdItem?.Id) {
          try {
            const claimerName =
              userFirstName || userLastName || userUsername
                ? `${userFirstName ?? ''} ${userLastName ?? ''}`.trim() || userUsername || null
                : null;
            await itemsApi.claimItem(createdItem.Id, null, claimerName, false);
          } catch {
            // Ignore claim error
          }
        }
      }

      const hadLinks = previousLinkedIds.length > 0;
      if (linkedItemIds.length > 0 || hadLinks) {
        await syncBidirectionalItemLinks(savedItemId, linkedItemIds);
      }

      const hadRelated = previousRelatedIds.length > 0;
      if (relatedItemIds.length > 0 || hadRelated) {
        await syncBidirectionalItemRelated(savedItemId, relatedItemIds);
      }

      setName('');
      setDescription('');
      setPriorityWeight('');
      setIsHiddenIdea(!canManageItems);
      setSharedWithUserIds([]);
      setLinkUrl('');
      setWebsiteName('');
      setCategory('uncategorized');
      clearAiCategories();
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

  return { handleSubmit };
}
