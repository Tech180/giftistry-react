import type { PromptWorkspaceItem } from '../interfaces/prompt-workspace-item.interface';
import type { WorkspacePromptNavItem } from '../interfaces/workspace-prompt-nav-item.interface';
import type { WorkspaceView } from '../interfaces/workspace-view.interface';

export function toWorkspacePromptNavItem(
  item: PromptWorkspaceItem,
  view: WorkspaceView
): WorkspacePromptNavItem {
  return {
    ...item,
    active: view.kind === 'prompt' && view.promptType === item.id,
  };
}
