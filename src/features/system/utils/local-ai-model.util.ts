import type { LocalAiModelMode } from '../interfaces/local-ai-model-mode.type';

export function modelMatchesList(modelName: string, listedId: string): boolean {
  return (
    listedId === modelName ||
    listedId.endsWith(`/${modelName}`) ||
    listedId.split(':')[0] === modelName
  );
}

export function deriveLocalModelMode(savedModel: string, models: string[]): LocalAiModelMode {
  const trimmed = savedModel.trim();
  if (!trimmed) {
    return models.length > 0 ? 'listed' : 'custom';
  }
  if (models.some((id) => modelMatchesList(trimmed, id))) {
    return 'listed';
  }
  return 'custom';
}

export function isModelInLocalList(model: string, models: string[]): boolean {
  const trimmed = model.trim();
  if (!trimmed) return false;
  return models.some((id) => modelMatchesList(trimmed, id));
}
