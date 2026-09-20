import type { Wishlist } from 'features/wishlists';

export interface UsePageActionsOptions {
  wishlist: Wishlist | null;
  isOwner: boolean;
  canCollaborate: boolean;
  isArchived: boolean;
  isLocked: boolean;
  canShowAi: boolean;
  canShowWebSearch: boolean;
  isDeactivating: boolean;
  isActivating: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
  isMobileFab: boolean;
  user: {
    Id?: string;
    FirstName?: string | null;
    LastName?: string | null;
    Username?: string | null;
  } | null;
  reloadListContent: () => Promise<void>;
  handleDuplicate: () => void;
  handleActivateConfirm: () => void;
  handleDeactivateConfirm: () => void;
  handleDeleteConfirm: () => void;
  setIsCommentsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsShareOpen: (open: boolean) => void;
  toggleAiEnabled: () => void;
  toggleWebSearchEnabled: () => void;
  toggleManualJobBackground: () => void;
  toggleAutoRollover: () => void;
  toggleAllowGroupFunds: () => void;
}
