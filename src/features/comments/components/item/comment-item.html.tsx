import React from 'react';
import { Eye, EyeOff, Trash2, Tag } from 'lucide-react';
import { Comment } from '../../interfaces/comment.interface';
import { Item } from '../../../items/interfaces/item.interface';
import styles from './comment-item.module.css';

interface CommentItemTemplateProps {
  comment: Comment;
  cleanText: string;
  taggedIds: string[];
  isDeleting: boolean;
  currentUserId: string | null | undefined;
  items: Item[];
  formatDate: (dateStr?: string) => string;
  onItemTaggedClick?: (itemId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  setDeletingCommentId: (commentId: string | null) => void;
}

export const CommentItemTemplate: React.FC<CommentItemTemplateProps> = ({
  comment,
  cleanText,
  taggedIds,
  isDeleting,
  currentUserId,
  items,
  formatDate,
  onItemTaggedClick,
  handleDeleteComment,
  setDeletingCommentId,
}) => {
  if (comment.IsDeleted) {
    return (
      <div className={`${styles.commentBubble} ${styles.deletedCommentBubble}`}>
        <span className={styles.deletedCommentText}>
          Comment was deleted (by {comment.CommenterName})
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.commentBubble} ${
        comment.UserId === currentUserId ? styles.ownComment : ''
      }`}
    >
      <div className={styles.commentBubbleTopRow}>
        <div className={styles.commentVisibilityIndicator}>
          <div
            title={comment.IsOwnerVisible ? 'Visible to Owner' : 'Hidden from Owner'}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {comment.IsOwnerVisible ? (
              <Eye size={14} className={styles.visibleEye} />
            ) : (
              <EyeOff size={14} className={styles.hiddenEye} />
            )}
          </div>

          {comment.UserId === currentUserId && (
            <button
              type="button"
              onClick={() => setDeletingCommentId(isDeleting ? null : comment.Id)}
              className={styles.commentDeleteBtnLeft}
              title="Delete comment"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        <div className={styles.commentMainContent}>
          <div className={styles.commentMeta}>
            <span className={styles.author}>{comment.CommenterName}</span>
            <span className={styles.date}>{formatDate(comment.CreatedAt)}</span>

            {comment.IsRollover && (
              <span className={styles.rolloverBadge} title="Carry-over discussion">
                Rollover
              </span>
            )}
          </div>
          <div className={styles.commentContent}>{cleanText}</div>
        </div>

        {/* Tagged Items Buttons (on the right side of the bubble) */}
        {taggedIds.length > 0 && (
          <div className={styles.commentTagsContainer}>
            {taggedIds.map((itemId) => {
              const matchedItem = items.find((i) => i.Id === itemId);
              const itemName = matchedItem ? matchedItem.Name : 'View item';
              return (
                <button
                  key={itemId}
                  type="button"
                  onClick={() => onItemTaggedClick?.(itemId)}
                  className={styles.commentTagIconBtn}
                  title={itemName}
                >
                  <Tag size={12} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {isDeleting && (
        <div className={styles.commentBubbleBottomRow}>
          <span className={styles.deleteConfirmText}>Are you sure you want to delete this?</span>
          <div className={styles.deleteConfirmActions}>
            <button
              type="button"
              className={styles.deleteConfirmBtn}
              onClick={() => handleDeleteComment(comment.Id)}
            >
              Delete
            </button>
            <button
              type="button"
              className={styles.deleteCancelBtn}
              onClick={() => setDeletingCommentId(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
