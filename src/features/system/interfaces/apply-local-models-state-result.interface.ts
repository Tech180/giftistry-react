import type { LocalAiModelMode } from './local-ai-model-mode.type';

export interface ApplyLocalModelsStateResult {
  mode: LocalAiModelMode;
  model: string;
}
