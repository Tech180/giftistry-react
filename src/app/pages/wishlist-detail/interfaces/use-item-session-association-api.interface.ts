import type { Item } from 'features/items';

export interface UseItemSessionAssociationApi {
  primeForItem: (sourceItem: Item) => void;
  clear: () => void;
  resetForAdd: () => void;
}
