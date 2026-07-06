import React from 'react';
import { Eye, EyeOff, Trash2, Tag, CornerUpLeft } from 'lucide-react';
import { CommentItemTemplateProps } from '../../interfaces/comment-item-template-props.interface';
import { UserPreviewCard } from 'shared/ui/user-preview-card';
import { formatCommentDateBadge } from 'shared/utils/format-date.util';
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

  const hasReactions = Object.keys(reactionsMap).length > 0;
  const canReply = !comment.ParentId && !!handleReplySubmit;
  const { date: datePart, time: timePart } = formatCommentDateBadge(comment.CreatedAt);

  const hasThread = !isThreadChild && (replies.length > 0 || isReplying);
  const showReplyThread = !isThreadChild && (isReplying || (isExpanded && replies.length > 0));

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
          <div className={styles['comment-visibility-indicator']}>
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

            {comment.UserId === currentUserId && (
              <button
                type="button"
                onClick={() => setDeletingCommentId(isDeleting ? null : comment.Id)}
                className={styles['comment-delete-btn-left']}
                title="Delete comment"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          <div className={styles['comment-bubble-content']}>
          <div className={styles['comment-main-content']}>
            <div className={styles['comment-meta']}>
              <div className={styles['comment-meta-left']}>
                {isAnonymousComment ? (
                  <span className={`${styles.author} ${styles['anonymous-author']}`}>Anonymous</span>
                ) : (
                  <UserPreviewCard
                    userId={comment.UserId}
                    displayName={comment.CommenterName}
                    isOnline={isOnline}
                  >
                    <span className={styles.author}>{comment.CommenterName}</span>
                  </UserPreviewCard>
                )}

                {isListOwnerComment && (
                  <span className={styles['owner-badge']} title="Wishlist owner">
                    Owner
                  </span>
                )}

                {comment.IsRollover && (
                  <span className={styles['rollover-badge']} title="Carry-over discussion">
                    Rollover
                  </span>
                )}

                <div className={styles['date-badge']} title={formatDate(comment.CreatedAt)}>
                  <span className={styles['date-part']}>{datePart}</span>
                  <span className={styles['time-part']}>{timePart}</span>
                </div>
              </div>
            </div>

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

            {(canReply || reactionPicker || (replies.length > 0 && !isThreadChild)) && (
              <div className={styles['comment-actions-row']}>
                {replies.length > 0 && !isThreadChild && (
                  <div className={styles['replies-toggle-inline']}>
                    <button
                      type="button"
                      className={styles['replies-toggle-btn']}
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      {isExpanded
                        ? 'Hide replies'
                        : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
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
          </div>

          {isDeleting && (
            <div className={styles['comment-bubble-bottom-row']}>
              <span className={styles['delete-confirm-text']}>Are you sure you want to delete this?</span>
              <div className={styles['delete-confirm-actions']}>
                <button
                  type="button"
                  className={styles['delete-confirm-btn']}
                  onClick={() => handleDeleteComment(comment.Id)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className={styles['delete-cancel-btn']}
                  onClick={() => setDeletingCommentId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {hasReactions && (
            <div className={styles['reactions-footer']}>
              <div className={styles['reactions-list']}>
                {Object.entries(reactionsMap).map(([reaction, data]) => (
                  <button
                    key={reaction}
                    type="button"
                    onClick={() => toggleReaction?.(comment.Id, reaction)}
                    className={`${styles['reaction-badge']} ${data.hasReacted ? styles['reaction-badge-active'] : ''}`}
                    title={data.users.join(', ')}
                  >
                    <span className={styles['reaction-emoji']}>{reaction}</span>
                    <span className={styles['reaction-count']}>{data.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>

        {taggedIds.length > 0 && (
          <div className={styles['comment-tags-container']}>
            {taggedIds.map((itemId) => {
              const matchedItem = items.find((i) => i.Id === itemId);
              const itemName = matchedItem ? matchedItem.Name : 'View item';
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => onItemTaggedClick?.(itemId)}
                  className={styles['comment-tag-icon-btn']}
                  title={itemName}
                >
                  <Tag size={12} />
                </button>
              );
            })}
          </div>
        )}
      </div>

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
