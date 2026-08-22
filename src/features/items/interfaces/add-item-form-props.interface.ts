import { Item } from './item.interface';
import { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import { LinkingAudienceContext } from '../utils/item-audience.util';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';

export interface AddItemFormProps {
  listId: string;
  isOwner: boolean;
  onSuccess: () => void;
  existingCategories?: string[];
  item?: Item | null;
  /** Fired after an `update-item` enrich job wrote fresh details onto the item. */
  onItemEnriched?: () => void;
  /** Fired when closing mid-enrich promotes a draft to create-from-url (like Auto-add). */
  onAutoEnrichStarted?: (result: ItemEnrichJobResult) => void;
  onDraftChange?: (draft: Partial<Item> | null) => void;
  wishlistItems?: Item[];
  linkedItemIds: string[];
  resolvedLinkedCount: number;
  relatedItemIds: string[];
  resolvedRelatedCount: number;
  isLinkingModeActive: boolean;
  setIsLinkingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  isRelatingModeActive: boolean;
  setIsRelatingModeActive: React.Dispatch<React.SetStateAction<boolean>>;
  onLinkingAudienceChange?: (context: LinkingAudienceContext) => void;
  onPriorityChange?: () => void;
  isOpen?: boolean;
  listShares?: ListShare[];
  onLoadingChange?: (loading: boolean) => void;
  onDirtyChange?: (isDirty: boolean) => void;
  canShowAi?: boolean;
  listAiEnabled?: boolean;
  listManualJobBackground?: boolean;
  canUseWebSearchOnList?: boolean;
  /** When true, form fields are non-editable (View Item drawer). */
  readOnly?: boolean;
}

