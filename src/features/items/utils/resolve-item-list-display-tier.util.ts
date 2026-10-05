import { ITEM_LIST_DISPLAY_TIER } from '../constants/item-list-display-tier.constant';
import type { ItemListDisplayTier } from '../interfaces/item-list-display-tier.type';
import type { Item } from '../interfaces/item.interface';
import { hasPriorityValue } from './item-priority.util';
import { getItemFavoriteFlag } from 'shared/utils/parse-item-description.util';

export function resolveItemListDisplayTier(item: Item): ItemListDisplayTier {
  const isFavorite = getItemFavoriteFlag(item.Description, item.Metadata);
  const hasPriority = hasPriorityValue(item.Priority);

  if (isFavorite && hasPriority) {
    return ITEM_LIST_DISPLAY_TIER.favoritedPriority;
  }
  if (hasPriority) {
    return ITEM_LIST_DISPLAY_TIER.priorityOnly;
  }
  if (isFavorite) {
    return ITEM_LIST_DISPLAY_TIER.favoritedOnly;
  }
  return ITEM_LIST_DISPLAY_TIER.neither;
}
