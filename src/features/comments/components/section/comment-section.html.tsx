import React from 'react';
import { Send, EyeOff, MessageSquare, AlertCircle, Info } from 'lucide-react';
import { Button, Card, Input } from 'shared/ui';
import { CommentSectionTemplateProps } from '../../interfaces/comment-section-template-props.interface';
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
}) => {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <MessageSquare size={18} className={styles.headerIcon} />
        <h4 className={styles.title}>Comments & Discussions</h4>
      </div>

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
              <div
                key={comment.Id}
                className={`${styles.commentBubble} ${
                  comment.UserId === currentUserId ? styles.ownComment : ''
                }`}
              >
                <div className={styles.commentMeta}>
                  <span className={styles.author}>{comment.CommenterName}</span>
                  <span className={styles.date}>{formatDate(comment.CreatedAt)}</span>
                  
                  {!comment.IsOwnerVisible && (
                    <span className={styles.privateBadge} title="Hidden from the owner">
                      <EyeOff size={10} /> Private Surprise Chat
                    </span>
                  )}
                  {comment.IsRollover && (
                    <span className={styles.rolloverBadge} title="Carry-over discussion">
                      Rollover
                    </span>
                  )}
                </div>
                <div className={styles.commentContent}>{comment.Content}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>No comments yet. Start the conversation!</p>
        )}
      </div>

      {/* New comment input form */}
      <Card className={styles.inputCard} padding="md" glass={false}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <Input
              label="Posting As"
              type="text"
              value={commenterName}
              onChange={(e) => setCommenterName(e.target.value)}
              className={styles.nameInput}
            />
          </div>

          <div className={styles.textareaWrapper}>
            <textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className={styles.textarea}
              rows={2}
            />
          </div>

          <div className={styles.checkboxesRow}>
            {!isOwner && (
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={!isOwnerVisible}
                  onChange={(e) => setIsOwnerVisible(!e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>
                  Hide from Owner (Surprise Chat)
                </span>
              </label>
            )}
            
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isRollover}
                onChange={(e) => setIsRollover(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Rollover Comment
              </span>
            </label>
          </div>

          <div className={styles.submitRow}>
            {!isOwner && !isOwnerVisible && (
              <div className={styles.privateInfo}>
                <Info size={12} />
                <span>Only collaborators and viewers can read this comment.</span>
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitLoading}
              leftIcon={<Send size={14} />}
              className={styles.submitBtn}
            >
              Send
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
