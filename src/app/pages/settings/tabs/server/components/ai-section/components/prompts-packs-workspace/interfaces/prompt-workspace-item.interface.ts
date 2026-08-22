import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';
import type { PromptWorkspaceIcon } from './prompt-workspace-icon.type';

export interface PromptWorkspaceItem {
  id: PromptType;
  label: string;
  description: string;
  tokens: string[];
  icon: PromptWorkspaceIcon;
}
