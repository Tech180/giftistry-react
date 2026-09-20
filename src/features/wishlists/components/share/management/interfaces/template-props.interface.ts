import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { OwnerInfo } from '../../fab-panel/interfaces/owner-info.interface';

export interface TemplateProps {
  variant?: 'classic' | 'compact';
  ownerInfo?: OwnerInfo;
  shares: ListShare[];
  isOwner: boolean;
  isLoading: boolean;
  error: string | null;
  updatingId: string | null;
  removingId: string | null;
  pendingDemotionShareId: string | null;
  cautionTitle: string;
  cautionDescription: string;
  cautionProceedPrompt: string;
  onRoleChange: (shareId: string, role: 'viewer' | 'collaborator') => void;
  onRemove: (shareId: string) => void;
  onConfirmDemotion: () => void;
  onCancelDemotion: () => void;
  getDisplayName: (share: ListShare) => string;
}
