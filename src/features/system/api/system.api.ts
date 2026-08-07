import { apiClient } from 'core/api/client';

export interface SystemStatusResult {
  Initialized?: boolean;
  AllowSetup?: boolean;
  AllowPasswordLogin?: boolean;
  RequireStrongPasswords?: boolean;
  OAuthEnabled?: boolean;
  OAuthButtonText?: string;
  AiEnabled?: boolean;
  AiWebSearchEnabled?: boolean;
  RegistrationMode?: 'open' | 'invite_only' | 'disabled';
  MaintenanceMode?: boolean;
  MaintenanceMessage?: string;
}

export type AiModelSlot = 'fast' | 'intelligent';

export interface AiCheckPayload {
  AiProvider: string;
  AiEndpoint?: string | null;
  AiApiKey?: string | null;
  AiModelSlot?: AiModelSlot;
  AiFastModel?: string | null;
  AiIntelligentModel?: string | null;
}

export interface AiCheckResult {
  Reachable: boolean;
  ModelAvailable: boolean | null;
  Working: boolean;
  Message: string;
  Models?: string[];
}

export type SystemModelsProvider = 'openrouter' | 'local';

export interface SystemModelOption {
  id: string;
  name: string;
  company: string;
  displayName: string;
}

interface SystemModelApiRow {
  Id?: string;
  Name?: string;
  Company?: string;
  DisplayName?: string;
}

function normalizeSystemModel(row: SystemModelApiRow): SystemModelOption | null {
  const id = (row.Id ?? '').trim();
  if (!id) return null;
  return {
    id,
    name: (row.Name ?? id).trim() || id,
    company: (row.Company ?? 'Other').trim() || 'Other',
    displayName: (row.DisplayName ?? id).trim() || id,
  };
}

export const systemApi = {
  checkAiConnection: (payload: AiCheckPayload) =>
    apiClient.post<AiCheckResult>('/api/system/ai-check', payload, 'System'),

  listModels: async (options: {
    provider: SystemModelsProvider;
    endpoint?: string | null;
    apiKey?: string | null;
  }): Promise<SystemModelOption[]> => {
    const params = new URLSearchParams({ Provider: options.provider });
    if (options.endpoint?.trim()) {
      params.set('Endpoint', options.endpoint.trim());
    }
    if (options.apiKey?.trim()) {
      params.set('ApiKey', options.apiKey.trim());
    }

    const result = await apiClient.get<{ Models?: SystemModelApiRow[] }>(
      `/api/system/models?${params.toString()}`
    );

    return (result?.Models ?? [])
      .map(normalizeSystemModel)
      .filter((m): m is SystemModelOption => m !== null);
  },
};
