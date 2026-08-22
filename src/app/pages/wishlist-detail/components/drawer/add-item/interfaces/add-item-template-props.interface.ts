import { Item } from 'features/items';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { LinkingAudienceContext } from 'features/items/utils/item-audience.util';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';

export interface AddItemTemplateProps {
  isOpen: boolean;
  editingItem: Item | null;
  viewingItem?: Item | null;
  items: Item[];
  linkableItems: Item[];
  resolvedLinkedItems: Item[];
  resolvedRelatedItems: Item[];
  linkedItemIds: string[];
  setLinkedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  relatedItemIds: string[];
  setRelatedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  isRelatingModeActive: boolean;
  setIsRelatingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  /** When true, linking/relating mode hides the drawer so the list is selectable (overlay / mobile). */
  collapseDrawerWhileLinking?: boolean;
  handleLinkingAudienceChange: (context: LinkingAudienceContext) => void;
  isOwner: boolean;
  listId: string;
  listAiEnabled: boolean;
  listManualJobBackground?: boolean;
  canUseWebSearchOnList?: boolean;
  canShowAi: boolean;
  listShares: ListShare[];
  onClose: () => void;
  onSuccess: () => void;
  onAutoEnrichStarted?: (result: ItemEnrichJobResult) => void;
  setEditingItemDraft: (draft: any) => void;
  loadData: () => void;
  isLoading?: boolean;
  isFormDirty?: boolean;
  onFormLoadingChange?: (loading: boolean) => void;
  onFormDirtyChange?: (dirty: boolean) => void;
  onItemTaggedClick?: (itemId: string) => void;
}
