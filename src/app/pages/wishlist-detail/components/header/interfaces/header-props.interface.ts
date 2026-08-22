import type { ReactNode } from 'react';
import { Wishlist, Priority } from 'features/wishlists';
import { Item } from 'features/items';

export interface HeaderProps {
  wishlist: Wishlist;
  items: Item[];
  priorities: Priority[];
  isOwner: boolean;
  isPublicGuest?: boolean;
  isExpired: boolean;
  isArchived: boolean;
  isDeactivating: boolean;
  isActivating: boolean;
  isDeleting: boolean;
  confirmAction: 'deactivate' | 'activate' | 'delete' | null;
  setConfirmAction: (val: 'deactivate' | 'activate' | 'delete' | null) => void;
  handleDeactivateConfirm: () => void;
  handleActivateConfirm: () => void;
  handleDeleteConfirm: () => void;
  saveTitle: (val: string) => Promise<void>;
  saveDate: (val: string) => Promise<void>;
  formatDate: (dateStr: string | null) => string;
  toggleAiEnabled: () => void;
  toggleWebSearchEnabled: () => void;
  toggleManualJobBackground: () => void;
  toggleAutoRollover: () => void;
  isCommentsOpen: boolean;
  setIsCommentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareOpen: (open: boolean) => void;
  canImport: boolean;
  isImportOpen: boolean;
  onImportToggle: () => void;
}
