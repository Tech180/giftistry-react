import type { FriendRequest } from '../../../interfaces/friend-request.interface';

export interface Props {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  processingId?: string | null;
  highlightedRequestId?: string | null;
}
