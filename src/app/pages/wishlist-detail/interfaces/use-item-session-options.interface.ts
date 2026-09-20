import type { RefObject } from 'react';
import type { Item } from 'features/items';
import type { Wishlist } from 'features/wishlists';
import type { UseItemSessionAssociationApi } from './use-item-session-association-api.interface';

export interface UseItemSessionOptions {
  items: Item[];
  wishlist: Wishlist | null;
  canCollaborate: boolean;
  canSuggest: boolean;
  canShowAi: boolean;
  loadData: () => Promise<void>;
  softReloadItems: () => Promise<void>;
  refreshJob: () => Promise<void>;
  associationsRef: RefObject<UseItemSessionAssociationApi | null>;
}
