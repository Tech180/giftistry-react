import { useState, useEffect } from 'react';
import { useAuth } from 'features/auth';
import { AUTH_TOKEN_STORAGE_KEY } from 'core/api/constants/token-storage-key.constant';
import { systemApi } from '../api/system.api';
import type { Props } from '../interfaces/settings-controller-props.interface';
import type { Result } from '../interfaces/settings-controller-result.interface';
import type { SettingsPayloadInput } from '../interfaces/settings-payload-input.interface';
import { applySettingsToState } from '../utils/apply-settings-to-state.util';
import { buildSettingsPayload } from '../utils/build-settings-payload.util';
import { buildSettingsStateSetters } from '../utils/build-settings-state-setters.util';
import { useAiSettings } from './use-ai-settings';
import { useDbSettings } from './use-db-settings';
import { useOauthSettings } from './use-oauth-settings';
import { usePushSettings } from './use-push-settings';
import { useSmtpSettings } from './use-smtp-settings';

export function useSettingsController({ showToast }: Props): Result {
  const { checkSystemStatus } = useAuth();
  const db = useDbSettings();
  const oauth = useOauthSettings();
  const smtp = useSmtpSettings();
  const push = usePushSettings(showToast);
  const ai = useAiSettings();

  const [showPassword, setShowPassword] = useState(false);
  const [showFastAiKey, setShowFastAiKey] = useState(false);
  const [showIntelligentAiKey, setShowIntelligentAiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingServer, setIsDeletingServer] = useState(false);
  const [allowSetup, setAllowSetup] = useState(true);
  const [isSavingAllowSetup, setIsSavingAllowSetup] = useState(false);

  const settingsSetters = () => buildSettingsStateSetters({ db, oauth, smtp, push, ai, setAllowSetup });

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await systemApi.getSettings();
        if (active && response) {
          applySettingsToState(response, settingsSetters());
        }
      } catch (err: unknown) {
        showToast(err instanceof Error ? err.message : 'Failed to load system settings.', 'error');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };
    fetchSettings();
    return () => {
      active = false;
    };
    // Setters are stable React state setters; run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToast]);

  const payloadInput = (): SettingsPayloadInput => ({
    dbType: db.dbType,
    dbUrl: db.dbUrl,
    publicAppUrl: db.publicAppUrl,
    oauthEnabled: oauth.oauthEnabled,
    oauthIssuerUrl: oauth.oauthIssuerUrl,
    oauthClientId: oauth.oauthClientId,
    oauthClientSecret: oauth.oauthClientSecret,
    oauthButtonText: oauth.oauthButtonText,
    oauthAutoRegister: oauth.oauthAutoRegister,
    smtpType: smtp.smtpType,
    smtpHost: smtp.smtpHost,
    smtpPort: smtp.smtpPort,
    smtpUser: smtp.smtpUser,
    smtpPass: smtp.smtpPass,
    smtpSecure: smtp.smtpSecure,
    smtpFrom: smtp.smtpFrom,
    ntfyEnabled: push.ntfyEnabled,
    ntfyBaseUrl: push.ntfyBaseUrl,
    ntfyAuthToken: push.ntfyAuthToken,
    ntfyTopicPrefix: push.ntfyTopicPrefix,
    webPushEnabled: push.webPushEnabled,
    webPushVapidPublicKey: push.webPushVapidPublicKey,
    webPushVapidPrivateKey: push.webPushVapidPrivateKey,
    webPushSubject: push.webPushSubject,
    fcmEnabled: push.fcmEnabled,
    fcmProjectId: push.fcmProjectId,
    fcmServiceAccountJson: push.fcmServiceAccountJson,
    aiEnabled: ai.aiEnabled,
    aiWebSearchEnabled: ai.aiWebSearchEnabled,
    aiRateLimitEnabled: ai.aiRateLimitEnabled,
    aiImportChunkingEnabled: ai.aiImportChunkingEnabled,
    aiImportChunkItemLimit: ai.aiImportChunkItemLimit,
    aiCompletionTimeoutMs: ai.aiCompletionTimeoutMs,
    aiConnectTimeoutMs: ai.aiConnectTimeoutMs,
    scrapeFetchTimeoutMs: ai.scrapeFetchTimeoutMs,
    scrapePlaywrightTimeoutMs: ai.scrapePlaywrightTimeoutMs,
    grabInfoConcurrency: ai.grabInfoConcurrency,
    grabInfoConcurrencyUnlimited: ai.grabInfoConcurrencyUnlimited,
    grabInfoActiveStreamLimit: ai.grabInfoActiveStreamLimit,
    aiFastProvider: ai.aiFastProvider,
    aiFastEndpoint: ai.aiFastEndpoint,
    aiFastApiKey: ai.aiFastApiKey,
    aiFastModel: ai.aiFastModel,
    aiIntelligentProvider: ai.aiIntelligentProvider,
    aiIntelligentEndpoint: ai.aiIntelligentEndpoint,
    aiIntelligentApiKey: ai.aiIntelligentApiKey,
    aiIntelligentModel: ai.aiIntelligentModel,
    aiPrompt: ai.aiPrompt,
    aiDescriptionPrompt: ai.aiDescriptionPrompt,
    aiPopulatePrompt: ai.aiPopulatePrompt,
    aiCategoryPrompt: ai.aiCategoryPrompt,
    aiImportPrompt: ai.aiImportPrompt,
    aiEnabledPackIds: ai.aiEnabledPackIds,
    aiCustomPacks: ai.aiCustomPacks,
    allowSetup,
  });

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await systemApi.updateSettings(buildSettingsPayload(payloadInput()));
      showToast('Server configuration saved and verified successfully!', 'success');
      await checkSystemStatus();
      const response = await systemApi.getSettings();
      if (response) {
        applySettingsToState(response, settingsSetters());
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Verification failed. Settings not saved.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAllowSetupChange = async (enabled: boolean) => {
    if (
      enabled &&
      !window.confirm(
        'Allow first-run setup? The setup wizard will be available when this instance has no users. Only enable this when you intend to re-run setup.',
      )
    ) {
      return;
    }

    setIsSavingAllowSetup(true);
    try {
      await systemApi.updateSettings(buildSettingsPayload(payloadInput(), { AllowSetup: enabled }));
      setAllowSetup(enabled);
      showToast(enabled ? 'First-run setup enabled' : 'First-run setup sealed', 'success');
      await checkSystemStatus();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update setup availability', 'error');
    } finally {
      setIsSavingAllowSetup(false);
    }
  };

  const handleDeleteServer = async () => {
    if (!window.confirm('Delete this server and all user data? This action is permanent and cannot be undone.')) {
      return;
    }
    if (!window.confirm('Are you absolutely sure? Every account, wishlist, and setting on this instance will be erased.')) {
      return;
    }
    setIsDeletingServer(true);
    try {
      await systemApi.deleteServer();
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      showToast('Server deleted', 'success');
      window.location.href = '/setup';
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete server', 'error');
    } finally {
      setIsDeletingServer(false);
    }
  };

  const { forApply: _forApply, ...aiResult } = ai;
  void _forApply;

  return {
    ...db,
    ...oauth,
    ...smtp,
    ...push,
    ...aiResult,
    showPassword,
    setShowPassword,
    showFastAiKey,
    setShowFastAiKey,
    showIntelligentAiKey,
    setShowIntelligentAiKey,
    isLoading,
    isSaving,
    handleSave,
    allowSetup,
    onAllowSetupChange: (enabled) => {
      void handleAllowSetupChange(enabled);
    },
    isSavingAllowSetup,
    onDeleteServer: handleDeleteServer,
    isDeletingServer,
  };
}
