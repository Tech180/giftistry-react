import type { RefObject } from 'react';
import type { PromptCodeEditorHandle } from '../../../../prompt-code-editor/interfaces/prompt-code-editor-handle.interface';
import type { PromptWorkspaceItem } from '../../../interfaces/prompt-workspace-item.interface';

export interface PromptWorkspacePaneProps {
  prompt: PromptWorkspaceItem;
  promptValue: string;
  promptPlaceholder: string;
  resetLabel: string;
  showPopulateHint: boolean;
  promptEditorAriaLabel: string;
  canReset: boolean;
  isAtDefault: boolean;
  disabled: boolean;
  promptEditorRef: RefObject<PromptCodeEditorHandle | null>;
  onPromptChange: (value: string) => void;
  onResetPrompt: () => void;
  onInsertToken: (token: string) => void;
}
