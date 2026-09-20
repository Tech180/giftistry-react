import type { OnlineUser } from '../../../interfaces/online-user.interface';

export interface UseCommentRealtimeResult {
  onlineUsers: OnlineUser[];
  typingUsers: string[];
  notifyTypingStart: () => void;
  notifyTypingStop: () => void;
}
