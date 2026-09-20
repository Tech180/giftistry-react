import React, { useEffect, useRef, useState } from 'react';
import type { Props } from './interfaces/props.interface';
import { ItemTemplate } from './item.html';
import { ReplyInput } from './components/reply-input';
import { ReactionPicker } from './components/reaction-picker';
import { parseCommentContent, stripItemTagsFromSegments } from '../../utils/comment-content.util';
import { parseCommentVisibilityMode } from '../../utils/parse-comment-visibility-mode.util';
import { CommentReactionGroup } from '../../interfaces/comment-reaction-group.interface';
import { ANONYMOUS_COMMENTER_NAME, SYSTEM_COMMENTER_NAME } from '../../constants/comment-settings.constant';
import { useCommentsSession } from '../../providers/session';
import styles from './item.module.css';

export const Item: React.FC<Props> = ({
  comment,
  listOwnerId,
  currentUserId,
  items,
  formatDate,
  onItemTaggedClick,
  handleDeleteComment,
  deletingCommentId,
  setDeletingCommentId,
  onlineUsers = [],
  participants = [],
  replies = [],
  toggleReaction,
  handleReplySubmit,
  activeReplyId = null,
  onReplyOpen,
  isReplyTaggingModeActive = false,
  setIsReplyTaggingModeActive,
  replyTaggedItemIds = [],
  setReplyTaggedItemIds,
  isThreadChild = false,
  isOwner = false,
}) => {
  const { user } = useCommentsSession();
  const { segments, itemIds } = parseCommentContent(comment.Content);
  const displaySegments = stripItemTagsFromSegments(segments);
  const isDeleting = deletingCommentId === comment.Id;
  const replySlotRef = useRef<HTMLDivElement>(null);

  const isReplying = activeReplyId === comment.Id;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isReplying && replySlotRef.current) {
      replySlotRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isReplying]);

  const commenterName = comment.CommenterName.trim();
  const isAnonymousComment =
    commenterName.toLowerCase() === ANONYMOUS_COMMENTER_NAME.toLowerCase();
  const isSystemComment = commenterName.toLowerCase() === SYSTEM_COMMENTER_NAME.toLowerCase();
  const isOnline =
    !isAnonymousComment && !isSystemComment && comment.UserId
      ? onlineUsers.some((onlineUser) => onlineUser.userId === comment.UserId)
      : false;
  const isListOwnerComment =
    !isAnonymousComment &&
    !isSystemComment &&
    !!(listOwnerId && comment.UserId && comment.UserId === listOwnerId);

  const authorParticipant = comment.UserId
    ? participants.find((p) => p.userId === comment.UserId)
    : undefined;

  let authorUsername: string | null = null;
  if (!isAnonymousComment && !isSystemComment && comment.UserId) {
    authorUsername = authorParticipant?.username ?? comment.CommenterName;
  }

  let authorAvatar: string | null = null;
  if (comment.UserId && !isAnonymousComment && !isSystemComment) {
    if (authorParticipant?.avatar) {
      authorAvatar = authorParticipant.avatar;
    } else if (comment.UserId === user?.Id) {
      authorAvatar = user.Avatar ?? null;
    }
  }

  const reactionsMap: Record<string, CommentReactionGroup> = {};
  for (const rx of comment.Reactions || []) {
    if (!reactionsMap[rx.Reaction]) {
      reactionsMap[rx.Reaction] = { count: 0, users: [], hasReacted: false };
    }
    reactionsMap[rx.Reaction].count++;
    reactionsMap[rx.Reaction].users.push(rx.Username);
    if (currentUserId && rx.UserId === currentUserId) {
      reactionsMap[rx.Reaction].hasReacted = true;
    }
  }

  const handleReplyToggle = () => {
    const nextReplying = !isReplying;
    onReplyOpen?.(nextReplying ? comment.Id : null);
    if (nextReplying && replies.length > 0) {
      setIsExpanded(true);
    }
  };

  const handleReplyCancel = () => {
    setIsReplyTaggingModeActive?.(false);
    setReplyTaggedItemIds?.([]);
    onReplyOpen?.(null);
  };

  const replyInput = isReplying && handleReplySubmit ? (
    <ReplyInput
      replyToName={comment.CommenterName}
      participants={participants}
      items={items}
      currentUserId={currentUserId}
      isOwner={isOwner}
      listOwnerId={listOwnerId}
      isTaggingModeActive={isReplyTaggingModeActive}
      setIsTaggingModeActive={(active) => setIsReplyTaggingModeActive?.(active)}
      taggedItemIds={replyTaggedItemIds}
      onSubmit={async (content, imageUrl, visibility) => {
        await handleReplySubmit(comment.Id, content, undefined, visibility, undefined, imageUrl);
        setReplyTaggedItemIds?.([]);
        onReplyOpen?.(null);
        setIsExpanded(true);
      }}
      onCancel={handleReplyCancel}
    />
  ) : null;

  const reactionPicker = toggleReaction ? (
    <ReactionPicker onSelect={(emoji) => toggleReaction(comment.Id, emoji)} />
  ) : null;

  const sortedReplies = [...replies].sort(
    (a, b) => new Date(a.CreatedAt ?? 0).getTime() - new Date(b.CreatedAt ?? 0).getTime()
  );

  const nestedReplies =
    isExpanded && sortedReplies.length > 0
      ? sortedReplies.map((reply) => (
          <div key={reply.Id} className={styles['thread-branch']}>
            <Item
              comment={reply}
              listOwnerId={listOwnerId}
              currentUserId={currentUserId}
              items={items}
              formatDate={formatDate}
              onItemTaggedClick={onItemTaggedClick}
              handleDeleteComment={handleDeleteComment}
              deletingCommentId={deletingCommentId}
              setDeletingCommentId={setDeletingCommentId}
              onlineUsers={onlineUsers}
              participants={participants}
              toggleReaction={toggleReaction}
              isThreadChild
              isOwner={isOwner}
            />
          </div>
        ))
      : null;

  const visibilityMode = parseCommentVisibilityMode(comment);
  let visibilityTitle = 'Visible to Owner';
  if (visibilityMode === 'hiddenFromOwner') {
    visibilityTitle = 'Hidden from Owner';
  } else if (visibilityMode === 'visibleToSelected') {
    visibilityTitle = 'Selected audience';
  }

  const isDeleted = !!comment.IsDeleted;
  const isOwnComment = comment.UserId === currentUserId;
  const canReply = !comment.ParentId && !!handleReplySubmit;
  const hasLeftIcons = !isOwner || isOwnComment;
  const hasThread = !isThreadChild && (replies.length > 0 || isReplying);
  const showReplyThread = !isThreadChild && (isReplying || (isExpanded && replies.length > 0));
  const showLeftRail = hasLeftIcons || hasThread;
  const showRepliesToggle = replies.length > 0 && !isThreadChild;
  const showActionsRow = canReply || !!reactionPicker || showRepliesToggle;

  const mentionOnlineByUserId: Record<string, boolean> = {};
  for (const segment of displaySegments) {
    if (segment.type === 'mention') {
      mentionOnlineByUserId[segment.userId] = onlineUsers.some(
        (onlineUser) => onlineUser.userId === segment.userId,
      );
    }
  }

  const wrapperClassName = [
    styles['comment-wrapper'],
    isThreadChild ? styles['thread-child'] : '',
    hasThread ? styles['has-thread'] : '',
    hasThread && isExpanded ? styles['thread-expanded'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const bubbleClassName = [
    styles['comment-bubble'],
    isOwnComment ? styles['own-comment'] : '',
    isReplying ? styles['is-replying'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const contentClassName = [
    styles['comment-bubble-content'],
    showLeftRail ? '' : styles['without-left-rail'],
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ItemTemplate
      comment = {
        comment
      }
      contentSegments = {
        displaySegments
      }
      taggedIds = {
        itemIds
      }
      isDeleting = {
        isDeleting
      }
      items = {
        items
      }
      formatDate = {
        formatDate
      }
      onItemTaggedClick = {
        onItemTaggedClick
      }
      handleDeleteComment = {
        handleDeleteComment
      }
      setDeletingCommentId = {
        setDeletingCommentId
      }
      mentionOnlineByUserId = {
        mentionOnlineByUserId
      }
      repliesCount = {
        replies.length
      }
      toggleReaction = {
        toggleReaction
      }
      isAnonymousComment = {
        isAnonymousComment
      }
      isSystemComment = {
        isSystemComment
      }
      isOnline = {
        isOnline
      }
      isListOwnerComment = {
        isListOwnerComment
      }
      authorUsername = {
        authorUsername
      }
      authorAvatar = {
        authorAvatar
      }
      authorParticipant = {
        authorParticipant
      }
      reactionsMap = {
        reactionsMap
      }
      isReplying = {
        isReplying
      }
      onReplyToggle = {
        handleReplyToggle
      }
      replyInput = {
        replyInput
      }
      replySlotRef = {
        replySlotRef
      }
      isExpanded = {
        isExpanded
      }
      setIsExpanded = {
        setIsExpanded
      }
      reactionPicker = {
        reactionPicker
      }
      nestedReplies = {
        nestedReplies
      }
      isOwner = {
        isOwner
      }
      visibilityMode = {
        visibilityMode
      }
      visibilityTitle = {
        visibilityTitle
      }
      isDeleted = {
        isDeleted
      }
      isOwnComment = {
        isOwnComment
      }
      canReply = {
        canReply
      }
      hasLeftIcons = {
        hasLeftIcons
      }
      showLeftRail = {
        showLeftRail
      }
      showReplyThread = {
        showReplyThread
      }
      showActionsRow = {
        showActionsRow
      }
      showRepliesToggle = {
        showRepliesToggle
      }
      wrapperClassName = {
        wrapperClassName
      }
      bubbleClassName = {
        bubbleClassName
      }
      contentClassName = {
        contentClassName
      }
    />
  );
};
