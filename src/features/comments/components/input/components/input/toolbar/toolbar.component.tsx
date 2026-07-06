import React from 'react';
import { Send } from 'lucide-react';
import { ToolbarProps } from './interfaces/toolbar-props.interface';
import { ToolbarTemplate } from './toolbar.html';
import { ToolbarPickers } from './toolbar-pickers';
import styles from './toolbar.module.css';

export const InputToolbar: React.FC<ToolbarProps> = ({
  editorHandle,
  content,
  imageUrl,
  isSubmitLoading,
  setImageUrl,
  onUploadError,
}) => (
  <ToolbarTemplate
    toolbarLeft={
      <ToolbarPickers
        editorHandle={editorHandle}
        setImageUrl={setImageUrl}
        onUploadError={onUploadError}
      />
    }
    toolbarRight={
      <button
        type="submit"
        disabled={isSubmitLoading || (!content.trim() && !imageUrl)}
        className={styles['send-btn']}
        title="Send Message"
      >
        <Send size={15} />
      </button>
    }
  />
);
