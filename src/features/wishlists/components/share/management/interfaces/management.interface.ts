import { ListShare } from 'features/wishlists/interfaces/list-share.interface';

export interface ManagementProps {
  listId: string;
  isOwner: boolean;
}

export interface ManagementTemplateProps {
  shares: ListShare[];
  isOwner: boolean;
  isLoading: boolean;
  error: string | null;
  updatingId: string | null;
  removingId: string | null;
  onRoleChange: (shareId: string, role: 'viewer' | 'collaborator') => void;
  onRemove: (shareId: string) => void;
  getDisplayName: (share: ListShare) => string;
}
