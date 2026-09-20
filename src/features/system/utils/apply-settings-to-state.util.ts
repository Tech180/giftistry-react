import { DEFAULT_AI_ENABLED_PACK_IDS } from '../constants/default-ai-enabled-pack-ids.constant';
import type { BackendSettings } from '../interfaces/backend-settings.interface';
import type { SettingsStateSetters } from '../interfaces/settings-state-setters.interface';
import { applyAiPromptSettings } from './ai-prompt-settings.util';
import { normalizeAiSlotProvider } from './normalize-ai-slot-provider.util';

export function applySettingsToState(s: BackendSettings, setters: SettingsStateSetters): void {
  setters.setDbType(s.DbType);
  setters.setDbUrl(s.DbUrl || '');
  setters.setPublicAppUrl(s.PublicAppUrl || '');
  setters.setAllowSetup(s.AllowSetup !== false);
  setters.setOauthEnabled(!!s.OAuthEnabled);
  setters.setOauthIssuerUrl(s.OAuthIssuerUrl || '');
  setters.setOauthClientId(s.OAuthClientId || '');
  setters.setOauthClientSecret(s.OAuthClientSecret || '');
  setters.setOauthButtonText(s.OAuthButtonText || 'Sign in with SSO');
  setters.setOauthAutoRegister(s.OAuthAutoRegister !== false);
  setters.setSmtpType(s.SmtpType);
  setters.setSmtpHost(s.SmtpHost || '');
  setters.setSmtpPort(s.SmtpPort ? s.SmtpPort.toString() : '1025');
  setters.setSmtpUser(s.SmtpUser || '');
  setters.setSmtpPass(s.SmtpPass || '');
  setters.setSmtpSecure(!!s.SmtpSecure);
  setters.setSmtpFrom(s.SmtpFrom || 'noreply@giftistry.local');
  setters.setNtfyEnabled(!!s.NtfyEnabled);
  setters.setNtfyBaseUrl(s.NtfyBaseUrl || 'https://ntfy.sh');
  setters.setNtfyAuthToken(s.NtfyAuthToken || '');
  setters.setNtfyTopicPrefix(s.NtfyTopicPrefix || 'giftistry');
  setters.setWebPushEnabled(!!s.WebPushEnabled);
  setters.setWebPushVapidPublicKey(s.WebPushVapidPublicKey || '');
  setters.setWebPushVapidPrivateKey(s.WebPushVapidPrivateKey || '');
  setters.setWebPushSubject(s.WebPushSubject || 'mailto:admin@localhost');
  setters.setFcmEnabled(!!s.FcmEnabled);
  setters.setFcmProjectId(s.FcmProjectId || '');
  setters.setFcmServiceAccountJson(s.FcmServiceAccountJson || '');
  setters.setAiEnabled(!!s.AiEnabled);
  setters.setAiWebSearchEnabled(!!s.AiWebSearchEnabled);
  setters.setAiRateLimitEnabled(!!s.AiRateLimitEnabled);
  setters.setAiImportChunkingEnabled(s.AiImportChunkingEnabled !== false);
  setters.setAiImportChunkItemLimit(
    Number.isFinite(s.AiImportChunkItemLimit) ? Number(s.AiImportChunkItemLimit) : 20,
  );
  setters.setAiCompletionTimeoutMs(
    Number.isFinite(s.AiCompletionTimeoutMs) ? Number(s.AiCompletionTimeoutMs) : 600000,
  );
  setters.setAiConnectTimeoutMs(
    Number.isFinite(s.AiConnectTimeoutMs) ? Number(s.AiConnectTimeoutMs) : 5000,
  );
  setters.setScrapeFetchTimeoutMs(
    Number.isFinite(s.ScrapeFetchTimeoutMs) ? Number(s.ScrapeFetchTimeoutMs) : 8000,
  );
  setters.setScrapePlaywrightTimeoutMs(
    Number.isFinite(s.ScrapePlaywrightTimeoutMs) ? Number(s.ScrapePlaywrightTimeoutMs) : 25000,
  );
  setters.setGrabInfoConcurrency(
    Number.isFinite(s.GrabInfoConcurrency) ? Number(s.GrabInfoConcurrency) : 3,
  );
  setters.setGrabInfoConcurrencyUnlimited(s.GrabInfoConcurrencyUnlimited === true);
  setters.setGrabInfoActiveStreamLimit(
    Number.isFinite(s.GrabInfoActiveStreamLimit) ? Number(s.GrabInfoActiveStreamLimit) : 16,
  );

  const fastProvider = normalizeAiSlotProvider(s.AiFastProvider);
  const intelligentProvider = normalizeAiSlotProvider(s.AiIntelligentProvider);
  const savedFastEndpoint = s.AiFastEndpoint || '';
  const savedIntelligentEndpoint = s.AiIntelligentEndpoint || '';
  const savedFastModel = s.AiFastModel || '';
  const savedIntelligentModel = s.AiIntelligentModel || '';

  setters.setAiFastProvider(fastProvider);
  setters.setAiFastEndpoint(savedFastEndpoint);
  setters.setAiFastApiKey(s.AiFastApiKey || '');
  setters.setAiFastModel(savedFastModel);
  setters.setAiIntelligentProvider(intelligentProvider);
  setters.setAiIntelligentEndpoint(savedIntelligentEndpoint);
  setters.setAiIntelligentApiKey(s.AiIntelligentApiKey || '');
  setters.setAiIntelligentModel(savedIntelligentModel);

  if (s.AiDefaultPrompts) {
    setters.setAiDefaultPrompts(s.AiDefaultPrompts);
    applyAiPromptSettings(s, s.AiDefaultPrompts, {
      setAiPrompt: setters.setAiPrompt,
      setAiDescriptionPrompt: setters.setAiDescriptionPrompt,
      setAiPopulatePrompt: setters.setAiPopulatePrompt,
      setAiCategoryPrompt: setters.setAiCategoryPrompt,
      setAiImportPrompt: setters.setAiImportPrompt,
    });
  } else {
    setters.setAiPrompt(s.AiPrompt || '');
    setters.setAiDescriptionPrompt(s.AiDescriptionPrompt || '');
    setters.setAiPopulatePrompt(s.AiPopulatePrompt || '');
    setters.setAiCategoryPrompt(s.AiCategoryPrompt || '');
    setters.setAiImportPrompt(s.AiImportPrompt || '');
  }

  setters.setAiEnabledPackIds(
    Array.isArray(s.AiEnabledPackIds) ? s.AiEnabledPackIds : [...DEFAULT_AI_ENABLED_PACK_IDS],
  );
  setters.setAiCustomPacks(Array.isArray(s.AiCustomPacks) ? s.AiCustomPacks : []);

  setters.hydrateLocalSlotFromCache(fastProvider, savedFastEndpoint, savedFastModel, 'fast');
  setters.hydrateLocalSlotFromCache(
    intelligentProvider,
    savedIntelligentEndpoint,
    savedIntelligentModel,
    'intelligent',
  );
}
