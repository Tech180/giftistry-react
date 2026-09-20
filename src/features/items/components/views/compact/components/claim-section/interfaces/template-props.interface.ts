import type { Item } from '../../../../../../interfaces/item.interface';
import type { ItemActions } from '../../../../../../interfaces/item-actions.interface';

export interface TemplateProps {
  showClaimFormWithActions: boolean;
  showClaimFormPrompt: boolean;
  showDeleteConfirmPanel: boolean;
  showLinkedClaimTags: boolean;
  useSyncedConfirmButtons: boolean;
  displayItem: Item;
  claimUserId: string | null;
  claimActorName: string | null;
  itemActions?: ItemActions;
  anonymous: boolean;
  setAnonymous: (val: boolean) => void;
  setShowClaimForm: (val: boolean) => void;
  setShowDeleteConfirm: (val: boolean) => void;
  linkedClaimPeers: Item[];
  wishlistItemsForLinkedClaim: Item[];
  onLinkedClaimItemClick?: (itemId: string) => void;
  allowGroupFunds: boolean;
  totalExtractedPrice: number;
  totalClaimedAmount: number;
  claimPrompt: string | undefined;
  claimConfirmLabel: string;
  linkedClaimPeerIds: string[];
  handleClaim: () => void;
  handleDelete: () => void;
  claimLoading: boolean;
  deleteLoading: boolean;
  claimFormPanelClassName: string;
  confirmButtonsClassName: string;
  actionBtnPrimaryClassName: string;
  confirmExtensionClassName: string;
  confirmPromptClassName: string;
  confirmLinkedTagsClassName: string;
  actionBtnClassName: string;
}
