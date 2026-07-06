import React from 'react';
import { EditorTemplateProps } from './interfaces/editor-template-props.interface';
import { MentionSuggestions } from '../../mention';
import styles from './editor.module.css';

export const EditorTemplate: React.FC<EditorTemplateProps> = ({
  editorRef,
  onEditorInput,
  onEditorKeyDown,
  showMentionSuggestions,
  mentionCandidates,
  activeMentionIndex,
  onMentionHover,
  onMentionSelect,
}) => (
  <div className={styles.wrapper}>
    <div
      ref={editorRef}
      contentEditable
      onInput={onEditorInput}
      onKeyDown={onEditorKeyDown}
      className={styles.textarea}
      data-placeholder="Write a comment... @ to mention someone"
    />

    {showMentionSuggestions && (
      <MentionSuggestions
        candidates={mentionCandidates}
        activeIndex={activeMentionIndex}
        onHover={onMentionHover}
        onSelect={onMentionSelect}
      />
    )}
  </div>
);
