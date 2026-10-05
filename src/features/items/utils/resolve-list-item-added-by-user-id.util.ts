import type { Item } from '../interfaces/item.interface';

export function resolveListItemAddedByUserId(
  item: Item,
  listOwnerUserId: string | null
): string | null {
  if (item.SuggestedByUserId) {
    return item.SuggestedByUserId;
  }
  return listOwnerUserId;
}
