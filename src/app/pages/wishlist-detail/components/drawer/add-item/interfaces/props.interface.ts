import { Item } from 'features/items';
import { ListShare } from 'features/wishlists';
import type { LinkingAudienceContext } from 'features/items/interfaces/linking-audience-context.interface';
import type { ItemEnrichJobResult } from 'features/jobs/interfaces/item-enrich-job-result.interface';

export interface Props {
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
  /** Item authority (owner or collaborator). Defaults to `isOwner` when omitted. */
  canCollaborate?: boolean;
  listId: string;
  listAiEnabled: boolean;
  listManualJobBackground?: boolean;
  canUseWebSearchOnList?: boolean;
  listShares: ListShare[];
  onClose: () => void;
  onSuccess: () => void;
  onAutoEnrichStarted?: (result: ItemEnrichJobResult) => void;
  setEditingItemDraft: (draft: Partial<Item> | null) => void;
  loadData: () => void;
  onItemTaggedClick?: (itemId: string) => void;
  /** Bump to open claimer custom substitution create in the nested editor. */
  autoOpenClaimerSubstitutionNonce?: number;
  /** Bump with edit id to open claimer custom substitution edit. */
  autoOpenClaimerSubstitutionEditNonce?: number;
  autoOpenClaimerSubstitutionEditId?: string | null;
}
