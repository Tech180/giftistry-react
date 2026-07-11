const STORAGE_KEY = 'giftistry-local-ai-models';

export interface LocalAiModelsCache {
  Endpoint: string;
  Models: string[];
  CachedAt: string;
}

function normalizeEndpoint(endpoint: string): string {
  return endpoint.trim();
}

export function readLocalAiModelsCache(endpoint: string): string[] | null {
  const normalized = normalizeEndpoint(endpoint);
  if (!normalized) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors
  }
}

export function clearLocalAiModelsCache(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
