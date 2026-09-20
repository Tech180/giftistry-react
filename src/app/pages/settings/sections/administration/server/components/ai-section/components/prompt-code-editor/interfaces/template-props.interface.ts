import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';
import type { PromptHighlightNode } from './prompt-highlight-node.type';

export interface PromptCodeEditorTemplateProps {
  readOnly: boolean;
  lineNumbers: string[];
  readOnlyLineStart: number | null;
  highlightNodes: PromptHighlightNode[];
  value: string;
  ariaLabel: string;
  gutterRef: RefObject<HTMLDivElement | null>;
  highlightRef: RefObject<HTMLPreElement | null>;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onScroll: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSelect: () => void;
  onClick: () => void;
  onKeyUp: () => void;
  onBlur: () => void;
}
