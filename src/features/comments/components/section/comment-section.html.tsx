import React from 'react';
import { MessageSquare, AlertCircle, X } from 'lucide-react';
import { CommentSectionTemplateProps } from '../../interfaces/comment-section-template-props.interface';
import { getCategoryMeta } from 'features/items/components/card/category-icons';
import { CommentItem } from '../item/comment-item.component';
import { CommentInput } from '../input/comment-input.component';
import styles from './comment-section.module.css';

export const CommentSectionTemplate: React.FC<CommentSectionTemplateProps> = ({
  isOwner,
  currentUserId,
  comments,
  isLoading,
  displayError,
  content,
  setContent,
  commenterName,
  setCommenterName,
  isOwnerVisible,
  setIsOwnerVisible,
  isRollover,
  setIsRollover,
  isSubmitLoading,
  handleSubmit,
  formatDate,
  items,
  onlineUsers,
  typingUsers,
  onItemTaggedClick,
  isTaggingModeActive,
  setIsTaggingModeActive,
  taggedItemIds,
  setTaggedItemIds,
  handleDeleteComment,
  deletingCommentId,
  setDeletingCommentId,
}) => {
  return (
    <div className={styles.section}>


      {onlineUsers.length > 0 && (
        <div className={styles.onlinePresenceBar}>
          <span className={styles.onlineDot} />
          <span>Online: </span>
          <span className={styles.onlineUsersList}>{onlineUsers.join(', ')}</span>
        </div>
      )}

      {displayError && (
        <div className={styles.alert}>
          <AlertCircle size={16} />
          <span>{displayError}</span>
        </div>
      )}

      {/* Comment history list */}
      <div className={styles.listContainer}>
        {isLoading ? (
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner} />
          </div>
        ) : comments.length > 0 ? (
          <div className={styles.commentsList}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.Id}
                comment={comment}
                currentUserId={currentUserId}
                items={items}
                formatDate={formatDate}
                onItemTaggedClick={onItemTaggedClick}
                handleDeleteComment={handleDeleteComment}
                deletingCommentId={deletingCommentId}
                setDeletingCommentId={setDeletingCommentId}
              />
            ))}
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <p className={styles.emptyText}>No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Bottom Chat Message section */}
      <div className={styles.bottomSeamlessContainer}>
        <CommentInput
          isOwner={isOwner}
          isOwnerVisible={isOwnerVisible}
          setIsOwnerVisible={setIsOwnerVisible}
          isRollover={isRollover}
          setIsRollover={setIsRollover}
          content={content}
          setContent={setContent}
          commenterName={commenterName}
          setCommenterName={setCommenterName}
          isSubmitLoading={isSubmitLoading}
          handleSubmit={handleSubmit}
          items={items}
          isTaggingModeActive={isTaggingModeActive}
          setIsTaggingModeActive={setIsTaggingModeActive}
          typingUsers={typingUsers}
        />
      </div>
    </div>
  );
};
