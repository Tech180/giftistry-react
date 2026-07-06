import { FriendRequest } from '../../../interfaces/friend.interface';

export interface FriendRequestListProps {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  processingId?: string | null;
  highlightedRequestId?: string | null;
}
