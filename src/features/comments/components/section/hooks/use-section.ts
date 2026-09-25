import { useEffect, useRef, useState } from 'react';
import { isDemoListId, useTourDemoOptional } from 'features/tour';
import { useCommentController } from '../../../hooks/use-comment-controller';
import { useCommentsSession } from '../../../providers/session';
import { formatCommentDate } from 'shared/utils/format-date.util';
import { buildVisibleCommentTree } from '../../../utils/build-visible-comment-tree.util';
import type { Comment } from '../../../interfaces/comment.interface';
import type { Props } from '../interfaces/props.interface';
import type { UseSectionResult } from '../interfaces/use-section-result.interface';
import { useParticipants } from './use-participants';
import { useCommentRealtime } from './use-comment-realtime';
import { useComposer } from './use-composer';

function mapDemoComments(
  listId: string,
  demoComments: {
    Id: string;
    ListId: string;
    UserId: string;
    Username: string;
    Body: string;
    CreatedAt: string;
    ParentId?: string | null;
  }[]
): Comment[] {
  return demoComments.map((comment) => ({
    Id: comment.Id,
    ListId: comment.ListId || listId,
    UserId: comment.UserId,
    CommenterName: comment.Username,
    Content: comment.Body,
    IsOwnerVisible: true,
    IsRollover: false,
    ParentId: comment.ParentId ?? null,
    CreatedAt: comment.CreatedAt,
  }));
}

export function useSection({
  listId,
  listOwnerId,
  ownerUsername,
  ownerDisplayName,
  isOwner,
  isExpired = false,
  isArchived = false,
  autoRollover = false,
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
  showDeletedComments = false,
}: Props): UseSectionResult {
  const { user, isAuthenticated } = useCommentsSession();
  const demo = useTourDemoOptional();
  const isDemo = isDemoListId(listId);

  const {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    toggleReaction,
    deleteComment,
    setComments,
  } = useCommentController();

  const { participants } = useParticipants({
    listId,
    listOwnerId,
    ownerUsername,
    ownerDisplayName,
    isAuthenticated,
    currentUserId: user?.Id,
    currentUserAvatar: user?.Avatar,
    comments,
  });

  const realtime = useCommentRealtime({
    listId,
    isAuthenticated,
    userId: user?.Id,
    isOwner,
    isExpired,
    setComments,
  });

  const listContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const composer = useComposer({
    listId,
    isOwner,
    isArchived,
    isAuthenticated,
    autoRollover,
    userId: user?.Id,
    userUsername: user?.Username,
    participants,
    items,
    taggedItemIds,
    setTaggedItemIds,
    setIsTaggingModeActive,
    addComment,
    deleteComment,
    toggleReaction,
    notifyTypingStart: realtime.notifyTypingStart,
    notifyTypingStop: realtime.notifyTypingStop,
    onPosted: () => {
      shouldScrollToBottomRef.current = true;
    },
    controllerError: error,
  });

  const { parentComments, repliesMap } = buildVisibleCommentTree(comments, showDeletedComments);

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

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) {
      return;
    }

    shouldScrollToBottomRef.current = false;

    const container = listContainerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    });
  }, [comments]);

  useEffect(() => {
    if (isDemo) {
      return;
    }

    fetchComments(listId);
  }, [listId, isDemo]);

  useEffect(() => {
    if (!isDemo) {
      return;
    }

    if (!demo?.active) {
      setComments([]);
      return;
    }

    setComments(mapDemoComments(listId, demo.comments ?? []));
  }, [isDemo, demo?.active, demo?.comments, listId, setComments]);

  return {
    isOwner,
    listOwnerId,
    isAuthenticated,
    canPostComments: isAuthenticated && !isArchived,
    currentUserId: user?.Id,
    participants,
    comments,
    parentComments,
    repliesMap,
    handleReplySubmit: composer.handleReplySubmit,
    toggleReaction: composer.handleToggleReaction,
    isLoading: isDemo ? false : isLoading,
    displayError: composer.displayError,
    content: composer.content,
    setContent: composer.setContent,
    commenterName: composer.commenterName,
    setCommenterName: composer.setCommenterName,
    commentVisibility: composer.commentVisibility,
    setCommentVisibility: composer.setCommentVisibility,
    isRollover: composer.isRollover,
    setIsRollover: composer.setIsRollover,
    autoRollover,
    isSubmitLoading: composer.isSubmitLoading,
    handleSubmit: composer.handleSubmit,
    formatDate: formatCommentDate,
    items,
    onlineUsers: realtime.onlineUsers,
    typingUsers: isDemo ? (demo?.typingUsers ?? []) : realtime.typingUsers,
    onItemTaggedClick,
    handleSelectTagItem: composer.handleSelectTagItem,
    isTaggingModeActive,
    setIsTaggingModeActive: handleSetMainTaggingActive,
    taggedItemIds,
    setTaggedItemIds,
    handleDeleteComment: composer.handleDeleteComment,
    deletingCommentId: composer.deletingCommentId,
    setDeletingCommentId: composer.setDeletingCommentId,
    isAnonymous: composer.isAnonymous,
    setIsAnonymous: composer.setIsAnonymous,
    imageUrl: composer.imageUrl,
    setImageUrl: composer.setImageUrl,
    activeReplyId,
    onReplyOpen: handleReplyOpen,
    isReplyTaggingModeActive,
    setIsReplyTaggingModeActive: handleSetReplyTaggingActive,
    replyTaggedItemIds,
    setReplyTaggedItemIds,
    listContainerRef,
    onMentionSelect: composer.handleMentionSelect,
    highlightedCommentId: isDemo ? (demo?.highlightedCommentId ?? null) : null,
  };
}
