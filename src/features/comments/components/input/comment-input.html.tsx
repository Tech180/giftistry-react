import React from 'react';
import { AlertCircle, Tag, Check, Send, Eye, EyeOff } from 'lucide-react';
import { CommentInputTemplateProps } from '../../interfaces/comment-input-template-props.interface';
import styles from './comment-input.module.css';

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
  isAnonymous,
  setIsAnonymous,
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
          {/* Meta toolbar (Posting As, Anonymous Toggle) */}
          <div className={styles.chatMetaRow}>
            <div className={styles.chatPostingAs}>
              <strong className={`${styles.chatNameValue} ${isAnonymous ? styles.isAnonymous : ''}`}>
                {commenterName}
              </strong>
            </div>

            <div className={styles.chatMetaRight}>
              {/* Anonymous Toggle Pill */}
              <label 
                className={`${styles.anonymousToggleWrapper} ${isAnonymous ? styles.isActive : ''}`}
                title="Post Anonymously"
              >
                <div className={styles.toggleSwitch}>
                  <input 
                    type="checkbox" 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <span className={styles.toggleSlider}></span>
                </div>
                <span className={styles.toggleLabel}>Anon</span>
              </label>
            </div>
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

          {/* Bottom options row (Tag toggle, Visible to owner, Rollover, Surprise info) */}
          <div className={styles.chatBottomRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {items && items.length > 0 && (
                <div className={styles.chatTagButtonWrapper}>
                  <button
                    type="button"
                    onClick={() => setIsTaggingModeActive(!isTaggingModeActive)}
                    className={`${styles.chatTagIconBtn} ${isTaggingModeActive ? styles.active : ''}`}
                    title={isTaggingModeActive ? "Click checkmark to finish tagging" : "Tag wishlist items"}
                  >
                    <Tag size={14} />
                  </button>
                  {isTaggingModeActive && (
                    <button
                      type="button"
                      onClick={() => setIsTaggingModeActive(false)}
                      className={styles.chatTagCheckBtn}
                      title="Complete tagging"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Rock Tumbling Rollover Toggle */}
              <label
                className={styles.rockToggleWrapper}
                title="Toggle Rollover"
              >
                <input
                  type="checkbox"
                  checked={isRollover}
                  onChange={(e) => setIsRollover(e.target.checked)}
                />
                <div className={styles.rockToggleTrack}>
                  <div className={styles.rockTumbler}>
                    <div className={styles.rockTexture} />
                  </div>
                </div>
                <span className={styles.rockToggleLabel}>Rollover</span>
              </label>
            </div>

            {/* Owner Visibility Toggle Button */}
            <button
              type="button"
              onClick={() => setIsOwnerVisible(!isOwnerVisible)}
              className={`${styles.chatStatusBadge} ${isOwnerVisible ? styles.visibleToOwner : styles.invisibleToOwner}`}
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
