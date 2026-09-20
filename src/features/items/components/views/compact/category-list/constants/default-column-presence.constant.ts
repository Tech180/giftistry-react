import type { CompactCategoryColumnPresence } from '../../../../../interfaces/compact-category-column-presence.interface';

export const DEFAULT_COLUMN_PRESENCE: CompactCategoryColumnPresence = {
  leading: true,
  select: false,
  relations: false,
  audience: false,
  quantity: false,
  price: true,
  funding: false,
  trailing: false,
  claimActions: false,
  wideClaimActions: false,
};
