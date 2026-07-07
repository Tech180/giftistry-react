import { Wishlist } from './wishlist.interface';

export interface WishlistCardTemplateProps {
  wishlist: Wishlist;
  isOwner: boolean;
  formattedDate: string;
  expirationClass: string;
  isArchived: boolean;
  isPersonalShared: boolean;
  isSharesSidebarOpen: boolean;
  onToggleSharesSidebar: (e: React.MouseEvent) => void;
  sidebarPage: number;
  onSidebarPageUp: (e: React.MouseEvent) => void;
  onSidebarPageDown: (e: React.MouseEvent) => void;
  pageSize: number;
}
