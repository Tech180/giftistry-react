import type { Dispatch, SetStateAction } from 'react';
import type { Item } from 'features/items';

export interface Props {
  inlineOnMobile?: boolean;
  linkableItems: Item[];
  linkedItemIds: string[];
  relatedItemIds: string[];
  setLinkedItemIds: Dispatch<SetStateAction<string[]>>;
  setRelatedItemIds: Dispatch<SetStateAction<string[]>>;
  onItemTaggedClick?: (itemId: string) => void;
  isLinkingModeActive: boolean;
  isRelatingModeActive: boolean;
  readOnly?: boolean;
}
