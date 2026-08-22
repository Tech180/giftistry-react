import type { Item } from '../interfaces/item.interface';

export function resolveCanEditItem(
  item: Pick<Item, 'SuggestedByUserId'>,
  userId: string | null | undefined,
  isOwner: boolean,
  isPublicGuest: boolean
): boolean {
  return !isPublicGuest && (isOwner || (!!userId && item.SuggestedByUserId === userId));
}
