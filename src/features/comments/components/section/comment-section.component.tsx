import React, { useState, useEffect, useRef } from 'react';
import { useCommentController } from '../../hooks/use-comment-controller';
import { useAuth } from 'app/providers/auth-context';
import { wishlistsApi } from 'features/wishlists';
import { authApi } from 'features/auth';
import { CommentSectionProps } from '../../interfaces/comment-section-props.interface';
import { CommentSectionTemplate } from './comment-section.html';
import { formatCommentDate } from 'shared/utils/format-date.util';
import { OnlineUser } from '../../interfaces/online-user.interface';
import { ListParticipant } from '../../interfaces/list-participant.interface';
import { convertMentionsToMarkdown } from '../../utils/comment-content.util';
import { getCommentWsUrl } from '../../utils/comment-ws.util';
import {
  COMMENT_ANON_STORAGE_KEY,
  ANONYMOUS_COMMENTER_NAME,
} from '../../constants/comment-settings';
import {
  COMMENT_TYPING_STOP_DELAY_MS,
  COMMENT_TYPING_USER_TTL_MS,
} from '../../constants/comment-presence';

export const CommentSection: React.FC<CommentSectionProps> = ({
  listId,
  listOwnerId,
  ownerUsername,
  ownerDisplayName,
  isOwner,
  isExpired = false,
  isArchived = false,
  items = [],
  onItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  isReplyTaggingModeActive,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds,
  setReplyTaggedItemIds,
}) => {
  const { user, isAuthenticated } = useAuth();

  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    toggleReaction: toggleReactionHook,
    deleteComment,
    setComments,
  } = useCommentController();

  const [content, setContent] = useState('');
  const [commenterName, setCommenterName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(() => {
    return localStorage.getItem(COMMENT_ANON_STORAGE_KEY) === 'true';
  });
  const [isOwnerVisible, setIsOwnerVisible] = useState(false); // Surprise is default!
  const [isRollover, setIsRollover] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<ListParticipant[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleSetMainTaggingActive = (active: boolean) => {
    setIsTaggingModeActive(active);
    if (active) {
      setIsReplyTaggingModeActive(false);
      setReplyTaggedItemIds([]);
    }
  };

  const handleSetReplyTaggingActive = (active: boolean) => {
    setIsReplyTaggingModeActive(active);
    if (active) {
      setIsTaggingModeActive(false);
      setTaggedItemIds([]);
    }
  };

  const handleReplyOpen = (commentId: string | null) => {
    setActiveReplyId(commentId);
    if (!commentId) {
      setIsReplyTaggingModeActive(false);
      setReplyTaggedItemIds([]);
    }
  };

  useEffect(() => {
    if (!activeReplyId) {
      setIsReplyTaggingModeActive(false);
      setReplyTaggedItemIds([]);
    }
  }, [activeReplyId, setIsReplyTaggingModeActive, setReplyTaggedItemIds]);

  // Real-time states
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsersMap, setTypingUsersMap] = useState<Record<string, string>>({});
  const typingTimeoutRefs = useRef<Record<string, any>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const fetchedAvatarsRef = useRef<Set<string>>(new Set());
  const participantsRef = useRef<ListParticipant[]>([]);
  const typingTimeoutRef = useRef<any>(null);
  const isTypingRef = useRef(false);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);

  participantsRef.current = participants;

  // Compute comment tree structure
  const parentComments = React.useMemo(() => {
    return comments.filter((c) => !c.ParentId);
  }, [comments]);

  const repliesMap = React.useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const c of comments) {
      if (c.ParentId) {
        if (!map[c.ParentId]) {
          map[c.ParentId] = [];
        }
        map[c.ParentId].push(c);
      }
    }
    for (const parentId of Object.keys(map)) {
      map[parentId].sort(
        (a, b) => new Date(a.CreatedAt ?? 0).getTime() - new Date(b.CreatedAt ?? 0).getTime()
      );
    }
    return map;
  }, [comments]);

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return;
    shouldScrollToBottomRef.current = false;

    const container = listContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }, [comments]);

  const handleReplySubmit = async (
    parentId: string,
    replyContent: string,
    replyCommenterName?: string | null,
    replyIsOwnerVisible?: boolean,
    replyIsRollover?: boolean,
    replyImageUrl?: string | null
  ) => {
    if (isArchived) return;
    setIsSubmitLoading(true);
    setLocalError(null);
    try {
      const resolvedCommenterName = replyCommenterName?.trim() || commenterName?.trim() || user?.Username;
      const formattedReplyContent = convertMentionsToMarkdown(replyContent, participants);
      await addComment(
        listId,
        formattedReplyContent,
        resolvedCommenterName || null,
        replyIsOwnerVisible !== undefined ? replyIsOwnerVisible : (isOwner ? true : isOwnerVisible),
        replyIsRollover !== undefined ? replyIsRollover : isRollover,
        parentId,
        replyImageUrl
      );
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post reply.');
      throw err;
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleToggleReaction = async (commentId: string, reaction: string) => {
    if (!isAuthenticated || !user) return;
    try {
      await toggleReactionHook(commentId, reaction, user.Id, user.Username);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to toggle reaction.');
    }
  };

  useEffect(() => {
    fetchComments(listId);
    fetchedAvatarsRef.current.clear();
  }, [listId, fetchComments]);

  useEffect(() => {
    if (!isAuthenticated) {
      setParticipants([]);
      return;
    }

    const loadParticipants = async () => {
      const participantMap = new Map<string, ListParticipant>();

      if (listOwnerId && ownerUsername) {
        participantMap.set(listOwnerId, {
          userId: listOwnerId,
          username: ownerUsername,
          displayName: ownerDisplayName || ownerUsername,
          avatar: listOwnerId === user?.Id ? user.Avatar ?? null : null,
        });
      }

      try {
        const shares = await wishlistsApi.listShares(listId);
        for (const share of shares || []) {
          if (!share.UserId || !share.Username) continue;
          participantMap.set(share.UserId, {
            userId: share.UserId,
            username: share.Username,
            displayName: share.FirstName
              ? `${share.FirstName} ${share.LastName || ''}`.trim()
              : share.Username,
            avatar: share.Avatar ?? null,
          });
        }
      } catch {
        // Fall back to owner-only list when share lookup fails.
      }

      setParticipants(Array.from(participantMap.values()));
    };

    loadParticipants();
  }, [listId, listOwnerId, ownerUsername, ownerDisplayName, isAuthenticated, user?.Id, user?.Avatar]);

  useEffect(() => {
    if (!isAuthenticated || comments.length === 0) return;

    const authorIds = [
      ...new Set(
        comments.map((c) => c.UserId).filter((id): id is string => !!id)
      ),
    ];

    const needsFetch = authorIds.filter((id) => {
      if (fetchedAvatarsRef.current.has(id)) return false;
      const existing = participantsRef.current.find((p) => p.userId === id);
      return !existing?.avatar;
    });

    if (needsFetch.length === 0) return;

    let cancelled = false;

    (async () => {
      const updates: ListParticipant[] = [];

      for (const userId of needsFetch) {
        fetchedAvatarsRef.current.add(userId);
        try {
          const res = await authApi.getUserPreview(userId);
          if (!res?.User) continue;
          const profile = res.User;
          updates.push({
            userId,
            username: profile.Username,
            displayName: profile.FirstName
              ? `${profile.FirstName} ${profile.LastName || ''}`.trim()
              : profile.Username,
            avatar: profile.Avatar ?? null,
          });
        } catch {
          // Preview unavailable — keep username fallback from comment data.
        }
      }

      if (!cancelled && updates.length > 0) {
        setParticipants((prev) => {
          const map = new Map(prev.map((p) => [p.userId, p]));
          for (const update of updates) {
            const existing = map.get(update.userId);
            map.set(
              update.userId,
              existing
                ? {
                    ...existing,
                    username: update.username || existing.username,
                    displayName: update.displayName || existing.displayName,
                    avatar: update.avatar ?? existing.avatar ?? null,
                  }
                : update
            );
          }
          return Array.from(map.values());
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [comments, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setCommenterName(isAnonymous ? ANONYMOUS_COMMENTER_NAME : user.Username);
    } else {
      setCommenterName('');
    }
  }, [user, isAnonymous]);

  const handleSetIsAnonymous = (anon: boolean) => {
    setIsAnonymous(anon);
    localStorage.setItem(COMMENT_ANON_STORAGE_KEY, anon ? 'true' : 'false');
  };

  // WebSocket Connection (authenticated users only)
  useEffect(() => {
    if (!isAuthenticated || !user) {
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
          const users: OnlineUser[] = Array.isArray(data.Users)
            ? data.Users.map((entry: { UserId?: string; Username?: string } | string) => {
                if (typeof entry === 'string') {
                  return { userId: entry, username: entry };
                }
                const userId = entry.UserId ?? '';
                const username = entry.Username ?? userId;
                return { userId, username };
              })
            : [];
          setOnlineUsers(users);
        } else if (data.Type === 'typing') {
          const typingUserId = data.UserId;
          const typingUsername = data.Username;
          const isTyping = !!data.IsTyping;
          if (typingUserId !== user?.Id) {
            if (isTyping) {
              setTypingUsersMap(prev => ({
                ...prev,
                [typingUserId]: typingUsername
              }));

              if (typingTimeoutRefs.current[typingUserId]) {
                clearTimeout(typingTimeoutRefs.current[typingUserId]);
              }

              typingTimeoutRefs.current[typingUserId] = setTimeout(() => {
                setTypingUsersMap(prev => {
                  const updated = { ...prev };
                  delete updated[typingUserId];
                  return updated;
                });
              }, COMMENT_TYPING_USER_TTL_MS);
            } else {
              setTypingUsersMap(prev => {
                const updated = { ...prev };
                delete updated[typingUserId];
                return updated;
              });
              if (typingTimeoutRefs.current[typingUserId]) {
                clearTimeout(typingTimeoutRefs.current[typingUserId]);
              }
            }
          }
        } else if (data.Type === 'comment.created') {
          if (data.Comment) {
            // Defense in depth: server should already omit surprise events for owners.
            if (isOwner && !isExpired && data.Comment.IsOwnerVisible === false) {
              return;
            }
            setComments(prev => {
              if (prev.some(c => c.Id === data.Comment.Id)) return prev;
              return [...prev, data.Comment];
            });
          }
        } else if (data.Type === 'comment.deleted') {
          if (data.CommentId) {
            setComments(prev =>
              prev.map(c =>
                c.Id === data.CommentId
                  ? { ...c, IsDeleted: true, Content: 'Comment was deleted.' }
                  : c
              )
            );
          }
        } else if (data.Type === 'reaction.toggled') {
          if (data.CommentId) {
            setComments(prev =>
              prev.map(c => {
                if (c.Id !== data.CommentId) return c;
                const existing = c.Reactions || [];
                let newReactions = [...existing];
                if (data.Added) {
                  if (!newReactions.some(r => r.UserId === data.UserId && r.Reaction === data.Reaction)) {
                    newReactions.push({
                      UserId: data.UserId,
                      Username: data.Username,
                      Reaction: data.Reaction
                    });
                  }
                } else {
                  newReactions = newReactions.filter(
                    r => !(r.UserId === data.UserId && r.Reaction === data.Reaction)
                  );
                }
                return { ...c, Reactions: newReactions };
              })
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
  }, [listId, user, isAuthenticated, setComments, isOwner, isExpired]);

  const handleContentChange = (val: string) => {
    setContent(val);

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

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

  const handleSelectTagItem = (itemId: string, itemName: string) => {
    handleContentChange(content ? `${content} [${itemName}](item:${itemId})` : `[${itemName}](item:${itemId})`);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user || isArchived) return;
    if (!content.trim()) return;

    setIsSubmitLoading(true);
    setLocalError(null);

    // Stop typing indicator on submit
    if (isTypingRef.current && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ Type: 'typing', IsTyping: false }));
      isTypingRef.current = false;
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    let finalContent = convertMentionsToMarkdown(content.trim(), participants);
    if (taggedItemIds.length > 0) {
      const tagLinks = taggedItemIds
        .map(id => {
          const matchedItem = items.find(i => i.Id === id);
          return matchedItem ? `[${matchedItem.Name}](item:${id})` : null;
        })
        .filter(Boolean)
        .join(' ');

      if (tagLinks) {
        finalContent += `\n\n${tagLinks}`;
      }
    }

    try {
      await addComment(
        listId,
        finalContent,
        commenterName.trim() || null,
        isOwner ? true : isOwnerVisible,
        isRollover,
        null,
        imageUrl
      );
      shouldScrollToBottomRef.current = true;
      setContent('');
      setImageUrl(null);
      setIsRollover(false);
      setTaggedItemIds([]);
      setIsTaggingModeActive(false);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to post comment.');
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const displayError = error || localError;
  const typingUsers = Object.values(typingUsersMap);

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(listId, commentId);
      setDeletingCommentId(null);
    } catch {
      // Error is set in the hook
    }
  };

  return (
    <CommentSectionTemplate
      isOwner={isOwner}
      listOwnerId={listOwnerId}
      isAuthenticated={isAuthenticated}
      canPostComments={isAuthenticated && !isArchived}
      currentUserId={user?.Id}
      participants={participants}
      comments={comments}
      parentComments={parentComments}
      repliesMap={repliesMap}
      handleReplySubmit={handleReplySubmit}
      toggleReaction={handleToggleReaction}
      isLoading={isLoading}
      displayError={displayError}
      content={content}
      setContent={handleContentChange}
      commenterName={commenterName}
      setCommenterName={setCommenterName}
      isOwnerVisible={isOwnerVisible}
      setIsOwnerVisible={setIsOwnerVisible}
      isRollover={isRollover}
      setIsRollover={setIsRollover}
      isSubmitLoading={isSubmitLoading}
      handleSubmit={handleSubmit}
      formatDate={formatCommentDate}
      items={items}
      onlineUsers={onlineUsers}
      typingUsers={typingUsers}
      onItemTaggedClick={onItemTaggedClick}
      handleSelectTagItem={handleSelectTagItem}
      isTaggingModeActive={isTaggingModeActive}
      setIsTaggingModeActive={handleSetMainTaggingActive}
      taggedItemIds={taggedItemIds}
      setTaggedItemIds={setTaggedItemIds}
      handleDeleteComment={handleDeleteComment}
      deletingCommentId={deletingCommentId}
      setDeletingCommentId={setDeletingCommentId}
      isAnonymous={isAnonymous}
      setIsAnonymous={handleSetIsAnonymous}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      activeReplyId={activeReplyId}
      onReplyOpen={handleReplyOpen}
      isReplyTaggingModeActive={isReplyTaggingModeActive}
      setIsReplyTaggingModeActive={handleSetReplyTaggingActive}
      replyTaggedItemIds={replyTaggedItemIds}
      setReplyTaggedItemIds={setReplyTaggedItemIds}
      listContainerRef={listContainerRef}
    />
  );
};
