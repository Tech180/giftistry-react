import { apiClient } from 'core/api/client';

export interface SystemStatusResult {
  Initialized: boolean;
  AiEnabled?: boolean;
  RegistrationMode?: 'open' | 'invite_only' | 'disabled';
  MaintenanceMode?: boolean;
  MaintenanceMessage?: string;
}

export interface AiCheckPayload {
  AiProvider: string;
  AiEndpoint?: string | null;
  AiApiKey?: string | null;
  AiModel?: string | null;
}

export interface AiCheckResult {
  Reachable: boolean;
  ModelAvailable: boolean | null;
  Working: boolean;
  Message: string;
  Models?: string[];
}

export const systemApi = {
  checkAiConnection: (payload: AiCheckPayload) =>
    apiClient.post<AiCheckResult>('/api/system/ai-check', payload, 'System'),
};
