import type { Item } from '../interfaces/item.interface';

/** Item authority: owners and collaborators may edit any item; viewers only their suggestions. */
export function resolveCanEditItem(
  item: Pick<Item, 'SuggestedByUserId'>,
  userId: string | null | undefined,
  canCollaborate: boolean,
  isPublicGuest: boolean
): boolean {
  return (
    !isPublicGuest &&
    (canCollaborate || (!!userId && item.SuggestedByUserId === userId))
  );
}
