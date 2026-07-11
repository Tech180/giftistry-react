import React from 'react';
import { PromptCodeEditorProps } from './interfaces/prompt-code-editor-props.interface';
import { PromptCodeEditorTemplate } from './prompt-code-editor.html';

export const PromptCodeEditor: React.FC<PromptCodeEditorProps> = (props) => {
  return <PromptCodeEditorTemplate {...props} />;
};

export default PromptCodeEditor;
