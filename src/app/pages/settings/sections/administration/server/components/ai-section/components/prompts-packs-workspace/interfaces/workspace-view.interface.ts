import type { PromptType } from 'features/system';

export type WorkspaceView =
  | { kind: 'prompt'; promptType: PromptType }
  | { kind: 'directory' }
  | { kind: 'pack-detail'; packId: string }
  | { kind: 'pack-create' }
  | { kind: 'pack-edit'; packId: string };
