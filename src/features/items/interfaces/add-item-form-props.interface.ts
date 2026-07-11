import { Item } from './item.interface';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { LinkingAudienceContext } from '../utils/item-audience.util';

export interface AddItemFormProps {
  listId: string;
  isOwner: boolean;
  onSuccess: () => void;
  existingCategories?: string[];
  item?: Item | null;
  onDraftChange?: (draft: Partial<Item> | null) => void;
  wishlistItems?: Item[];
  linkedItemIds: string[];
  resolvedLinkedCount: number;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  onLinkingAudienceChange?: (context: LinkingAudienceContext) => void;
  onPriorityChange?: () => void;
  isOpen?: boolean;
  listShares?: ListShare[];
  onLoadingChange?: (loading: boolean) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  canShowAi?: boolean;
  listAiEnabled?: boolean;
}

