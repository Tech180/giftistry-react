import type { PromptType } from 'features/system';
import type { WorkspacePromptNavItem } from '../../../interfaces/workspace-prompt-nav-item.interface';

export interface WorkspaceSidebarProps {
  promptNavItems: readonly WorkspacePromptNavItem[];
  directoryActive: boolean;
  enabledCount: number;
  onSelectPrompt: (promptType: PromptType) => void;
  onSelectDirectory: () => void;
}
