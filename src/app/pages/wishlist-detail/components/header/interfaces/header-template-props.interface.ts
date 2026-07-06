import { Wishlist, Priority } from 'features/wishlists';
import { Item } from 'features/items';

export interface HeaderTemplateProps {
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
  saveVisibility: (visibility: 'private' | 'friends' | 'link') => Promise<void>;
  globalAiEnabled: boolean;
  isCommentsOpen: boolean;
  setIsCommentsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShareOpen: (open: boolean) => void;
  isEditingTitle: boolean;
  setIsEditingTitle: (val: boolean) => void;
  tempTitle: string;
  setTempTitle: (val: string) => void;
  isEditingDate: boolean;
  setIsEditingDate: (val: boolean) => void;
  tempDate: string;
  setTempDate: (val: string) => void;
  isExportDropdownOpen: boolean;
  setIsExportDropdownOpen: (val: boolean) => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
}
