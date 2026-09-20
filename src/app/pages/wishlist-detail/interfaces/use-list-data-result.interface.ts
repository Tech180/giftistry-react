import type { Dispatch, SetStateAction } from 'react';
import type { Item, ItemActions } from 'features/items';
import type { ItemListGroup } from 'features/items/interfaces/item-list-result.interface';
import type { BackgroundJobView } from 'features/jobs';
import type { Priority, Wishlist } from 'features/wishlists';
import type { ListShare } from 'features/wishlists';

export interface UseListDataResult {
  wishlist: Wishlist | null;
  setWishlist: Dispatch<SetStateAction<Wishlist | null>>;
  isWishlistLoading: boolean;
  wishlistError: string | null;
  priorities: Priority[];
  listShares: ListShare[];
  items: Item[];
  itemGroups: ItemListGroup[] | null;
  isItemsLoading: boolean;
  itemActions: ItemActions;
  loadData: () => Promise<void>;
  reloadListContent: () => Promise<void>;
  softReloadItems: () => Promise<void>;
  activeJob: BackgroundJobView | null;
  isCancellingJob: boolean;
  onCancelJob: () => void;
  enrichingItemIds: Set<string>;
  refreshJob: () => Promise<unknown>;
}
