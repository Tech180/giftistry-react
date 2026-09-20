import type { PromptType } from 'features/system';
import type { PromptWorkspaceIcon } from './prompt-workspace-icon.type';

export interface PromptWorkspaceItem {
  id: PromptType;
  label: string;
  description: string;
  tokens: string[];
  icon: PromptWorkspaceIcon;
}
