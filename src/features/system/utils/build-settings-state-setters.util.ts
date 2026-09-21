import type { SettingsStateSetters } from '../interfaces/settings-state-setters.interface';
import type { UseAiSettingsResult } from '../interfaces/use-ai-settings-result.interface';
import type { UseDbSettingsResult } from '../interfaces/use-db-settings-result.interface';
import type { UseOauthSettingsResult } from '../interfaces/use-oauth-settings-result.interface';
import type { UsePushSettingsResult } from '../interfaces/use-push-settings-result.interface';
import type { UseSmtpSettingsResult } from '../interfaces/use-smtp-settings-result.interface';

export function buildSettingsStateSetters(input: {
  db: UseDbSettingsResult;
  oauth: UseOauthSettingsResult;
  smtp: UseSmtpSettingsResult;
  push: UsePushSettingsResult;
  ai: UseAiSettingsResult;
  setAllowSetup: (enabled: boolean) => void;
}): SettingsStateSetters {
  const { db, oauth, smtp, push, ai, setAllowSetup } = input;
  const { forApply } = ai;
  return {
    setDbType: db.setDbType,
    setDbUrl: db.setDbUrl,
    setPublicAppUrl: db.setPublicAppUrl,
    setAllowSetup,
    setOauthEnabled: oauth.setOauthEnabled,
    setOauthIssuerUrl: oauth.setOauthIssuerUrl,
    setOauthClientId: oauth.setOauthClientId,
    setOauthClientSecret: oauth.setOauthClientSecret,
    setOauthAutoRegister: oauth.setOauthAutoRegister,
    setSmtpType: smtp.setSmtpType,
    setSmtpHost: smtp.setSmtpHost,
    setSmtpPort: smtp.setSmtpPort,
    setSmtpUser: smtp.setSmtpUser,
    setSmtpPass: smtp.setSmtpPass,
    setSmtpSecure: smtp.setSmtpSecure,
    setSmtpFrom: smtp.setSmtpFrom,
    setNtfyEnabled: push.setNtfyEnabled,
    setNtfyBaseUrl: push.setNtfyBaseUrl,
    setNtfyAuthToken: push.setNtfyAuthToken,
    setNtfyTopicPrefix: push.setNtfyTopicPrefix,
    setWebPushEnabled: push.setWebPushEnabled,
    setWebPushVapidPublicKey: push.setWebPushVapidPublicKey,
    setWebPushVapidPrivateKey: push.setWebPushVapidPrivateKey,
    setWebPushSubject: push.setWebPushSubject,
    setFcmEnabled: push.setFcmEnabled,
    setFcmProjectId: push.setFcmProjectId,
    setFcmServiceAccountJson: push.setFcmServiceAccountJson,
    setAiEnabled: ai.setAiEnabled,
    setAiWebSearchEnabled: ai.setAiWebSearchEnabled,
    setAiRateLimitEnabled: ai.setAiRateLimitEnabled,
    setAiImportChunkingEnabled: ai.setAiImportChunkingEnabled,
    setAiImportChunkItemLimit: ai.setAiImportChunkItemLimit,
    setAiCompletionTimeoutMs: ai.setAiCompletionTimeoutMs,
    setAiConnectTimeoutMs: ai.setAiConnectTimeoutMs,
    setScrapeFetchTimeoutMs: ai.setScrapeFetchTimeoutMs,
    setScrapePlaywrightTimeoutMs: ai.setScrapePlaywrightTimeoutMs,
    setGrabInfoConcurrency: ai.setGrabInfoConcurrency,
    setGrabInfoConcurrencyUnlimited: ai.setGrabInfoConcurrencyUnlimited,
    setGrabInfoActiveStreamLimit: ai.setGrabInfoActiveStreamLimit,
    setAiFastProvider: forApply.setAiFastProvider,
    setAiFastEndpoint: forApply.setAiFastEndpoint,
    setAiFastApiKey: ai.setAiFastApiKey,
    setAiFastModel: ai.setAiFastModel,
    setAiIntelligentProvider: forApply.setAiIntelligentProvider,
    setAiIntelligentEndpoint: forApply.setAiIntelligentEndpoint,
    setAiIntelligentApiKey: ai.setAiIntelligentApiKey,
    setAiIntelligentModel: ai.setAiIntelligentModel,
    setAiDefaultPrompts: forApply.setAiDefaultPrompts,
    setAiPrompt: ai.setAiPrompt,
    setAiDescriptionPrompt: ai.setAiDescriptionPrompt,
    setAiPopulatePrompt: ai.setAiPopulatePrompt,
    setAiCategoryPrompt: ai.setAiCategoryPrompt,
    setAiImportPrompt: ai.setAiImportPrompt,
    setAiEnabledPackIds: ai.onEnabledPackIdsChange,
    setAiCustomPacks: ai.onCustomPacksChange,
    hydrateLocalSlotFromCache: forApply.hydrateLocalSlotFromCache,
  };
}
