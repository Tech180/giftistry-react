export interface AiDefaultPromptsView {
  Review: string;
  Description: string;
  Populate: string;
  Category: string;
  Import: string;
}

export type AiSlotProvider = 'local' | 'openrouter';

export interface BackendSettings {
  DbType: 'local' | 'remote';
  DbUrl: string;
  SmtpType: 'local' | 'remote';
  SmtpHost: string;
  SmtpPort: number;
  SmtpUser: string;
  SmtpPass: string;
  SmtpSecure: boolean;
  SmtpFrom: string;
  PublicAppUrl?: string;
  AllowSetup?: boolean;
  OAuthEnabled?: boolean;
  OAuthIssuerUrl?: string;
  OAuthClientId?: string;
  OAuthClientSecret?: string;
  OAuthScopes?: string;
  OAuthButtonText?: string;
  OAuthAutoRegister?: boolean;
  OAuthAutoLaunch?: boolean;
  AiEnabled?: boolean;
  AiWebSearchEnabled?: boolean;
  AiRateLimitEnabled?: boolean;
  AiFastProvider?: AiSlotProvider;
  AiFastEndpoint?: string;
  AiFastApiKey?: string;
  AiFastModel?: string;
  AiIntelligentProvider?: AiSlotProvider;
  AiIntelligentEndpoint?: string;
  AiIntelligentApiKey?: string;
  AiIntelligentModel?: string;
  AiPrompt?: string;
  AiDescriptionPrompt?: string;
  AiPopulatePrompt?: string;
  AiCategoryPrompt?: string;
  AiImportPrompt?: string;
  AiCompletionTimeoutMs?: number;
  ScrapeFetchTimeoutMs?: number;
  ScrapePlaywrightTimeoutMs?: number;
  GrabInfoConcurrency?: number;
  GrabInfoConcurrencyUnlimited?: boolean;
  GrabInfoActiveStreamLimit?: number;
  AiDefaultPrompts?: AiDefaultPromptsView;
}

export function normalizeAiSlotProvider(value?: string | null): AiSlotProvider {
  return value === 'local' ? 'local' : 'openrouter';
}
