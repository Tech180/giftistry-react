import type { Dispatch, SetStateAction } from 'react';
import type { Item } from 'features/items';
import type { LinkingAudienceContext } from 'features/items/interfaces/linking-audience-context.interface';

export interface UseItemAssociationsResult {
  linkedItemIds: string[];
  setLinkedItemIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  relatedItemIds: string[];
  setRelatedItemIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  resolvedLinkedItems: Item[];
  resolvedRelatedItems: Item[];
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: Dispatch<SetStateAction<boolean>>;
  isRelatingModeActive: boolean;
  setIsRelatingModeActive: Dispatch<SetStateAction<boolean>>;
  handleLinkingAudienceChange: (context: LinkingAudienceContext) => void;
  isItemLinkCompatible: (item: Item) => boolean;
  isItemRelateCompatible: (item: Item) => boolean;
  handleLinkItemToggle: (itemId: string) => void;
  handleRelateItemToggle: (itemId: string) => void;
  primeForItem: (sourceItem: Item) => void;
  clear: () => void;
  resetForAdd: () => void;
}
