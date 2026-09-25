import { useEffect, useRef, useState } from 'react';
import { isDemoListId } from 'features/tour';
import type { OnlineUser } from '../../../interfaces/online-user.interface';
import { appendUniqueComment } from '../../../utils/append-unique-comment.util';
import { getCommentWsUrl } from '../../../utils/comment-ws.util';
import { parsePresenceUsers } from '../../../utils/parse-presence-users.util';
import {
  COMMENT_TYPING_STOP_DELAY_MS,
  COMMENT_TYPING_USER_TTL_MS,
} from '../../../constants/comment-presence.constant';
import type { UseCommentRealtimeParams } from '../interfaces/use-comment-realtime-params.interface';
import type { UseCommentRealtimeResult } from '../interfaces/use-comment-realtime-result.interface';

export function useCommentRealtime({
  listId,
  isAuthenticated,
  userId,
  isOwner,
  isExpired,
  setComments,
}: UseCommentRealtimeParams): UseCommentRealtimeResult {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsersMap, setTypingUsersMap] = useState<Record<string, string>>({});
  const typingTimeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const isDemo = isDemoListId(listId);

  useEffect(() => {
    if (isDemo || !isAuthenticated || !userId) {
      setOnlineUsers([]);
      setTypingUsersMap({});
      return;
    }

    const wsUrl = getCommentWsUrl(listId);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.Type === 'presence') {
          setOnlineUsers(parsePresenceUsers(data.Users));
        } else if (data.Type === 'typing') {
          const typingUserId = data.UserId;
          const typingUsername = data.Username;
          const isTyping = !!data.IsTyping;

          if (typingUserId === userId) {
            return;
          }

          if (isTyping) {
            setTypingUsersMap((prev) => ({
              ...prev,
              [typingUserId]: typingUsername,
            }));

            if (typingTimeoutRefs.current[typingUserId]) {
              clearTimeout(typingTimeoutRefs.current[typingUserId]);
            }

            typingTimeoutRefs.current[typingUserId] = setTimeout(() => {
              setTypingUsersMap((prev) => {
                const updated = { ...prev };
                delete updated[typingUserId];
                return updated;
              });
            }, COMMENT_TYPING_USER_TTL_MS);
          } else {
            setTypingUsersMap((prev) => {
              const updated = { ...prev };
              delete updated[typingUserId];
              return updated;
            });

            if (typingTimeoutRefs.current[typingUserId]) {
              clearTimeout(typingTimeoutRefs.current[typingUserId]);
            }
          }
        } else if (data.Type === 'comment.created') {
          if (data.Comment) {
            if (isOwner && !isExpired && data.Comment.IsOwnerVisible === false) {
              return;
            }

            setComments((prev) => appendUniqueComment(prev, data.Comment));
          }
        } else if (data.Type === 'comment.deleted') {
          if (data.CommentId) {
            setComments((prev) =>
              prev.map((c) =>
                c.Id === data.CommentId
                  ? { ...c, IsDeleted: true, Content: 'Comment was deleted.' }
                  : c,
              ),
            );
          }
        } else if (data.Type === 'reaction.toggled') {
          if (data.CommentId) {
            setComments((prev) =>
              prev.map((c) => {
                if (c.Id !== data.CommentId) {
                  return c;
                }

                const existing = c.Reactions || [];
                let newReactions = [...existing];

                if (data.Added) {
                  if (!newReactions.some((r) => r.UserId === data.UserId && r.Reaction === data.Reaction)) {
                    newReactions.push({
                      UserId: data.UserId,
                      Username: data.Username,
                      Reaction: data.Reaction,
                    });
                  }
                } else {
                  newReactions = newReactions.filter(
                    (r) => !(r.UserId === data.UserId && r.Reaction === data.Reaction),
                  );
                }

                return { ...c, Reactions: newReactions };
              }),
            );
          }
        }
      } catch (err) {
        console.error('Error parsing WS message:', err);
      }
    };

    socket.onclose = () => {
      setOnlineUsers([]);
      setTypingUsersMap({});
    };

    const currentTimeoutMap = typingTimeoutRefs.current;

    return () => {
      socket.close();
      socketRef.current = null;
      Object.values(currentTimeoutMap).forEach(clearTimeout);
    };
  }, [listId, userId, isAuthenticated, setComments, isOwner, isExpired]);

  const notifyTypingStart = () => {
    if (isDemo) {
      return;
    }

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.send(JSON.stringify({ Type: 'typing', IsTyping: true }));
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTypingRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ Type: 'typing', IsTyping: false }));
        isTypingRef.current = false;
      }
    }, COMMENT_TYPING_STOP_DELAY_MS);
  };

  const notifyTypingStop = () => {
    if (isDemo) {
      return;
    }

    if (isTypingRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ Type: 'typing', IsTyping: false }));
      isTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return {
    onlineUsers,
    typingUsers: Object.values(typingUsersMap),
    notifyTypingStart,
    notifyTypingStop,
  };
}
