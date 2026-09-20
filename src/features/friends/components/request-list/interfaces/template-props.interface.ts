import type { FriendRequest } from '../../../interfaces/friend-request.interface';
import type { Props } from './props.interface';

export interface TemplateProps extends Props {
  getDisplayName: (request: FriendRequest, type: 'incoming' | 'outgoing') => string;
  getUserId: (request: FriendRequest, type: 'incoming' | 'outgoing') => string;
}
