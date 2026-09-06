import type { ListShare } from 'features/wishlists/interfaces/list-share.interface';
import type { ShareFabPanelOwnerInfo } from '../share-fab-panel/interfaces/share-fab-panel-props.interface';

export interface ManagementProps {
  listId: string;
  isOwner: boolean;
  variant?: 'classic' | 'compact';
  ownerInfo?: ShareFabPanelOwnerInfo;
  onCautionModeChange?: (active: boolean) => void;
}

export interface ManagementTemplateProps {
  variant?: 'classic' | 'compact';
  ownerInfo?: ShareFabPanelOwnerInfo;
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
