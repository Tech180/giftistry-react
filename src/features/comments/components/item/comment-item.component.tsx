import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CommentItemProps } from '../../interfaces/comment-item-props.interface';
import { CommentItemTemplate } from './comment-item.html';
import { ReplyInput } from './components/reply-input';
import { ReactionPicker } from './components/reaction-picker';
import { parseCommentContent, stripItemTagsFromSegments } from '../../utils/comment-content.util';
import { CommentReactionGroup } from '../../interfaces/comment-reaction-group.interface';
import { ANONYMOUS_COMMENTER_NAME } from '../../constants/comment-settings';
import { useAuth } from 'app/providers/auth-context';
import styles from './comment-item.module.css';

export const CommentItem: React.FC<CommentItemProps> = ({
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
  isOwnerVisible = true,
}) => {
  const { user } = useAuth();
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

  const isAnonymousComment = comment.CommenterName.trim().toLowerCase() === ANONYMOUS_COMMENTER_NAME.toLowerCase();
  const isOnline = !isAnonymousComment && comment.UserId
    ? onlineUsers.some((onlineUser) => onlineUser.userId === comment.UserId)
    : false;
  const isListOwnerComment = !isAnonymousComment && !!(listOwnerId && comment.UserId && comment.UserId === listOwnerId);

  const authorParticipant = useMemo(
    () => (comment.UserId ? participants.find((p) => p.userId === comment.UserId) : undefined),
    [participants, comment.UserId]
  );

  const authorUsername = useMemo(() => {
    if (isAnonymousComment || !comment.UserId) return null;
    return authorParticipant?.username ?? comment.CommenterName;
  }, [authorParticipant, comment.UserId, comment.CommenterName, isAnonymousComment]);

  const authorAvatar = useMemo(() => {
    if (!comment.UserId || isAnonymousComment) return null;
    if (authorParticipant?.avatar) return authorParticipant.avatar;
    if (comment.UserId === user?.Id) return user.Avatar ?? null;
    return null;
  }, [authorParticipant, comment.UserId, isAnonymousComment, user?.Id, user?.Avatar]);

  const reactionsMap = useMemo(() => {
    const map: Record<string, CommentReactionGroup> = {};
    for (const rx of comment.Reactions || []) {
      if (!map[rx.Reaction]) {
        map[rx.Reaction] = { count: 0, users: [], hasReacted: false };
      }
      map[rx.Reaction].count++;
      map[rx.Reaction].users.push(rx.Username);
      if (currentUserId && rx.UserId === currentUserId) {
        map[rx.Reaction].hasReacted = true;
      }
    }
    return map;
  }, [comment.Reactions, currentUserId]);

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
      isOwnerVisible={isOwnerVisible}
      listOwnerId={listOwnerId}
      isTaggingModeActive={isReplyTaggingModeActive}
      setIsTaggingModeActive={(active) => setIsReplyTaggingModeActive?.(active)}
      taggedItemIds={replyTaggedItemIds}
      onSubmit={async (content, imageUrl) => {
        await handleReplySubmit(comment.Id, content, undefined, undefined, undefined, imageUrl);
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

  const sortedReplies = useMemo(
    () =>
      [...replies].sort(
        (a, b) => new Date(a.CreatedAt ?? 0).getTime() - new Date(b.CreatedAt ?? 0).getTime()
      ),
    [replies]
  );

  const nestedReplies =
    isExpanded && sortedReplies.length > 0
      ? sortedReplies.map((reply) => (
          <div key={reply.Id} className={styles['thread-branch']}>
            <CommentItem
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
              isOwnerVisible={isOwnerVisible}
            />
          </div>
        ))
      : null;

  return (
    <CommentItemTemplate
      comment={comment}
      contentSegments={displaySegments}
      taggedIds={itemIds}
      isDeleting={isDeleting}
      currentUserId={currentUserId}
      items={items}
      formatDate={formatDate}
      onItemTaggedClick={onItemTaggedClick}
      handleDeleteComment={handleDeleteComment}
      setDeletingCommentId={setDeletingCommentId}
      onlineUsers={onlineUsers}
      replies={replies}
      toggleReaction={toggleReaction}
      handleReplySubmit={handleReplySubmit}
      isAnonymousComment={isAnonymousComment}
      isOnline={isOnline}
      isListOwnerComment={isListOwnerComment}
      authorUsername={authorUsername}
      authorAvatar={authorAvatar}
      authorParticipant={authorParticipant}
      reactionsMap={reactionsMap}
      isReplying={isReplying}
      onReplyToggle={handleReplyToggle}
      replyInput={replyInput}
      replySlotRef={replySlotRef}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      reactionPicker={reactionPicker}
      nestedReplies={nestedReplies}
      isThreadChild={isThreadChild}
      isOwner={isOwner}
    />
  );
};
