import type { FriendRequest } from './friend-request.interface';

export interface FriendRequestsResult {
  Incoming: FriendRequest[];
  Outgoing: FriendRequest[];
}
