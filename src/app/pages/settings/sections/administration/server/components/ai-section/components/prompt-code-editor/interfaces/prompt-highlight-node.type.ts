import type { PromptHighlightSegment } from './prompt-highlight-segment.type';

export type PromptHighlightNode =
  | { kind: 'placeholder'; text: string }
  | { kind: 'divider'; key: string; title: string; readOnly: boolean }
  | { kind: 'line'; key: string; readOnly: boolean; segments: PromptHighlightSegment[]; trailingNewline: boolean }
  | { kind: 'block'; key: string; segments: PromptHighlightSegment[]; muted?: boolean };
