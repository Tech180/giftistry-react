import type { OwnerInfo } from '../../fab-panel/interfaces/owner-info.interface';

export interface Props {
  listId: string;
  isOwner: boolean;
  variant?: 'classic' | 'compact';
  ownerInfo?: OwnerInfo;
  onCautionModeChange?: (active: boolean) => void;
}
