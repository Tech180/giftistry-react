import { deriveLocalModelMode, type LocalAiModelMode } from '../interfaces/local-ai-model.interface';

export interface ApplyLocalModelsStateResult {
  mode: LocalAiModelMode;
  model: string;
}

export function applyLocalModelsState(
  models: string[],
  savedModel: string
): ApplyLocalModelsStateResult {
  const mode = deriveLocalModelMode(savedModel, models);
  let model = savedModel.trim();

  if (mode === 'listed' && !model && models.length > 0) {
    model = models[0];
  }

  return { mode, model };
}
