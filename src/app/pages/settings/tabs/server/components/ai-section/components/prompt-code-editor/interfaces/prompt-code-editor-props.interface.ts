export interface PromptCodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  knownTokens?: string[];
  rows?: number;
  'aria-label'?: string;
}
