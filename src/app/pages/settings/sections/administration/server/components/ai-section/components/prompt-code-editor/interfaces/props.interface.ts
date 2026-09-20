export interface PromptCodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  knownTokens?: string[];
  rows?: number;
  readOnly?: boolean;
  /** Character index where linked (read-only) content begins; shown grayed out. */
  readOnlyFromIndex?: number | null;
  /** Render `=== Section ===` markers as styled dividers in the highlight layer. */
  showSectionDividers?: boolean;
  'aria-label'?: string;
}
