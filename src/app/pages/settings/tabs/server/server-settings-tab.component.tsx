import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'app/providers/auth-context';
import { ServerSettingsTabTemplate } from './server-settings-tab.html';
import { apiClient } from 'core/api/client';
import { systemApi } from 'features/system/api/system.api';
import { ServerSettingsTabProps } from './interfaces/server-settings-tab-props.interface';
import type { CustomPackSettings } from './components/ai-section/components/metadata-packs/interfaces/custom-pack-settings.interface';
import {
  BackendSettings,
  normalizeAiSlotProvider,
  type AiSlotProvider,
} from './interfaces/backend-settings.interface';
import type { AiModelSlot } from './interfaces/ai-section-props.interface';
import { LOCAL_AI_CUSTOM_MODEL_VALUE, type LocalAiModelMode } from './interfaces/local-ai-model.interface';
import {
  clearLocalAiModelsCache,
  readLocalAiModelsCache,
  writeLocalAiModelsCache,
} from './utils/local-ai-models-cache.util';
import { applyLocalModelsState } from './utils/local-ai-model-state.util';
import { applyAiPromptSettings, getDefaultPromptForType, type PromptType } from './utils/ai-prompt-settings.util';
import { DEFAULT_AI_ENABLED_PACK_IDS } from './constants/default-ai-enabled-pack-ids.constant';

