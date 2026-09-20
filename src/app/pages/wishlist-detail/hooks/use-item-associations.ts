import { useCallback, useEffect, useMemo, useState, type SetStateAction } from 'react';
import type { Item } from 'features/items';
import { canLinkItemsByAudience } from 'features/items/utils/item-audience.util';
import type { LinkingAudienceContext } from 'features/items/interfaces/linking-audience-context.interface';
import { itemSupportsLinkedItems } from 'features/items/utils/item-supports-linked-items.util';
import {
  LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
  LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE,
} from 'features/items/constants/linked-items-messages.constant';
import { useToast } from 'shared/providers/toast';
import { buildDraftSourceItem } from '../utils/build-draft-source-item.util';
import { resolveEditorAssociationIds } from '../utils/resolve-editor-association-ids.util';
import type { UseItemAssociationsOptions } from '../interfaces/use-item-associations-options.interface';
import type { UseItemAssociationsResult } from '../interfaces/use-item-associations-result.interface';

export function useItemAssociations({
  items,
  isAddOpen,
  editingItem,
  viewingItem,
  editingItemDraft,
  canCollaborate,
  wishlistId,
}: UseItemAssociationsOptions): UseItemAssociationsResult {
  const { showToast } = useToast();

  const [linkedItemIds, setLinkedItemIds] = useState<string[]>([]);
  const [relatedItemIds, setRelatedItemIds] = useState<string[]>([]);
  const [isLinkingModeActive, setIsLinkingModeActive] = useState(false);
  const [isRelatingModeActive, setIsRelatingModeActive] = useState(false);
  const [linkingAudienceContext, setLinkingAudienceContext] = useState<LinkingAudienceContext>({
    mode: 'everyone',
    sharedWithUserIds: [],
  });

  useEffect(() => {
    setLinkedItemIds((prev) => prev.filter((id) => items.some((item) => item.Id === id)));
    setRelatedItemIds((prev) => prev.filter((id) => items.some((item) => item.Id === id)));
  }, [items]);

  useEffect(() => {
    if (!isAddOpen && !editingItem && !viewingItem) {
      setLinkedItemIds([]);
      setRelatedItemIds([]);
      setIsLinkingModeActive(false);
      setIsRelatingModeActive(false);
    }
  }, [isAddOpen, editingItem, viewingItem]);

  const setIsLinkingModeActiveExclusive = useCallback((value: SetStateAction<boolean>) => {
    setIsLinkingModeActive((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) {
        setIsRelatingModeActive(false);
      }
      return next;
    });
  }, []);

  const setIsRelatingModeActiveExclusive = useCallback((value: SetStateAction<boolean>) => {
    setIsRelatingModeActive((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      if (next) {
        setIsLinkingModeActive(false);
      }
      return next;
    });
  }, []);

  const handleLinkingAudienceChange = useCallback((context: LinkingAudienceContext) => {
    setLinkingAudienceContext(context);
  }, []);

  const isItemLinkCompatible = useCallback(
    (target: Item) =>
      canLinkItemsByAudience(linkingAudienceContext, target) && itemSupportsLinkedItems(target),
    [linkingAudienceContext]
  );

  const isItemRelateCompatible = useCallback(
    (target: Item) => canLinkItemsByAudience(linkingAudienceContext, target),
    [linkingAudienceContext]
  );

  const resolveLinkingSourceItem = useCallback(
    (): Item | null =>
      buildDraftSourceItem({
        editingItem,
        editingItemDraft,
        isAddOpen,
        canCollaborate,
        wishlistId,
      }),
    [editingItem, editingItemDraft, isAddOpen, canCollaborate, wishlistId]
  );

  const handleLinkItemToggle = useCallback(
    (itemId: string) => {
      const target = items.find((i) => i.Id === itemId);
      if (!target || !canLinkItemsByAudience(linkingAudienceContext, target)) {
        return;
      }

      setLinkedItemIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }

        const source = resolveLinkingSourceItem();
        const sourceBlocked = !!source && !itemSupportsLinkedItems(source, source.Metadata);
        const targetBlocked = !itemSupportsLinkedItems(target);
        if (sourceBlocked || targetBlocked) {
          const isSuggestionBlock =
            source?.IsSuggestion === true || target.IsSuggestion === true;
          showToast(
            isSuggestionBlock
              ? LINKED_ITEMS_SUGGESTION_UNSUPPORTED_MESSAGE
              : LINKED_ITEMS_MULTI_COUNT_UNSUPPORTED_MESSAGE,
            'error'
          );
          return prev;
        }

        setRelatedItemIds((relatedPrev) => relatedPrev.filter((id) => id !== itemId));
        return [...prev, itemId];
      });
    },
    [items, linkingAudienceContext, resolveLinkingSourceItem, showToast]
  );

  const handleRelateItemToggle = useCallback(
    (itemId: string) => {
      const target = items.find((i) => i.Id === itemId);
      if (!target || !canLinkItemsByAudience(linkingAudienceContext, target)) {
        return;
      }

      setRelatedItemIds((prev) => {
        if (prev.includes(itemId)) {
          return prev.filter((id) => id !== itemId);
        }

        setLinkedItemIds((linkedPrev) => linkedPrev.filter((id) => id !== itemId));
        return [...prev, itemId];
      });
    },
    [items, linkingAudienceContext]
  );

  useEffect(() => {
    if (!isAddOpen && !editingItem && !viewingItem) {
      return;
    }

    setLinkedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return (
          !!target &&
          canLinkItemsByAudience(linkingAudienceContext, target) &&
          itemSupportsLinkedItems(target)
        );
      })
    );
    setRelatedItemIds((prev) =>
      prev.filter((id) => {
        const target = items.find((i) => i.Id === id);
        return target && canLinkItemsByAudience(linkingAudienceContext, target);
      })
    );
  }, [linkingAudienceContext, isAddOpen, editingItem, viewingItem, items]);

  useEffect(() => {
    if (!isAddOpen && !editingItem) {
      return;
    }

    const source = resolveLinkingSourceItem();
    if (source && !itemSupportsLinkedItems(source, source.Metadata)) {
      setLinkedItemIds((prev) => (prev.length > 0 ? [] : prev));
      setIsLinkingModeActive(false);
    }
  }, [isAddOpen, editingItem, resolveLinkingSourceItem]);

  const resolvedLinkedItems = useMemo(
    () =>
      linkedItemIds.map((id) => items.find((i) => i.Id === id)).filter((item): item is Item => !!item),
    [linkedItemIds, items]
  );

  const resolvedRelatedItems = useMemo(
    () =>
      relatedItemIds
        .map((id) => items.find((i) => i.Id === id))
        .filter((item): item is Item => !!item),
    [relatedItemIds, items]
  );

  const primeForItem = useCallback(
    (sourceItem: Item) => {
      const { sourceContext, linkedItemIds: nextLinked, relatedItemIds: nextRelated } =
        resolveEditorAssociationIds(sourceItem, items);
      setIsLinkingModeActive(false);
      setIsRelatingModeActive(false);
      setLinkingAudienceContext(sourceContext);
      setLinkedItemIds(nextLinked);
      setRelatedItemIds(nextRelated);
    },
    [items]
  );

  const clear = useCallback(() => {
    setLinkedItemIds([]);
    setRelatedItemIds([]);
    setIsLinkingModeActive(false);
    setIsRelatingModeActive(false);
  }, []);

  const resetForAdd = useCallback(() => {
    clear();
    setLinkingAudienceContext({ mode: 'everyone', sharedWithUserIds: [] });
  }, [clear]);

  return {
    linkedItemIds,
    setLinkedItemIds,
    relatedItemIds,
    setRelatedItemIds,
    resolvedLinkedItems,
    resolvedRelatedItems,
    isLinkingModeActive,
    setIsLinkingModeActive: setIsLinkingModeActiveExclusive,
    isRelatingModeActive,
    setIsRelatingModeActive: setIsRelatingModeActiveExclusive,
    handleLinkingAudienceChange,
    isItemLinkCompatible,
    isItemRelateCompatible,
    handleLinkItemToggle,
    handleRelateItemToggle,
    primeForItem,
    clear,
    resetForAdd,
  };
}
