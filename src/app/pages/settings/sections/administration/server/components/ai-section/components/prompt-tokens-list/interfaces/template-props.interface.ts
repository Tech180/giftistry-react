import type { PromptTokenRow } from './prompt-token-row.interface';

export interface PromptTokensListTemplateProps {
  rows: PromptTokenRow[];
  onInsertToken: (token: string) => void;
}
