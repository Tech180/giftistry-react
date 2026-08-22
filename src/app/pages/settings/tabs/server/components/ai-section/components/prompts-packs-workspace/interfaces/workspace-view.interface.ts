import type { PromptType } from '../../../../../utils/ai-prompt-settings.util';

export type WorkspaceView =
  | { kind: 'prompt'; promptType: PromptType }
  | { kind: 'directory' }
  | { kind: 'pack-detail'; packId: string }
  | { kind: 'pack-create' }
  | { kind: 'pack-edit'; packId: string };
