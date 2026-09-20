import { useState, useEffect, useCallback, useRef } from 'react';
import { systemApi } from '../api/system.api';
import type { AiModelSlot } from '../interfaces/ai-model-slot.type';
import { LOCAL_AI_CUSTOM_MODEL_VALUE } from '../constants/local-ai-custom-model-value.constant';
import {
  clearLocalAiModelsCache,
  readLocalAiModelsCache,
  writeLocalAiModelsCache,
} from '../utils/local-ai-models-cache.util';
import { applyLocalModelsState } from '../utils/local-ai-model-state.util';
import { getDefaultPromptForType } from '../utils/ai-prompt-settings.util';
import { DEFAULT_AI_ENABLED_PACK_IDS } from '../constants/default-ai-enabled-pack-ids.constant';
import type { CustomPackSettings } from '../interfaces/custom-pack-settings.interface';
import type { BackendSettings } from '../interfaces/backend-settings.interface';
import type { ModelsProvider } from '../interfaces/models-provider.type';
import type { LocalAiModelMode } from '../interfaces/local-ai-model-mode.type';
import type { PromptType } from '../interfaces/prompt-type.type';
import type { ModelOption } from '../interfaces/model-option.interface';
import type { AiConnectionStatus } from '../interfaces/ai-connection-status.type';
import type { UseAiSettingsResult } from '../interfaces/use-ai-settings-result.interface';

