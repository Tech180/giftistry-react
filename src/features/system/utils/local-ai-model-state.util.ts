import { deriveLocalModelMode } from './local-ai-model.util';
import type { ApplyLocalModelsStateResult } from '../interfaces/apply-local-models-state-result.interface';

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
