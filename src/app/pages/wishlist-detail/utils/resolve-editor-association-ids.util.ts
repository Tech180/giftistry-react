import type { Item } from 'features/items';
import {
  canLinkItemsByAudience,
  linkingContextFromItem,
} from 'features/items/utils/item-audience.util';
import { resolveEditorLinkedItemIds } from 'features/items/utils/item-links-sync.util';
import { resolveEditorRelatedItemIds } from 'features/items/utils/item-related-sync.util';
import { itemSupportsLinkedItems } from 'features/items/utils/item-supports-linked-items.util';
import type { ResolveEditorAssociationIdsResult } from '../interfaces/resolve-editor-association-ids-result.interface';

export function resolveEditorAssociationIds(sourceItem: Item, items: Item[]): ResolveEditorAssociationIdsResult {
  const sourceContext = linkingContextFromItem(sourceItem);
  const linkedItemIds = sourceItem.IsSuggestion
    ? []
    : resolveEditorLinkedItemIds(sourceItem.Id, items).filter((id) => {
        const target = items.find((item) => item.Id === id);
        return target && canLinkItemsByAudience(sourceContext, target) && itemSupportsLinkedItems(target);
      });
  const relatedItemIds = resolveEditorRelatedItemIds(sourceItem.Id, items).filter((id) => {
    const target = items.find((item) => item.Id === id);
    return target && canLinkItemsByAudience(sourceContext, target);
  });

  return { sourceContext, linkedItemIds, relatedItemIds };
}
