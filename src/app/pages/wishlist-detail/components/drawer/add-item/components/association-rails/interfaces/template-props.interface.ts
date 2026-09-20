import type { Item } from 'features/items';

export interface TemplateProps {
  inlineOnMobile: boolean;
  linkableItems: Item[];
  linkedItemIds: string[];
  relatedItemIds: string[];
  onRemoveLinkedId?: (id: string) => void;
  onRemoveRelatedId?: (id: string) => void;
  onItemClick?: (itemId: string) => void;
  isLinkingModeActive: boolean;
  isRelatingModeActive: boolean;
  relatedEdgeOffset?: string;
}