export const ServerSettingsTab: React.FC<ServerSettingsTabProps> = ({ showToast }) => {
  const { checkSystemStatus } = useAuth();
  const [dbType, setDbType] = useState<'local' | 'remote'>('local');
  const [dbUrl, setDbUrl] = useState('');
  const [publicAppUrl, setPublicAppUrl] = useState('');
  const [smtpType, setSmtpType] = useState<'local' | 'remote'>('local');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('1025');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpFrom, setSmtpFrom] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiWebSearchEnabled, setAiWebSearchEnabled] = useState(false);
  const [aiRateLimitEnabled, setAiRateLimitEnabled] = useState(false);
  const [aiCompletionTimeoutMs, setAiCompletionTimeoutMs] = useState(600000);
  const [scrapeFetchTimeoutMs, setScrapeFetchTimeoutMs] = useState(8000);
  const [scrapePlaywrightTimeoutMs, setScrapePlaywrightTimeoutMs] = useState(25000);
  const [grabInfoConcurrency, setGrabInfoConcurrency] = useState(3);
  const [grabInfoConcurrencyUnlimited, setGrabInfoConcurrencyUnlimited] = useState(false);
  const [grabInfoActiveStreamLimit, setGrabInfoActiveStreamLimit] = useState(16);
  const [aiFastProvider, setAiFastProvider] = useState<AiSlotProvider>('openrouter');
  const [aiFastEndpoint, setAiFastEndpoint] = useState('');
  const [aiFastApiKey, setAiFastApiKey] = useState('');
  const [aiFastModel, setAiFastModel] = useState('');
  const [aiIntelligentProvider, setAiIntelligentProvider] = useState<AiSlotProvider>('openrouter');
  const [aiIntelligentEndpoint, setAiIntelligentEndpoint] = useState('');
  const [aiIntelligentApiKey, setAiIntelligentApiKey] = useState('');
  const [aiIntelligentModel, setAiIntelligentModel] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDescriptionPrompt, setAiDescriptionPrompt] = useState('');
  const [aiPopulatePrompt, setAiPopulatePrompt] = useState('');
  const [aiCategoryPrompt, setAiCategoryPrompt] = useState('');
  const [aiImportPrompt, setAiImportPrompt] = useState('');
  const [aiEnabledPackIds, setAiEnabledPackIds] = useState<string[]>([...DEFAULT_AI_ENABLED_PACK_IDS]);
  const [aiCustomPacks, setAiCustomPacks] = useState<CustomPackSettings[]>([]);
  const [aiDefaultPrompts, setAiDefaultPrompts] = useState<BackendSettings['AiDefaultPrompts']>();

  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthIssuerUrl, setOauthIssuerUrl] = useState('');
  const [oauthClientId, setOauthClientId] = useState('');
  const [oauthClientSecret, setOauthClientSecret] = useState('');
  const [oauthButtonText, setOauthButtonText] = useState('Sign in with SSO');
  const [oauthAutoRegister, setOauthAutoRegister] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showFastAiKey, setShowFastAiKey] = useState(false);
  const [showIntelligentAiKey, setShowIntelligentAiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingServer, setIsDeletingServer] = useState(false);
  const [allowSetup, setAllowSetup] = useState(true);
  const [isSavingAllowSetup, setIsSavingAllowSetup] = useState(false);

  const [openrouterModels, setOpenrouterModels] = useState<Array<{ id: string; name: string; company: string; displayName: string }>>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedFastCompany, setSelectedFastCompany] = useState('');
  const [selectedIntelligentCompany, setSelectedIntelligentCompany] = useState('');
  const [localFastModels, setLocalFastModels] = useState<string[]>([]);
  const [localIntelligentModels, setLocalIntelligentModels] = useState<string[]>([]);
  const [localFastModelMode, setLocalFastModelMode] = useState<LocalAiModelMode>('custom');
  const [localIntelligentModelMode, setLocalIntelligentModelMode] = useState<LocalAiModelMode>('custom');
  const [fastConnectionStatus, setFastConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [fastConnectionMessage, setFastConnectionMessage] = useState('');
  const [intelligentConnectionStatus, setIntelligentConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [intelligentConnectionMessage, setIntelligentConnectionMessage] = useState('');
  const fastCheckRequestIdRef = useRef(0);
  const intelligentCheckRequestIdRef = useRef(0);
  const fastEndpointCheckTimerRef = useRef<number | null>(null);
  const intelligentEndpointCheckTimerRef = useRef<number | null>(null);

  const companies = Array.from(new Set(openrouterModels.map(m => m.company))).sort();
  const filteredFastModels = openrouterModels.filter(m => m.company === selectedFastCompany);
  const filteredIntelligentModels = openrouterModels.filter(m => m.company === selectedIntelligentCompany);

  const applyLocalModeForSlot = useCallback((slot: AiModelSlot, models: string[], savedModel: string) => {
    const state = applyLocalModelsState(models, savedModel);
    if (slot === 'fast') {
      setLocalFastModelMode(state.mode);
      if (state.model !== savedModel.trim()) {
        setAiFastModel(state.model);
      }
    } else {
      setLocalIntelligentModelMode(state.mode);
      if (state.model !== savedModel.trim()) {
        setAiIntelligentModel(state.model);
      }
    }
  }, []);

  const hydrateLocalSlotFromCache = useCallback((
    provider: AiSlotProvider,
    endpoint: string,
    model: string,
    slot: AiModelSlot,
  ) => {
    if (provider === 'local' && endpoint.trim()) {
      const cachedModels = readLocalAiModelsCache(endpoint);
      if (cachedModels) {
        if (slot === 'fast') {
          setLocalFastModels(cachedModels);
        } else {
          setLocalIntelligentModels(cachedModels);
        }
        applyLocalModeForSlot(slot, cachedModels, model);
        return;
      }
    }

    if (slot === 'fast') {
      setLocalFastModels([]);
      setLocalFastModelMode('custom');
    } else {
      setLocalIntelligentModels([]);
      setLocalIntelligentModelMode('custom');
    }
  }, [applyLocalModeForSlot]);

  const applySettingsToState = useCallback((s: BackendSettings) => {
    setDbType(s.DbType);
    setDbUrl(s.DbUrl || '');
    setPublicAppUrl(s.PublicAppUrl || '');
    setAllowSetup(s.AllowSetup !== false);
    setOauthEnabled(!!s.OAuthEnabled);
    setOauthIssuerUrl(s.OAuthIssuerUrl || '');
    setOauthClientId(s.OAuthClientId || '');
    setOauthClientSecret(s.OAuthClientSecret || '');
    setOauthButtonText(s.OAuthButtonText || 'Sign in with SSO');
    setOauthAutoRegister(s.OAuthAutoRegister !== false);
    setSmtpType(s.SmtpType);
    setSmtpHost(s.SmtpHost || '');
    setSmtpPort(s.SmtpPort ? s.SmtpPort.toString() : '1025');
    setSmtpUser(s.SmtpUser || '');
    setSmtpPass(s.SmtpPass || '');
    setSmtpSecure(!!s.SmtpSecure);
    setSmtpFrom(s.SmtpFrom || 'noreply@giftistry.local');
    setAiEnabled(!!s.AiEnabled);
    setAiWebSearchEnabled(!!s.AiWebSearchEnabled);
    setAiRateLimitEnabled(!!s.AiRateLimitEnabled);
    setAiCompletionTimeoutMs(
      Number.isFinite(s.AiCompletionTimeoutMs) ? Number(s.AiCompletionTimeoutMs) : 600000
    );
    setScrapeFetchTimeoutMs(
      Number.isFinite(s.ScrapeFetchTimeoutMs) ? Number(s.ScrapeFetchTimeoutMs) : 8000
    );
    setScrapePlaywrightTimeoutMs(
      Number.isFinite(s.ScrapePlaywrightTimeoutMs) ? Number(s.ScrapePlaywrightTimeoutMs) : 25000
    );
    setGrabInfoConcurrency(
      Number.isFinite(s.GrabInfoConcurrency) ? Number(s.GrabInfoConcurrency) : 3
    );
    setGrabInfoConcurrencyUnlimited(s.GrabInfoConcurrencyUnlimited === true);
    setGrabInfoActiveStreamLimit(
      Number.isFinite(s.GrabInfoActiveStreamLimit) ? Number(s.GrabInfoActiveStreamLimit) : 16
    );

    const fastProvider = normalizeAiSlotProvider(s.AiFastProvider);
    const intelligentProvider = normalizeAiSlotProvider(s.AiIntelligentProvider);
    const savedFastEndpoint = s.AiFastEndpoint || '';
    const savedIntelligentEndpoint = s.AiIntelligentEndpoint || '';
    const savedFastModel = s.AiFastModel || '';
    const savedIntelligentModel = s.AiIntelligentModel || '';

    setAiFastProvider(fastProvider);
    setAiFastEndpoint(savedFastEndpoint);
    setAiFastApiKey(s.AiFastApiKey || '');
    setAiFastModel(savedFastModel);
    setAiIntelligentProvider(intelligentProvider);
    setAiIntelligentEndpoint(savedIntelligentEndpoint);
    setAiIntelligentApiKey(s.AiIntelligentApiKey || '');
    setAiIntelligentModel(savedIntelligentModel);

    if (s.AiDefaultPrompts) {
      setAiDefaultPrompts(s.AiDefaultPrompts);
      applyAiPromptSettings(s, s.AiDefaultPrompts, {
        setAiPrompt,
        setAiDescriptionPrompt,
        setAiPopulatePrompt,
        setAiCategoryPrompt,
        setAiImportPrompt,
      });
    } else {
      setAiPrompt(s.AiPrompt || '');
      setAiDescriptionPrompt(s.AiDescriptionPrompt || '');
      setAiPopulatePrompt(s.AiPopulatePrompt || '');
      setAiCategoryPrompt(s.AiCategoryPrompt || '');
      setAiImportPrompt(s.AiImportPrompt || '');
    }

    setAiEnabledPackIds(
      Array.isArray(s.AiEnabledPackIds) ? s.AiEnabledPackIds : [...DEFAULT_AI_ENABLED_PACK_IDS]
    );
    setAiCustomPacks(Array.isArray(s.AiCustomPacks) ? s.AiCustomPacks : []);

    hydrateLocalSlotFromCache(fastProvider, savedFastEndpoint, savedFastModel, 'fast');
    hydrateLocalSlotFromCache(intelligentProvider, savedIntelligentEndpoint, savedIntelligentModel, 'intelligent');
  }, [hydrateLocalSlotFromCache]);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get<BackendSettings>('/api/system/settings');
        if (active && response) {
          applySettingsToState(response);
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load system settings.', 'error');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchSettings();
    return () => { active = false; };
  }, [showToast, applySettingsToState]);

  useEffect(() => {
    const needsOpenRouter =
      aiFastProvider === 'openrouter' || aiIntelligentProvider === 'openrouter';
    if (!needsOpenRouter) return;

    let active = true;
    const fetchOpenRouterModels = async () => {
      setIsLoadingModels(true);
      try {
        const mapped = await systemApi.listModels({ provider: 'openrouter' });
        if (!active) return;

        const sorted = [...mapped].sort((a, b) => a.displayName.localeCompare(b.displayName));
        setOpenrouterModels(sorted);

        const resolveCompany = (modelId: string) => {
          if (modelId) {
            const matchedModel = sorted.find((m) => m.id === modelId);
            if (matchedModel) {
              return matchedModel.company;
            }
          }
          if (sorted.length > 0) {
            const hasGoogle = sorted.some((m) => m.company === 'Google');
            return hasGoogle ? 'Google' : sorted[0].company;
          }
          return '';
        };

        if (aiFastProvider === 'openrouter') {
          const fastCompany = resolveCompany(aiFastModel);
          if (fastCompany) {
            setSelectedFastCompany(fastCompany);
          }
        }
        if (aiIntelligentProvider === 'openrouter') {
          const intelligentCompany = resolveCompany(aiIntelligentModel);
          if (intelligentCompany) {
            setSelectedIntelligentCompany(intelligentCompany);
          }
        }
      } catch (err) {
        console.error('Failed to load OpenRouter models:', err);
      } finally {
        if (active) setIsLoadingModels(false);
      }
    };

    fetchOpenRouterModels();
    return () => {
      active = false;
    };
  }, [aiFastProvider, aiIntelligentProvider, aiFastModel, aiIntelligentModel]);

  const checkLocalAiConnection = useCallback(async (slot: AiModelSlot, endpointOverride?: string) => {
    const isFast = slot === 'fast';
    const provider = isFast ? aiFastProvider : aiIntelligentProvider;
    const endpoint = (endpointOverride ?? (isFast ? aiFastEndpoint : aiIntelligentEndpoint)).trim();
    const apiKey = (isFast ? aiFastApiKey : aiIntelligentApiKey).trim();
    const model = (isFast ? aiFastModel : aiIntelligentModel).trim();
    const requestIdRef = isFast ? fastCheckRequestIdRef : intelligentCheckRequestIdRef;
    const setStatus = isFast ? setFastConnectionStatus : setIntelligentConnectionStatus;
    const setMessage = isFast ? setFastConnectionMessage : setIntelligentConnectionMessage;
    const setModels = isFast ? setLocalFastModels : setLocalIntelligentModels;
    const setMode = isFast ? setLocalFastModelMode : setLocalIntelligentModelMode;

    if (!aiEnabled || provider !== 'local' || !endpoint) {
      setStatus('idle');
      setMessage('');
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus('checking');
    setMessage('Checking local AI connection...');

    const payload = {
      AiProvider: 'local' as const,
      AiEndpoint: endpoint,
      AiApiKey: apiKey || null,
      AiModelSlot: slot,
      AiFastModel: isFast ? (model || null) : (aiFastModel.trim() || null),
      AiIntelligentModel: !isFast ? (model || null) : (aiIntelligentModel.trim() || null),
    };

    try {
      const [result, listedModels] = await Promise.all([
        systemApi.checkAiConnection(payload),
        systemApi.listModels({
          provider: 'local',
          endpoint,
          apiKey: apiKey || null,
        }).catch(() => [] as Awaited<ReturnType<typeof systemApi.listModels>>),
      ]);

      if (requestId !== requestIdRef.current) {
        return;
      }

      const models = listedModels.map((m) => m.id);
      setModels(models);
      writeLocalAiModelsCache(endpoint, models);
      applyLocalModeForSlot(slot, models, model);

      if (!result.Working) {
        setStatus('error');
        setMessage(result.Message || 'Local AI connection check failed.');
        return;
      }

      const baseMessage = result.Message || 'Local AI connection is working.';
      const modelCountSuffix = models.length > 0 ? ` · ${models.length} models found` : '';
      setStatus('success');
      setMessage(`${baseMessage}${modelCountSuffix}`);
    } catch (err: unknown) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setModels([]);
      clearLocalAiModelsCache();
      if (model) {
        setMode('custom');
      }
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to verify local AI connection.');
    }
  }, [
    aiEnabled,
    aiFastProvider,
    aiIntelligentProvider,
    aiFastEndpoint,
    aiIntelligentEndpoint,
    aiFastApiKey,
    aiIntelligentApiKey,
    aiFastModel,
    aiIntelligentModel,
    applyLocalModeForSlot,
  ]);

  const handleLocalModelSelection = useCallback((slot: AiModelSlot, value: string) => {
    if (value === LOCAL_AI_CUSTOM_MODEL_VALUE) {
      if (slot === 'fast') {
        setLocalFastModelMode('custom');
      } else {
        setLocalIntelligentModelMode('custom');
      }
      return;
    }
    if (slot === 'fast') {
      setLocalFastModelMode('listed');
      setAiFastModel(value);
    } else {
      setLocalIntelligentModelMode('listed');
      setAiIntelligentModel(value);
    }
  }, []);

  const handleAiFastEndpointChange = useCallback((value: string) => {
    setAiFastEndpoint(value);
    setLocalFastModels([]);
    setFastConnectionStatus('idle');
    setFastConnectionMessage('');

    if (fastEndpointCheckTimerRef.current) {
      window.clearTimeout(fastEndpointCheckTimerRef.current);
      fastEndpointCheckTimerRef.current = null;
    }

    if (!aiEnabled || aiFastProvider !== 'local' || !value.trim()) {
      return;
    }

    fastEndpointCheckTimerRef.current = window.setTimeout(() => {
      void checkLocalAiConnection('fast', value);
    }, 600);
  }, [aiEnabled, aiFastProvider, checkLocalAiConnection]);

  const handleAiIntelligentEndpointChange = useCallback((value: string) => {
    setAiIntelligentEndpoint(value);
    setLocalIntelligentModels([]);
    setIntelligentConnectionStatus('idle');
    setIntelligentConnectionMessage('');

    if (intelligentEndpointCheckTimerRef.current) {
      window.clearTimeout(intelligentEndpointCheckTimerRef.current);
      intelligentEndpointCheckTimerRef.current = null;
    }

    if (!aiEnabled || aiIntelligentProvider !== 'local' || !value.trim()) {
      return;
    }

    intelligentEndpointCheckTimerRef.current = window.setTimeout(() => {
      void checkLocalAiConnection('intelligent', value);
    }, 600);
  }, [aiEnabled, aiIntelligentProvider, checkLocalAiConnection]);

  useEffect(() => {
    if (!aiEnabled || aiFastProvider !== 'local') {
      setFastConnectionStatus('idle');
      setFastConnectionMessage('');
      setLocalFastModels([]);
      setLocalFastModelMode('custom');
    }
  }, [aiEnabled, aiFastProvider]);

  useEffect(() => {
    if (!aiEnabled || aiIntelligentProvider !== 'local') {
      setIntelligentConnectionStatus('idle');
      setIntelligentConnectionMessage('');
      setLocalIntelligentModels([]);
      setLocalIntelligentModelMode('custom');
    }
  }, [aiEnabled, aiIntelligentProvider]);

  useEffect(() => {
    return () => {
      if (fastEndpointCheckTimerRef.current) {
        window.clearTimeout(fastEndpointCheckTimerRef.current);
      }
      if (intelligentEndpointCheckTimerRef.current) {
        window.clearTimeout(intelligentEndpointCheckTimerRef.current);
      }
    };
  }, []);

  const buildSettingsPayload = (overrides: { AllowSetup?: boolean } = {}) => {
    const payload: Record<string, unknown> = {
      DbType: dbType,
      DbUrl: dbType === 'remote' ? dbUrl : '',
      PublicAppUrl: publicAppUrl.trim(),
      OAuthEnabled: oauthEnabled,
      OAuthIssuerUrl: oauthIssuerUrl.trim(),
      OAuthClientId: oauthClientId.trim(),
      OAuthClientSecret: oauthClientSecret,
      OAuthButtonText: oauthButtonText.trim() || 'Sign in with SSO',
      OAuthAutoRegister: oauthAutoRegister,
      SmtpType: smtpType,
      SmtpHost: smtpType === 'remote' ? smtpHost : '',
      SmtpPort: smtpType === 'remote' ? Number(smtpPort) : 1025,
      SmtpUser: smtpType === 'remote' ? smtpUser : '',
      SmtpPass: smtpType === 'remote' ? smtpPass : '',
      SmtpSecure: smtpType === 'remote' ? smtpSecure : false,
      SmtpFrom: smtpType === 'remote' ? smtpFrom : 'noreply@giftistry.local',
      AiEnabled: aiEnabled,
      AiWebSearchEnabled: aiEnabled ? aiWebSearchEnabled : false,
      AiRateLimitEnabled: aiEnabled ? aiRateLimitEnabled : false,
      AiCompletionTimeoutMs: aiCompletionTimeoutMs,
      ScrapeFetchTimeoutMs: scrapeFetchTimeoutMs,
      ScrapePlaywrightTimeoutMs: scrapePlaywrightTimeoutMs,
      GrabInfoConcurrency: grabInfoConcurrency,
      GrabInfoConcurrencyUnlimited: grabInfoConcurrencyUnlimited,
      GrabInfoActiveStreamLimit: grabInfoActiveStreamLimit,
      AiFastProvider: aiEnabled ? aiFastProvider : 'openrouter',
      AiFastEndpoint: aiEnabled ? aiFastEndpoint : '',
      AiFastApiKey: aiEnabled ? aiFastApiKey : '',
      AiFastModel: aiEnabled ? aiFastModel : '',
      AiIntelligentProvider: aiEnabled ? aiIntelligentProvider : 'openrouter',
      AiIntelligentEndpoint: aiEnabled ? aiIntelligentEndpoint : '',
      AiIntelligentApiKey: aiEnabled ? aiIntelligentApiKey : '',
      AiIntelligentModel: aiEnabled ? aiIntelligentModel : '',
      AiPrompt: aiEnabled ? aiPrompt : '',
      AiDescriptionPrompt: aiEnabled ? aiDescriptionPrompt : '',
      AiPopulatePrompt: aiEnabled ? aiPopulatePrompt : '',
      AiCategoryPrompt: aiEnabled ? aiCategoryPrompt : '',
      AiImportPrompt: aiEnabled ? aiImportPrompt : '',
      AiEnabledPackIds: aiEnabledPackIds,
      AiCustomPacks: aiCustomPacks,
      AllowSetup: overrides.AllowSetup ?? allowSetup,
    };

    return payload;
  };

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await apiClient.post('/api/system/settings', buildSettingsPayload(), 'System');
      showToast('Server configuration saved and verified successfully!', 'success');
      await checkSystemStatus();

      const response = await apiClient.get<BackendSettings>('/api/system/settings');
      if (response) {
        applySettingsToState(response);
      }
    } catch (err: any) {
      showToast(err.message || 'Verification failed. Settings not saved.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAllowSetupChange = async (enabled: boolean) => {
    if (
      enabled &&
      !window.confirm(
        'Allow first-run setup? The setup wizard will be available when this instance has no users. Only enable this when you intend to re-run setup.'
      )
    ) {
      return;
    }

    setIsSavingAllowSetup(true);
    try {
      await apiClient.post('/api/system/settings', buildSettingsPayload({ AllowSetup: enabled }), 'System');
      setAllowSetup(enabled);
      showToast(
        enabled ? 'First-run setup enabled' : 'First-run setup sealed',
        'success'
      );
      await checkSystemStatus();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to update setup availability', 'error');
    } finally {
      setIsSavingAllowSetup(false);
    }
  };

  const handleResetPrompt = (type: PromptType) => {
    if (!aiDefaultPrompts) return;
    const defaultText = getDefaultPromptForType(type, aiDefaultPrompts);
    switch (type) {
      case 'review':
        setAiPrompt(defaultText);
        break;
      case 'description':
        setAiDescriptionPrompt(defaultText);
        break;
      case 'populate':
        setAiPopulatePrompt(defaultText);
        break;
      case 'category':
        setAiCategoryPrompt(defaultText);
        break;
      case 'import':
        setAiImportPrompt(defaultText);
        break;
    }
  };

  const handleDeleteServer = async () => {
    if (
      !window.confirm(
        'Delete this server and all user data? This action is permanent and cannot be undone.'
      )
    ) {
      return;
    }
    if (
      !window.confirm(
        'Are you absolutely sure? Every account, wishlist, and setting on this instance will be erased.'
      )
    ) {
      return;
    }
    setIsDeletingServer(true);
    try {
      await apiClient.post<{ success: boolean }>('/api/system/delete-server', {}, 'Server');
      localStorage.removeItem('giftistry-token');
      showToast('Server deleted', 'success');
      window.location.href = '/setup';
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to delete server', 'error');
    } finally {
      setIsDeletingServer(false);
    }
  };

  return (
    <ServerSettingsTabTemplate
      dbType={dbType}
      setDbType={setDbType}
      dbUrl={dbUrl}
      setDbUrl={setDbUrl}
      publicAppUrl={publicAppUrl}
      setPublicAppUrl={setPublicAppUrl}
      oauthEnabled={oauthEnabled}
      setOauthEnabled={setOauthEnabled}
      oauthIssuerUrl={oauthIssuerUrl}
      setOauthIssuerUrl={setOauthIssuerUrl}
      oauthClientId={oauthClientId}
      setOauthClientId={setOauthClientId}
      oauthClientSecret={oauthClientSecret}
      setOauthClientSecret={setOauthClientSecret}
      oauthButtonText={oauthButtonText}
      setOauthButtonText={setOauthButtonText}
      oauthAutoRegister={oauthAutoRegister}
      setOauthAutoRegister={setOauthAutoRegister}
      smtpType={smtpType}
      setSmtpType={setSmtpType}
      smtpHost={smtpHost}
      setSmtpHost={setSmtpHost}
      smtpPort={smtpPort}
      setSmtpPort={setSmtpPort}
      smtpUser={smtpUser}
      setSmtpUser={setSmtpUser}
      smtpPass={smtpPass}
      setSmtpPass={setSmtpPass}
      smtpSecure={smtpSecure}
      setSmtpSecure={setSmtpSecure}
      smtpFrom={smtpFrom}
      setSmtpFrom={setSmtpFrom}
      aiEnabled={aiEnabled}
      setAiEnabled={setAiEnabled}
      aiWebSearchEnabled={aiWebSearchEnabled}
      setAiWebSearchEnabled={setAiWebSearchEnabled}
      aiRateLimitEnabled={aiRateLimitEnabled}
      setAiRateLimitEnabled={setAiRateLimitEnabled}
      aiCompletionTimeoutMs={aiCompletionTimeoutMs}
      setAiCompletionTimeoutMs={setAiCompletionTimeoutMs}
      scrapeFetchTimeoutMs={scrapeFetchTimeoutMs}
      setScrapeFetchTimeoutMs={setScrapeFetchTimeoutMs}
      scrapePlaywrightTimeoutMs={scrapePlaywrightTimeoutMs}
      setScrapePlaywrightTimeoutMs={setScrapePlaywrightTimeoutMs}
      grabInfoConcurrency={grabInfoConcurrency}
      setGrabInfoConcurrency={setGrabInfoConcurrency}
      grabInfoConcurrencyUnlimited={grabInfoConcurrencyUnlimited}
      setGrabInfoConcurrencyUnlimited={setGrabInfoConcurrencyUnlimited}
      grabInfoActiveStreamLimit={grabInfoActiveStreamLimit}
      setGrabInfoActiveStreamLimit={setGrabInfoActiveStreamLimit}
      aiFastProvider={aiFastProvider}
      setAiFastProvider={setAiFastProvider}
      aiFastEndpoint={aiFastEndpoint}
      setAiFastEndpoint={handleAiFastEndpointChange}
      aiFastApiKey={aiFastApiKey}
      setAiFastApiKey={setAiFastApiKey}
      aiFastModel={aiFastModel}
      setAiFastModel={setAiFastModel}
      aiIntelligentProvider={aiIntelligentProvider}
      setAiIntelligentProvider={setAiIntelligentProvider}
      aiIntelligentEndpoint={aiIntelligentEndpoint}
      setAiIntelligentEndpoint={handleAiIntelligentEndpointChange}
      aiIntelligentApiKey={aiIntelligentApiKey}
      setAiIntelligentApiKey={setAiIntelligentApiKey}
      aiIntelligentModel={aiIntelligentModel}
      setAiIntelligentModel={setAiIntelligentModel}
      aiPrompt={aiPrompt}
      setAiPrompt={setAiPrompt}
      aiDescriptionPrompt={aiDescriptionPrompt}
      setAiDescriptionPrompt={setAiDescriptionPrompt}
      aiPopulatePrompt={aiPopulatePrompt}
      setAiPopulatePrompt={setAiPopulatePrompt}
      aiCategoryPrompt={aiCategoryPrompt}
      setAiCategoryPrompt={setAiCategoryPrompt}
      aiImportPrompt={aiImportPrompt}
      setAiImportPrompt={setAiImportPrompt}
      aiDefaultPrompts={aiDefaultPrompts}
      onResetPrompt={handleResetPrompt}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showFastAiKey={showFastAiKey}
      setShowFastAiKey={setShowFastAiKey}
      showIntelligentAiKey={showIntelligentAiKey}
      setShowIntelligentAiKey={setShowIntelligentAiKey}
      openrouterModels={openrouterModels}
      isLoadingModels={isLoadingModels}
      companies={companies}
      selectedFastCompany={selectedFastCompany}
      setSelectedFastCompany={setSelectedFastCompany}
      selectedIntelligentCompany={selectedIntelligentCompany}
      setSelectedIntelligentCompany={setSelectedIntelligentCompany}
      filteredFastModels={filteredFastModels}
      filteredIntelligentModels={filteredIntelligentModels}
      localFastModels={localFastModels}
      localIntelligentModels={localIntelligentModels}
      localFastModelMode={localFastModelMode}
      localIntelligentModelMode={localIntelligentModelMode}
      onLocalModelSelection={handleLocalModelSelection}
      fastConnectionStatus={fastConnectionStatus}
      fastConnectionMessage={fastConnectionMessage}
      intelligentConnectionStatus={intelligentConnectionStatus}
      intelligentConnectionMessage={intelligentConnectionMessage}
      onTestAiConnection={(slot) => { void checkLocalAiConnection(slot); }}
      aiEnabledPackIds={aiEnabledPackIds}
      onEnabledPackIdsChange={setAiEnabledPackIds}
      aiCustomPacks={aiCustomPacks}
      onCustomPacksChange={setAiCustomPacks}
      isLoading={isLoading}
      isSaving={isSaving}
      handleSave={handleSave}
      allowSetup={allowSetup}
      onAllowSetupChange={(enabled) => { void handleAllowSetupChange(enabled); }}
      isSavingAllowSetup={isSavingAllowSetup}
      onDeleteServer={handleDeleteServer}
      isDeletingServer={isDeletingServer}
    />
  );
};
export default ServerSettingsTab;
