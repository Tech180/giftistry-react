import { apiClient } from 'core/api/client';
import type { AiCheckPayload } from '../interfaces/ai-check-payload.interface';
import type { AiCheckResult } from '../interfaces/ai-check-result.interface';
import type { BackendSettings } from '../interfaces/backend-settings.interface';
import type { ModelApiRow } from '../interfaces/model-api-row.interface';
import type { ModelOption } from '../interfaces/model-option.interface';
import type { RunSetupPayload } from '../interfaces/run-setup-payload.interface';
import type { MetadataPacksResult } from '../interfaces/metadata-packs-result.interface';
import type { ModelsProvider } from '../interfaces/models-provider.type';
import { normalizeModel } from '../utils/normalize-model.util';

export const systemApi = {
  checkAiConnection: (payload: AiCheckPayload) =>
    apiClient.post<AiCheckResult>('/api/system/ai-check', payload, 'System'),

  listModels: async (options: {
    provider: ModelsProvider;
    endpoint?: string | null;
    apiKey?: string | null;
  }): Promise<ModelOption[]> => {
    const params = new URLSearchParams({ Provider: options.provider });
    if (options.endpoint?.trim()) {
      params.set('Endpoint', options.endpoint.trim());
    }
    if (options.apiKey?.trim()) {
      params.set('ApiKey', options.apiKey.trim());
    }

    const result = await apiClient.get<{ Models?: ModelApiRow[] }>(
      `/api/system/models?${params.toString()}`
    );

    return (result?.Models ?? [])
      .map(normalizeModel)
      .filter((m): m is ModelOption => m !== null);
  },

  listMetadataPacks: () =>
    apiClient.get<MetadataPacksResult>('/api/system/metadata-packs'),

  getSettings: () => apiClient.get<BackendSettings>('/api/system/settings'),

  updateSettings: (payload: BackendSettings) =>
    apiClient.post('/api/system/settings', payload, 'System'),

  runSetup: (payload: RunSetupPayload) => apiClient.post<unknown>('/api/system/setup', payload),

  testNtfy: () => apiClient.post<{ Topic?: string }>('/api/system/test-ntfy', {}, 'System'),

  deleteServer: () =>
    apiClient.post<{ success: boolean }>('/api/system/delete-server', {}, 'Server'),
};