export function useAiSettings(): UseAiSettingsResult {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiWebSearchEnabled, setAiWebSearchEnabled] = useState(false);
  const [aiRateLimitEnabled, setAiRateLimitEnabled] = useState(false);
  const [aiImportChunkingEnabled, setAiImportChunkingEnabled] = useState(true);
  const [aiImportChunkItemLimit, setAiImportChunkItemLimit] = useState(20);
  const [aiCompletionTimeoutMs, setAiCompletionTimeoutMs] = useState(600000);
  const [aiConnectTimeoutMs, setAiConnectTimeoutMs] = useState(5000);
  const [scrapeFetchTimeoutMs, setScrapeFetchTimeoutMs] = useState(8000);
  const [scrapePlaywrightTimeoutMs, setScrapePlaywrightTimeoutMs] = useState(25000);
  const [grabInfoConcurrency, setGrabInfoConcurrency] = useState(3);
  const [grabInfoConcurrencyUnlimited, setGrabInfoConcurrencyUnlimited] = useState(false);
  const [grabInfoActiveStreamLimit, setGrabInfoActiveStreamLimit] = useState(16);
  const [aiFastProvider, setAiFastProvider] = useState<ModelsProvider>('openrouter');
  const [aiFastEndpoint, setAiFastEndpoint] = useState('');
  const [aiFastApiKey, setAiFastApiKey] = useState('');
  const [aiFastModel, setAiFastModel] = useState('');
  const [aiIntelligentProvider, setAiIntelligentProvider] = useState<ModelsProvider>('openrouter');
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

  const [openrouterModels, setOpenrouterModels] = useState<ModelOption[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedFastCompany, setSelectedFastCompany] = useState('');
  const [selectedIntelligentCompany, setSelectedIntelligentCompany] = useState('');
  const [localFastModels, setLocalFastModels] = useState<string[]>([]);
  const [localIntelligentModels, setLocalIntelligentModels] = useState<string[]>([]);
  const [localFastModelMode, setLocalFastModelMode] = useState<LocalAiModelMode>('custom');
  const [localIntelligentModelMode, setLocalIntelligentModelMode] = useState<LocalAiModelMode>('custom');
  const [fastConnectionStatus, setFastConnectionStatus] = useState<AiConnectionStatus>('idle');
  const [fastConnectionMessage, setFastConnectionMessage] = useState('');
  const [intelligentConnectionStatus, setIntelligentConnectionStatus] = useState<AiConnectionStatus>('idle');
  const [intelligentConnectionMessage, setIntelligentConnectionMessage] = useState('');
  const fastCheckRequestIdRef = useRef(0);
  const intelligentCheckRequestIdRef = useRef(0);
  const fastEndpointCheckTimerRef = useRef<number | null>(null);
  const intelligentEndpointCheckTimerRef = useRef<number | null>(null);

  const companies = Array.from(new Set(openrouterModels.map((m) => m.company))).sort();
  const filteredFastModels = openrouterModels.filter((m) => m.company === selectedFastCompany);
  const filteredIntelligentModels = openrouterModels.filter((m) => m.company === selectedIntelligentCompany);

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
    provider: ModelsProvider,
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

  useEffect(() => {
    const needsOpenRouter =
      aiFastProvider === 'openrouter' || aiIntelligentProvider === 'openrouter';
    if (!needsOpenRouter) {
      return;
    }

    let active = true;
    const fetchOpenRouterModels = async () => {
      setIsLoadingModels(true);
      try {
        const mapped = await systemApi.listModels({ provider: 'openrouter' });
        if (!active) {
          return;
        }

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
        if (active) {
          setIsLoadingModels(false);
        }
      }
    };

    fetchOpenRouterModels();
    return () => {
      active = false;
    };
  }, [aiFastProvider, aiIntelligentProvider, aiFastModel, aiIntelligentModel]);

  const checkLocalAiConnection = useCallback(async (
    slot: AiModelSlot,
    endpointOverride?: string,
    modelOverride?: string,
  ) => {
    const isFast = slot === 'fast';
    const provider = isFast ? aiFastProvider : aiIntelligentProvider;
    const endpoint = (endpointOverride ?? (isFast ? aiFastEndpoint : aiIntelligentEndpoint)).trim();
    const apiKey = (isFast ? aiFastApiKey : aiIntelligentApiKey).trim();
    const model = (
      modelOverride !== undefined
        ? modelOverride
        : isFast
          ? aiFastModel
          : aiIntelligentModel
    ).trim();
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

  const handleAiFastProviderChange = useCallback((value: ModelsProvider) => {
    if (value === aiFastProvider) {
      return;
    }
    setAiFastProvider(value);
    setAiFastModel('');
    setSelectedFastCompany('');
    setLocalFastModels([]);
    setLocalFastModelMode('custom');
    setFastConnectionStatus('idle');
    setFastConnectionMessage('');
  }, [aiFastProvider]);

  const handleAiIntelligentProviderChange = useCallback((value: ModelsProvider) => {
    if (value === aiIntelligentProvider) {
      return;
    }
    setAiIntelligentProvider(value);
    setAiIntelligentModel('');
    setSelectedIntelligentCompany('');
    setLocalIntelligentModels([]);
    setLocalIntelligentModelMode('custom');
    setIntelligentConnectionStatus('idle');
    setIntelligentConnectionMessage('');
  }, [aiIntelligentProvider]);

  const handleAiFastEndpointChange = useCallback((value: string) => {
    setAiFastEndpoint(value);
    setAiFastModel('');
    setLocalFastModels([]);
    setLocalFastModelMode('custom');
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
      void checkLocalAiConnection('fast', value, '');
    }, 600);
  }, [aiEnabled, aiFastProvider, checkLocalAiConnection]);

  const handleAiIntelligentEndpointChange = useCallback((value: string) => {
    setAiIntelligentEndpoint(value);
    setAiIntelligentModel('');
    setLocalIntelligentModels([]);
    setLocalIntelligentModelMode('custom');
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
      void checkLocalAiConnection('intelligent', value, '');
    }, 600);
  }, [aiEnabled, aiIntelligentProvider, checkLocalAiConnection]);

  useEffect(() => {
    if (!aiEnabled || aiFastProvider !== 'local') {
      // Reset derived local-AI UI when leaving local mode.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on provider/enable change
      setFastConnectionStatus('idle');
      setFastConnectionMessage('');
      setLocalFastModels([]);
      setLocalFastModelMode('custom');
    }
  }, [aiEnabled, aiFastProvider]);

  useEffect(() => {
    if (!aiEnabled || aiIntelligentProvider !== 'local') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on provider/enable change
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

  const handleResetPrompt = (type: PromptType) => {
    if (!aiDefaultPrompts) {
      return;
    }
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

  return {
    aiEnabled,
    setAiEnabled,
    aiWebSearchEnabled,
    setAiWebSearchEnabled,
    aiRateLimitEnabled,
    setAiRateLimitEnabled,
    aiImportChunkingEnabled,
    setAiImportChunkingEnabled,
    aiImportChunkItemLimit,
    setAiImportChunkItemLimit,
    aiCompletionTimeoutMs,
    setAiCompletionTimeoutMs,
    aiConnectTimeoutMs,
    setAiConnectTimeoutMs,
    scrapeFetchTimeoutMs,
    setScrapeFetchTimeoutMs,
    scrapePlaywrightTimeoutMs,
    setScrapePlaywrightTimeoutMs,
    grabInfoConcurrency,
    setGrabInfoConcurrency,
    grabInfoConcurrencyUnlimited,
    setGrabInfoConcurrencyUnlimited,
    grabInfoActiveStreamLimit,
    setGrabInfoActiveStreamLimit,
    aiFastProvider,
    setAiFastProvider: handleAiFastProviderChange,
    aiFastEndpoint,
    setAiFastEndpoint: handleAiFastEndpointChange,
    aiFastApiKey,
    setAiFastApiKey,
    aiFastModel,
    setAiFastModel,
    aiIntelligentProvider,
    setAiIntelligentProvider: handleAiIntelligentProviderChange,
    aiIntelligentEndpoint,
    setAiIntelligentEndpoint: handleAiIntelligentEndpointChange,
    aiIntelligentApiKey,
    setAiIntelligentApiKey,
    aiIntelligentModel,
    setAiIntelligentModel,
    aiPrompt,
    setAiPrompt,
    aiDescriptionPrompt,
    setAiDescriptionPrompt,
    aiPopulatePrompt,
    setAiPopulatePrompt,
    aiCategoryPrompt,
    setAiCategoryPrompt,
    aiImportPrompt,
    setAiImportPrompt,
    aiDefaultPrompts,
    onResetPrompt: handleResetPrompt,
    openrouterModels,
    isLoadingModels,
    companies,
    selectedFastCompany,
    setSelectedFastCompany,
    selectedIntelligentCompany,
    setSelectedIntelligentCompany,
    filteredFastModels,
    filteredIntelligentModels,
    localFastModels,
    localIntelligentModels,
    localFastModelMode,
    localIntelligentModelMode,
    onLocalModelSelection: handleLocalModelSelection,
    fastConnectionStatus,
    fastConnectionMessage,
    intelligentConnectionStatus,
    intelligentConnectionMessage,
    onTestAiConnection: (slot) => {
      void checkLocalAiConnection(slot);
    },
    aiEnabledPackIds,
    onEnabledPackIdsChange: setAiEnabledPackIds,
    aiCustomPacks,
    onCustomPacksChange: setAiCustomPacks,
    forApply: {
      setAiFastProvider,
      setAiFastEndpoint,
      setAiIntelligentProvider,
      setAiIntelligentEndpoint,
      setAiDefaultPrompts,
      hydrateLocalSlotFromCache,
    },
  };
}
