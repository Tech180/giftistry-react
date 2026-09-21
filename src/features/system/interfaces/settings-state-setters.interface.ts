import type { AiModelSlot } from './ai-model-slot.type';
import type { AiDefaultPromptsView } from './ai-default-prompts-view.interface';
import type { CustomPackSettings } from './custom-pack-settings.interface';
import type { ModelsProvider } from './models-provider.type';

export interface SettingsStateSetters {
  setDbType: (type: 'local' | 'remote') => void;
  setDbUrl: (url: string) => void;
  setPublicAppUrl: (url: string) => void;
  setAllowSetup: (enabled: boolean) => void;
  setOauthEnabled: (enabled: boolean) => void;
  setOauthIssuerUrl: (url: string) => void;
  setOauthClientId: (id: string) => void;
  setOauthClientSecret: (secret: string) => void;
  setOauthAutoRegister: (enabled: boolean) => void;
  setSmtpType: (type: 'local' | 'remote') => void;
  setSmtpHost: (host: string) => void;
  setSmtpPort: (port: string) => void;
  setSmtpUser: (user: string) => void;
  setSmtpPass: (pass: string) => void;
  setSmtpSecure: (secure: boolean) => void;
  setSmtpFrom: (from: string) => void;
  setNtfyEnabled: (value: boolean) => void;
  setNtfyBaseUrl: (value: string) => void;
  setNtfyAuthToken: (value: string) => void;
  setNtfyTopicPrefix: (value: string) => void;
  setWebPushEnabled: (value: boolean) => void;
  setWebPushVapidPublicKey: (value: string) => void;
  setWebPushVapidPrivateKey: (value: string) => void;
  setWebPushSubject: (value: string) => void;
  setFcmEnabled: (value: boolean) => void;
  setFcmProjectId: (value: string) => void;
  setFcmServiceAccountJson: (value: string) => void;
  setAiEnabled: (val: boolean) => void;
  setAiWebSearchEnabled: (val: boolean) => void;
  setAiRateLimitEnabled: (val: boolean) => void;
  setAiImportChunkingEnabled: (val: boolean) => void;
  setAiImportChunkItemLimit: (val: number) => void;
  setAiCompletionTimeoutMs: (val: number) => void;
  setAiConnectTimeoutMs: (val: number) => void;
  setScrapeFetchTimeoutMs: (val: number) => void;
  setScrapePlaywrightTimeoutMs: (val: number) => void;
  setGrabInfoConcurrency: (val: number) => void;
  setGrabInfoConcurrencyUnlimited: (val: boolean) => void;
  setGrabInfoActiveStreamLimit: (val: number) => void;
  setAiFastProvider: (val: ModelsProvider) => void;
  setAiFastEndpoint: (val: string) => void;
  setAiFastApiKey: (val: string) => void;
  setAiFastModel: (val: string) => void;
  setAiIntelligentProvider: (val: ModelsProvider) => void;
  setAiIntelligentEndpoint: (val: string) => void;
  setAiIntelligentApiKey: (val: string) => void;
  setAiIntelligentModel: (val: string) => void;
  setAiDefaultPrompts: (prompts: AiDefaultPromptsView | undefined) => void;
  setAiPrompt: (val: string) => void;
  setAiDescriptionPrompt: (val: string) => void;
  setAiPopulatePrompt: (val: string) => void;
  setAiCategoryPrompt: (val: string) => void;
  setAiImportPrompt: (val: string) => void;
  setAiEnabledPackIds: (ids: string[]) => void;
  setAiCustomPacks: (packs: CustomPackSettings[]) => void;
  hydrateLocalSlotFromCache: (
    provider: ModelsProvider,
    endpoint: string,
    model: string,
    slot: AiModelSlot,
  ) => void;
}
