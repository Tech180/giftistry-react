import { FriendRequest } from '../../../interfaces/friend.interface';

export interface FriendRequestListTemplateProps {
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  processingId?: string | null;
  highlightedRequestId?: string | null;
  getDisplayName: (request: FriendRequest, type: 'incoming' | 'outgoing') => string;
  getUserId: (request: FriendRequest, type: 'incoming' | 'outgoing') => string;
}
