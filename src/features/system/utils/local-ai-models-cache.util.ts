import type { LocalAiModelsCache } from '../interfaces/local-ai-models-cache.interface';
import { LOCAL_AI_MODELS_STORAGE_KEY } from '../constants/local-ai-models-storage-key.constant';

function normalizeEndpoint(endpoint: string): string {
  return endpoint.trim();
}

export function readLocalAiModelsCache(endpoint: string): string[] | null {
  const normalized = normalizeEndpoint(endpoint);
  if (!normalized) return null;

  try {
    const raw = localStorage.getItem(LOCAL_AI_MODELS_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LocalAiModelsCache;
    if (!parsed?.Endpoint || !Array.isArray(parsed.Models)) return null;
    if (normalizeEndpoint(parsed.Endpoint) !== normalized) return null;

    return parsed.Models.filter((model): model is string => typeof model === 'string' && !!model.trim());
  } catch {
    return null;
  }
}

export function writeLocalAiModelsCache(endpoint: string, models: string[]): void {
  const normalized = normalizeEndpoint(endpoint);
  if (!normalized) return;

  const payload: LocalAiModelsCache = {
    Endpoint: normalized,
    Models: models,
    CachedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(LOCAL_AI_MODELS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors
  }
}

export function clearLocalAiModelsCache(): void {
  try {
    localStorage.removeItem(LOCAL_AI_MODELS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}
