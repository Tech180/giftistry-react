import type { Item } from '../../../../../../interfaces/item.interface';
import type { ItemActions } from '../../../../../../interfaces/item-actions.interface';

export interface TemplateProps {
  drawerClassName: string;
  innerClassName: string;
  fallbackClassName: string;
  fallbackActionsClassName: string;
  showClaimDrawerContent: boolean;
  displayItem: Item;
  claimUserId: string | null | undefined;
  claimActorName: string | null | undefined;
  itemActions: ItemActions | undefined;
  anonymous: boolean;
  setAnonymous: (val: boolean) => void;
  setShowClaimForm: (val: boolean) => void;
  linkedClaimPeers: Item[];
  wishlistItemsForLinkedClaim: Item[];
  onLinkedClaimItemClick?: (itemId: string) => void;
  allowGroupFunds: boolean;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  handleClaim: () => void;
  claimLoading: boolean;
  hasLinkedClaimPeers: boolean;
  linkedClaimTaggedIds: string[];
  claimFormPrompt: string | undefined;
  claimConfirmLabel: string;
}
