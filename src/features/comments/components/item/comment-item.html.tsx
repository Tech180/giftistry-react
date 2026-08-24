import React from 'react';
import { Eye, EyeOff, Trash2, CornerUpLeft } from 'lucide-react';
import { CommentItemTemplateProps } from '../../interfaces/comment-item-template-props.interface';
import { UserPreviewCard } from 'shared/ui/user-preview-card/user-preview-card.component';
import { Meta } from './components/meta';
import { Reactions } from './components/reactions';
import { DeleteConfirm } from './components/delete-confirm';
import { Tags } from './components/tags';
import styles from './comment-item.module.css';

export const CommentItemTemplate: React.FC<CommentItemTemplateProps> = ({
  comment,
  contentSegments,
  taggedIds,
  isDeleting,
  currentUserId,
  items,
  formatDate,
  onItemTaggedClick,
  handleDeleteComment,
  setDeletingCommentId,
  onlineUsers,
  replies,
  toggleReaction,
  handleReplySubmit,
  isAnonymousComment,
  isOnline,
  isListOwnerComment,
  authorUsername,
  authorAvatar,
  authorParticipant,
  reactionsMap,
  isReplying,
  onReplyToggle,
  replyInput,
  replySlotRef,
  isExpanded,
  setIsExpanded,
  reactionPicker,
  nestedReplies,
  isThreadChild = false,
  isOwner = false,
}) => {
  if (comment.IsDeleted) {
    return (
      <div className={`${styles['comment-bubble']} ${styles['deleted-comment-bubble']}`}>
        <span className={styles['deleted-comment-text']}>
          Comment was deleted (by {comment.CommenterName})
        </span>
      </div>
    );
  }

  const canReply = !comment.ParentId && !!handleReplySubmit;
  const hasLeftIcons = !isOwner || comment.UserId === currentUserId;
  const hasThread = !isThreadChild && (replies.length > 0 || isReplying);
  const showReplyThread = !isThreadChild && (isReplying || (isExpanded && replies.length > 0));
  const showLeftRail = hasLeftIcons || hasThread;

  return (
    <div
      className={`${styles['comment-wrapper']} ${isThreadChild ? styles['thread-child'] : ''} ${hasThread ? styles['has-thread'] : ''} ${hasThread && isExpanded ? styles['thread-expanded'] : ''}`}
    >
      <div
        className={`${styles['comment-bubble']} ${
          comment.UserId === currentUserId ? styles['own-comment'] : ''
        } ${isReplying ? styles['is-replying'] : ''}`}
      >
        <div className={styles['comment-bubble-main']}>
          {showLeftRail && (
            <div
              className={styles['comment-visibility-indicator']}
              aria-hidden={!hasLeftIcons}
            >
              {!isOwner && (
                <div
                  title={comment.IsOwnerVisible ? 'Visible to Owner' : 'Hidden from Owner'}
                  className={styles['visibility-icon-wrap']}
                >
                  {comment.IsOwnerVisible ? (
                    <Eye size={14} className={styles['visible-eye']} />
                  ) : (
                    <EyeOff size={14} className={styles['hidden-eye']} />
                  )}
                </div>
              )}

              {comment.UserId === currentUserId && (
                <button
                  type="button"
                  onClick={() => setDeletingCommentId(isDeleting ? null : comment.Id)}
                  className={styles['comment-delete-btn-left']}
                  title="Delete comment"
                  aria-label="Delete comment"
                >
                  <Trash2 size={12} className={styles['comment-delete-icon']} />
                </button>
              )}
            </div>
          )}

          <div
            className={`${styles['comment-bubble-content']} ${showLeftRail ? '' : styles['without-left-rail']}`}
          >
          <div className={styles['comment-main-content']}>
            <Meta
              comment={comment}
              isAnonymousComment={isAnonymousComment}
              authorUsername={authorUsername}
              authorAvatar={authorAvatar}
              authorParticipant={authorParticipant}
              isOnline={isOnline}
              isListOwnerComment={isListOwnerComment}
              formatDate={formatDate}
            />

            {comment.ImageUrl && (
              <div className={styles['comment-image-container']}>
                <img
                  src={comment.ImageUrl}
                  alt="Uploaded attachment"
                  className={styles['comment-image']}
                />
              </div>
            )}

            <div className={styles['comment-content']}>
              {contentSegments.map((segment, index) => {
                if (segment.type === 'text') {
                  return <span key={`text-${index}`}>{segment.value}</span>;
                }

                if (segment.type === 'mention') {
                  const isMentionOnline = onlineUsers.some(
                    (onlineUser) => onlineUser.userId === segment.userId
                  );
                  return (
                    <UserPreviewCard
                      key={`mention-${segment.userId}-${index}`}
                      userId={segment.userId}
                      displayName={segment.username}
                      isOnline={isMentionOnline}
                    >
                      <span className={styles.mention}>@{segment.username}</span>
                    </UserPreviewCard>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {(canReply || reactionPicker || (replies.length > 0 && !isThreadChild)) && (
            <div className={styles['comment-actions-row']}>
              {replies.length > 0 && !isThreadChild && (
                <div className={styles['replies-toggle-inline']}>
                  <button
                    type="button"
                    className={styles['replies-toggle-btn']}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? (
                      'Hide'
                    ) : (
                      <>
                        Show
                        {replies.length > 1 && (
                          <span className={styles['replies-badge']}>{replies.length}</span>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className={styles['action-buttons']}>
                {canReply && (
                  <button
                    type="button"
                    onClick={onReplyToggle}
                    className={`${styles['action-btn']} ${isReplying ? styles['action-btn-active'] : ''}`}
                    title="Reply to comment"
                  >
                    <CornerUpLeft size={15} />
                  </button>
                )}

                {reactionPicker}
              </div>
            </div>
          )}

          <Reactions
            commentId={comment.Id}
            reactionsMap={reactionsMap}
            toggleReaction={toggleReaction}
          />
          </div>
        </div>

        <Tags
          taggedIds={taggedIds}
          items={items}
          onItemTaggedClick={onItemTaggedClick}
        />
      </div>

      {isDeleting && (
        <DeleteConfirm
          onDelete={() => handleDeleteComment(comment.Id)}
          onCancel={() => setDeletingCommentId(null)}
        />
      )}

      {showReplyThread && (
        <div className={styles['comment-thread']}>
          {isExpanded && nestedReplies}

          {isReplying && replyInput && (
            <div ref={replySlotRef} className={`${styles['thread-branch']} ${styles['reply-slot']}`}>
              {replyInput}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
