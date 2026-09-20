import React from 'react';
import { Eye, EyeOff, Trash2, CornerUpLeft, Users } from 'lucide-react';
import { TemplateProps } from './interfaces/template-props.interface';
import { UserPreviewCard } from 'features/auth';
import { Meta } from './components/meta';
import { Reactions } from './components/reactions';
import { DeleteConfirm } from './components/delete-confirm';
import { Tags } from './components/tags';
import styles from './item.module.css';

export const ItemTemplate: React.FC<TemplateProps> = ({
  comment,
  contentSegments,
  taggedIds,
  isDeleting,
  items,
  formatDate,
  onItemTaggedClick,
  handleDeleteComment,
  setDeletingCommentId,
  mentionOnlineByUserId,
  repliesCount,
  toggleReaction,
  isAnonymousComment,
  isSystemComment,
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
  isOwner,
  visibilityMode,
  visibilityTitle,
  isDeleted,
  isOwnComment,
  canReply,
  hasLeftIcons,
  showLeftRail,
  showReplyThread,
  showActionsRow,
  showRepliesToggle,
  wrapperClassName,
  bubbleClassName,
  contentClassName,
}) => {
  if (isDeleted) {
    return (
      <div className={`${styles['comment-bubble']} ${styles['deleted-comment-bubble']}`}>
        <span className={styles['deleted-comment-text']}>
          Comment was deleted (by {comment.CommenterName})
        </span>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <div className={bubbleClassName}>
        <div className={styles['comment-bubble-main']}>
          {showLeftRail && (
            <div
              className={styles['comment-visibility-indicator']}
              aria-hidden={!hasLeftIcons}
            >
              {!isOwner && (
                <div title={visibilityTitle} className={styles['visibility-icon-wrap']}>
                  {visibilityMode === 'hiddenFromOwner' ? (
                    <EyeOff size={14} className={styles['hidden-eye']} />
                  ) : visibilityMode === 'visibleToSelected' ? (
                    <Users size={14} className={styles['visible-eye']} />
                  ) : (
                    <Eye size={14} className={styles['visible-eye']} />
                  )}
                </div>
              )}

              {isOwnComment && (
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

          <div className={contentClassName}>
            <div className={styles['comment-main-content']}>
              <Meta
                comment={comment}
                isAnonymousComment={isAnonymousComment}
                isSystemComment={isSystemComment}
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
                    return (
                      <UserPreviewCard
                        key={`mention-${segment.userId}-${index}`}
                        userId={segment.userId}
                        displayName={segment.username}
                        isOnline={!!mentionOnlineByUserId[segment.userId]}
                      >
                        <span className={styles.mention}>@{segment.username}</span>
                      </UserPreviewCard>
                    );
                  }

                  return null;
                })}
              </div>
            </div>

            {showActionsRow && (
              <div className={styles['comment-actions-row']}>
                {showRepliesToggle && (
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
                          {repliesCount > 1 && (
                            <span className={styles['replies-badge']}>{repliesCount}</span>
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
