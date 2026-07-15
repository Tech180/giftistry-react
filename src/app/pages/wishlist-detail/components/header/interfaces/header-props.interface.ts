import type { ReactNode } from 'react';
import { Wishlist, Priority } from 'features/wishlists';
import { Item } from 'features/items';

export interface HeaderProps {
  wishlist: Wishlist;
  items: Item[];
  priorities: Priority[];
  isOwner: boolean;
  isExpired: boolean;
  isDeactivating: boolean;
  isDeleting: boolean;
  confirmAction: 'deactivate' | 'delete' | null;
  setConfirmAction: (val: 'deactivate' | 'delete' | null) => void;
  handleDeactivateConfirm: () => void;
  handleDeleteConfirm: () => void;
  saveTitle: (val: string) => Promise<void>;
  saveDate: (val: string) => Promise<void>;
  formatDate: (dateStr: string | null) => string;
  toggleRevealSuggestions: () => void;
  toggleAiEnabled: () => void;
  toggleWebSearchEnabled: () => void;
  isCommentsOpen: boolean;
  setIsCommentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareOpen: (open: boolean) => void;
  canImport: boolean;
  isImportOpen: boolean;
  onImportToggle: () => void;
}
