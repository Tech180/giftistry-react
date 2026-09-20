import type { OwnerInfo } from './owner-info.interface';

export interface Props {
  listId: string;
  isOwner: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  ownerInfo?: OwnerInfo;
}
