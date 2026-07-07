import React from 'react';
import { X } from 'lucide-react';
import { CommentEditor } from '../../../input/components/input/editor';
import { AttachmentPreview, UploadErrorBar, TagModeToggle } from '../../../input/components/input';
import { ToolbarPickers } from '../../../input/components/input/toolbar/toolbar-pickers';
import { ReplyInputTemplateProps } from './interfaces/reply-input-template-props.interface';
import styles from './reply-input.module.css';

export const ReplyInputTemplate: React.FC<ReplyInputTemplateProps> = ({
  replyToName,
  items,
  taggedItemIds,
  uploadError,
  imageUrl,
  onRemoveAttachment,
  editorHandle,
  content,
  setContent,
  participants,
  currentUserId,
  onSubmit,
  setImageUrl,
  onUploadError,
  isSubmitting,
  isTaggingModeActive,
  setIsTaggingModeActive,
  onCancel,
}) => (
  <div className={styles['reply-container']}>
    <form className={styles['reply-box']} onSubmit={onSubmit}>
      <div className={styles['reply-header']}>
        <span>
          Replying to <strong>{replyToName}</strong>
        </span>
        <button type="button" className={styles['close-reply']} onClick={onCancel} title="Cancel">
          <X size={14} />
        </button>
      </div>

      {uploadError && <UploadErrorBar message={uploadError} />}

      {imageUrl && (
        <div className={styles['reply-attachment']}>
          <AttachmentPreview imageUrl={imageUrl} onRemove={onRemoveAttachment} />
        </div>
      )}

      <div className={styles['reply-editor']}>
        <CommentEditor
          ref={editorHandle}
          content={content}
          setContent={setContent}
          participants={participants}
          currentUserId={currentUserId}
          onSubmit={onSubmit}
        />
      </div>

      <div className={styles['reply-toolbar']}>
        <div className={styles['reply-toolbar-left']}>
          {items.length > 0 && (
            <TagModeToggle
              isActive={isTaggingModeActive}
              onToggle={setIsTaggingModeActive}
            />
          )}
          <ToolbarPickers
            editorHandle={editorHandle}
            setImageUrl={setImageUrl}
            onUploadError={onUploadError}
          />
        </div>
        <div className={styles['reply-actions']}>
          <button type="button" className={styles['reply-cancel-btn']} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={styles['reply-btn-primary']}
            disabled={isSubmitting || (!content.trim() && !imageUrl && taggedItemIds.length === 0)}
          >
            Reply
          </button>
        </div>
      </div>
    </form>
  </div>
);
