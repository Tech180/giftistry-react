import React, { forwardRef } from 'react';
import { PromptCodeEditorHandle } from './interfaces/prompt-code-editor-handle.interface';
import { PromptCodeEditorProps } from './interfaces/prompt-code-editor-props.interface';
import { PromptCodeEditorTemplate } from './prompt-code-editor.html';

export type { PromptCodeEditorHandle };

export const PromptCodeEditor = forwardRef<PromptCodeEditorHandle, PromptCodeEditorProps>(
  function PromptCodeEditor(props, ref) {
    return <PromptCodeEditorTemplate {...props} ref={ref} />;
  }
);

export default PromptCodeEditor;
