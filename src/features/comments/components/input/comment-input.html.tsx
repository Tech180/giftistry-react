import React from 'react';
import { AlertCircle, Tag, Check, Send, Eye, EyeOff } from 'lucide-react';
import { Item } from '../../../items/interfaces/item.interface';
import styles from './comment-input.module.css';

interface CommentInputTemplateProps {
  isOwner: boolean;
  isOwnerVisible: boolean;
  setIsOwnerVisible: (visible: boolean) => void;
  isRollover: boolean;
  setIsRollover: (rollover: boolean) => void;
  content: string;
  setContent: (content: string) => void;
  commenterName: string;
  setCommenterName: (name: string) => void;
  isSubmitLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  items: Item[];
  isTaggingModeActive: boolean;
  setIsTaggingModeActive: (active: boolean) => void;
  typingUsers: string[];
}

export const CommentInputTemplate: React.FC<CommentInputTemplateProps> = ({
  isOwner,
  isOwnerVisible,
  setIsOwnerVisible,
  isRollover,
  setIsRollover,
  content,
  setContent,
  commenterName,
  setCommenterName,
  isSubmitLoading,
  handleSubmit,
  items,
  isTaggingModeActive,
  setIsTaggingModeActive,
  typingUsers,
}) => {
  return (
    <>
      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className={styles.chatTypingIndicator}>
          <div className={styles.typingBouncer}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
          <span>
            <strong>{typingUsers.join(', ')}</strong> {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}

      {/* Warning bar attached directly above box */}
      {isOwnerVisible && !isOwner && (
        <div className={styles.chatWarningBar}>
          <div className={styles.chatWarningHeader}>
            <AlertCircle size={14} /> Warning <AlertCircle size={14} />
          </div>
          <div className={styles.chatWarningText}>
            The owner will be able to see this message
          </div>
        </div>
      )}

      {isOwner ? (
        <div className={styles.readOnlyMessage}>
          <AlertCircle size={16} className={styles.readOnlyIcon} />
          <span>As the list owner, you have read-only access to comments to protect surprise discussions.</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.chatForm}>
          {/* Meta toolbar (Posting As, Tag Item) */}
          <div className={styles.chatMetaRow}>
            <div className={styles.chatPostingAs}>
              <span>Post as:</span>
              <input
                type="text"
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
                className={styles.chatNameInput}
                placeholder="Your name"
              />
            </div>

            {items && items.length > 0 && (
              <div className={styles.chatTagButtonWrapper}>
                <button
                  type="button"
                  onClick={() => setIsTaggingModeActive(!isTaggingModeActive)}
                  className={`${styles.chatTagIconBtn} ${isTaggingModeActive ? styles.active : ''}`}
                  title={isTaggingModeActive ? "Click checkmark to finish tagging" : "Tag wishlist items"}
                >
                  <Tag size={16} />
                </button>
                {isTaggingModeActive && (
                  <button
                    type="button"
                    onClick={() => setIsTaggingModeActive(false)}
                    className={styles.chatTagCheckBtn}
                    title="Complete tagging"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main text message box */}
          <div className={styles.chatInputRow}>
            <textarea
              placeholder="Write a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              required
              className={styles.chatTextarea}
              rows={3}
            />
            <button
              type="submit"
              disabled={isSubmitLoading || !content.trim()}
              className={styles.chatSendBtn}
              title="Send Message"
            >
              <Send size={15} />
            </button>
          </div>

          {/* Bottom options row (Visible to owner, Rollover, Surprise info) */}
          <div className={styles.chatBottomRow}>
            <div className={styles.chatToggles}>
              <label className={styles.chatToggleLabel}>
                <input
                  type="checkbox"
                  checked={isRollover}
                  onChange={(e) => setIsRollover(e.target.checked)}
                  className={styles.chatCheckbox}
                />
                <span>Rollover</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => setIsOwnerVisible(!isOwnerVisible)}
              className={`${styles.chatStatusBadge} ${isOwnerVisible ? styles.visibleToOwner : styles.invisibleToOwner
                }`}
              title="Toggle owner visibility"
            >
              {isOwnerVisible ? (
                <>
                  <Eye size={11} /> Visible to Owner
                </>
              ) : (
                <>
                  <EyeOff size={11} /> Invisible to Owner
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </>
  );
};
