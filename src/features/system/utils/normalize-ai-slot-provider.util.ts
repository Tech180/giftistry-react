import type { ModelsProvider } from '../interfaces/models-provider.type';

export function normalizeAiSlotProvider(value?: string | null): ModelsProvider {
  return value === 'local' ? 'local' : 'openrouter';
}
