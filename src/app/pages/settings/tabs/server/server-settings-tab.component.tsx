import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from 'app/providers/auth-context';
import { ServerSettingsTabTemplate } from './server-settings-tab.html';
import { apiClient } from 'core/api/client';
import { systemApi } from 'features/system/api/system.api';
import { ServerSettingsTabProps } from './interfaces/server-settings-tab-props.interface';
import { BackendSettings } from './interfaces/backend-settings.interface';
import { LOCAL_AI_CUSTOM_MODEL_VALUE, type LocalAiModelMode } from './interfaces/local-ai-model.interface';
import {
  clearLocalAiModelsCache,
  readLocalAiModelsCache,
  writeLocalAiModelsCache,
} from './utils/local-ai-models-cache.util';
import { applyLocalModelsState } from './utils/local-ai-model-state.util';
import {
  applyAiPromptSettings,
  getDefaultPromptForType,
  type PromptType,
} from './utils/ai-prompt-settings.util';

export const ServerSettingsTab: React.FC<ServerSettingsTabProps> = ({ showToast }) => {
  const { user, checkSystemStatus } = useAuth();
  const [dbType, setDbType] = useState<'local' | 'remote'>('local');
  const [dbUrl, setDbUrl] = useState('');
  const [smtpType, setSmtpType] = useState<'local' | 'remote'>('local');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('1025');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpFrom, setSmtpFrom] = useState('');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai' | 'anthropic' | 'local' | 'openrouter'>('gemini');
  const [aiApiKey, setAiApiKey] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiDescriptionPrompt, setAiDescriptionPrompt] = useState('');
  const [aiPopulatePrompt, setAiPopulatePrompt] = useState('');
  const [aiCategoryPrompt, setAiCategoryPrompt] = useState('');
  const [aiEndpoint, setAiEndpoint] = useState('');
  const [aiDefaultPrompts, setAiDefaultPrompts] = useState<BackendSettings['AiDefaultPrompts']>();

  const [showPassword, setShowPassword] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingServer, setIsDeletingServer] = useState(false);

  const [openrouterModels, setOpenrouterModels] = useState<Array<{ id: string; name: string; company: string; displayName: string }>>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [localAiModels, setLocalAiModels] = useState<string[]>([]);
  const [localModelMode, setLocalModelMode] = useState<LocalAiModelMode>('custom');
  const [aiConnectionStatus, setAiConnectionStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [aiConnectionMessage, setAiConnectionMessage] = useState('');
  const aiCheckRequestIdRef = useRef(0);
  const endpointCheckTimerRef = useRef<number | null>(null);

  const companies = Array.from(new Set(openrouterModels.map(m => m.company))).sort();
  const filteredModels = openrouterModels.filter(m => m.company === selectedCompany);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get<BackendSettings>('/api/system/settings');
        if (active && response) {
          const s = response;
          setDbType(s.DbType);
          setDbUrl(s.DbUrl || '');
          setSmtpType(s.SmtpType);
          setSmtpHost(s.SmtpHost || '');
          setSmtpPort(s.SmtpPort ? s.SmtpPort.toString() : '1025');
          setSmtpUser(s.SmtpUser || '');
          setSmtpPass(s.SmtpPass || '');
          setSmtpSecure(!!s.SmtpSecure);
          setSmtpFrom(s.SmtpFrom || 'noreply@giftistry.local');
          setAiEnabled(!!s.AiEnabled);
          setAiProvider(s.AiProvider || 'gemini');
          setAiApiKey(s.AiApiKey || '');
          const savedModel = s.AiModel || '';
          const savedEndpoint = s.AiEndpoint || '';
          setAiModel(savedModel);
          if (s.AiDefaultPrompts) {
            setAiDefaultPrompts(s.AiDefaultPrompts);
            applyAiPromptSettings(s, s.AiDefaultPrompts, {
              setAiPrompt,
              setAiDescriptionPrompt,
              setAiPopulatePrompt,
              setAiCategoryPrompt,
            });
          } else {
            setAiPrompt(s.AiPrompt || '');
            setAiDescriptionPrompt(s.AiDescriptionPrompt || '');
            setAiPopulatePrompt(s.AiPopulatePrompt || '');
            setAiCategoryPrompt(s.AiCategoryPrompt || '');
          }
          setAiEndpoint(savedEndpoint);

          if (s.AiProvider === 'local' && savedEndpoint.trim()) {
            const cachedModels = readLocalAiModelsCache(savedEndpoint);
            if (cachedModels) {
              setLocalAiModels(cachedModels);
              const { mode, model } = applyLocalModelsState(cachedModels, savedModel);
              setLocalModelMode(mode);
              if (model !== savedModel) {
                setAiModel(model);
              }
            } else {
              setLocalAiModels([]);
              setLocalModelMode('custom');
            }
          } else {
            setLocalAiModels([]);
            setLocalModelMode('custom');
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to load system settings.', 'error');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    fetchSettings();
    return () => { active = false; };
  }, [showToast]);

  useEffect(() => {
    if (aiProvider === 'local') return;

    let active = true;
    const fetchOpenRouterModels = async () => {
      setIsLoadingModels(true);
      try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (response.ok) {
          const json = await response.json();
          if (active && json && Array.isArray(json.data)) {
            const mapped = json.data
              .filter((m: any) => {
                const outMods = m.architecture?.output_modalities;
                const modality = m.architecture?.modality;
                if (outMods && outMods.includes('image')) {
                  return false;
                }
                if (modality && modality.endsWith('->image')) {
                  return false;
                }
                return true;
              })
              .map((m: any) => {
                const fullName = m.name || m.id;
                let company = 'Other';
                let displayName = fullName;
                if (fullName.includes(':')) {
                  const parts = fullName.split(':');
                  company = parts[0].trim();
                  displayName = parts.slice(1).join(':').trim();
                }
                return {
                  id: m.id,
                  name: fullName,
                  company,
                  displayName
                };
              });
            mapped.sort((a: any, b: any) => a.displayName.localeCompare(b.displayName));
            setOpenrouterModels(mapped);

            let initialCompany = '';
            if (aiModel) {
              const matchedModel = mapped.find((m: any) => m.id === aiModel);
              if (matchedModel) {
                initialCompany = matchedModel.company;
              }
            }
            if (!initialCompany && mapped.length > 0) {
              const hasGoogle = mapped.some((m: any) => m.company === 'Google');
              if (hasGoogle) {
                initialCompany = 'Google';
              } else {
                initialCompany = mapped[0].company;
              }
            }
            if (initialCompany) {
              setSelectedCompany(initialCompany);
            }
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
  }, [aiProvider, aiModel]);

  const checkLocalAiConnection = useCallback(async (endpointOverride?: string) => {
    const endpoint = (endpointOverride ?? aiEndpoint).trim();
    if (!aiEnabled || aiProvider !== 'local' || !endpoint) {
      setAiConnectionStatus('idle');
      setAiConnectionMessage('');
      return;
    }

    const requestId = ++aiCheckRequestIdRef.current;
    setAiConnectionStatus('checking');
    setAiConnectionMessage('Checking local AI connection...');

    try {
      const result = await systemApi.checkAiConnection({
        AiProvider: 'local',
        AiEndpoint: endpoint,
        AiApiKey: aiApiKey.trim() || null,
      });

      if (requestId !== aiCheckRequestIdRef.current) {
        return;
      }

      const models = result.Models ?? [];
      setLocalAiModels(models);
      writeLocalAiModelsCache(endpoint, models);

      const { mode, model } = applyLocalModelsState(models, aiModel);
      setLocalModelMode(mode);
      if (model !== aiModel.trim()) {
        setAiModel(model);
      }

      const baseMessage = result.Message || 'Local AI connection is working.';
      const modelCountSuffix = models.length > 0 ? ` · ${models.length} models found` : '';
      setAiConnectionStatus('success');
      setAiConnectionMessage(`${baseMessage}${modelCountSuffix}`);
    } catch (err: unknown) {
      if (requestId !== aiCheckRequestIdRef.current) {
        return;
      }

      setLocalAiModels([]);
      clearLocalAiModelsCache();
      if (aiModel.trim()) {
        setLocalModelMode('custom');
      }
      setAiConnectionStatus('error');
      setAiConnectionMessage(err instanceof Error ? err.message : 'Failed to verify local AI connection.');
    }
  }, [aiEnabled, aiProvider, aiEndpoint, aiApiKey, aiModel]);

  const handleLocalModelSelection = useCallback((value: string) => {
    if (value === LOCAL_AI_CUSTOM_MODEL_VALUE) {
      setLocalModelMode('custom');
      return;
    }
    setLocalModelMode('listed');
    setAiModel(value);
  }, []);

  const handleAiEndpointChange = useCallback((value: string) => {
    setAiEndpoint(value);
    setLocalAiModels([]);
    setAiConnectionStatus('idle');
    setAiConnectionMessage('');

    if (endpointCheckTimerRef.current) {
      window.clearTimeout(endpointCheckTimerRef.current);
      endpointCheckTimerRef.current = null;
    }

    if (!aiEnabled || aiProvider !== 'local' || !value.trim()) {
      return;
    }

    endpointCheckTimerRef.current = window.setTimeout(() => {
      void checkLocalAiConnection(value);
    }, 600);
  }, [aiEnabled, aiProvider, checkLocalAiConnection]);

  useEffect(() => {
    if (!aiEnabled || aiProvider !== 'local') {
      setAiConnectionStatus('idle');
      setAiConnectionMessage('');
      setLocalAiModels([]);
      setLocalModelMode('custom');
    }
  }, [aiEnabled, aiProvider]);

  useEffect(() => {
    return () => {
      if (endpointCheckTimerRef.current) {
        window.clearTimeout(endpointCheckTimerRef.current);
      }
    };
  }, []);

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      DbType: dbType,
      DbUrl: dbType === 'remote' ? dbUrl : '',
      SmtpType: smtpType,
      SmtpHost: smtpType === 'remote' ? smtpHost : '',
      SmtpPort: smtpType === 'remote' ? Number(smtpPort) : 1025,
      SmtpUser: smtpType === 'remote' ? smtpUser : '',
      SmtpPass: smtpType === 'remote' ? smtpPass : '',
      SmtpSecure: smtpType === 'remote' ? smtpSecure : false,
      SmtpFrom: smtpType === 'remote' ? smtpFrom : 'noreply@giftistry.local',
      AiEnabled: aiEnabled,
      AiProvider: aiEnabled ? aiProvider : 'gemini',
      AiApiKey: aiEnabled ? aiApiKey : '',
      AiModel: aiEnabled ? aiModel : '',
      AiPrompt: aiEnabled ? aiPrompt : '',
      AiDescriptionPrompt: aiEnabled ? aiDescriptionPrompt : '',
      AiPopulatePrompt: aiEnabled ? aiPopulatePrompt : '',
      AiCategoryPrompt: aiEnabled ? aiCategoryPrompt : '',
      AiEndpoint: aiEnabled ? aiEndpoint : '',
    };

    try {
      await apiClient.post<{ success: boolean }>('/api/system/settings', payload, 'System');
      showToast('Server configuration saved and verified successfully!', 'success');
      await checkSystemStatus();
      
      const response = await apiClient.get<BackendSettings>('/api/system/settings');
      if (response) {
        const s = response;
        setDbType(s.DbType);
        setDbUrl(s.DbUrl || '');
        setSmtpType(s.SmtpType);
        setSmtpHost(s.SmtpHost || '');
        setSmtpPort(s.SmtpPort ? s.SmtpPort.toString() : '1025');
        setSmtpUser(s.SmtpUser || '');
        setSmtpPass(s.SmtpPass || '');
        setSmtpSecure(!!s.SmtpSecure);
        setSmtpFrom(s.SmtpFrom || 'noreply@giftistry.local');
        setAiEnabled(!!s.AiEnabled);
        setAiProvider(s.AiProvider || 'gemini');
        setAiApiKey(s.AiApiKey || '');
        const savedModel = s.AiModel || '';
        const savedEndpoint = s.AiEndpoint || '';
        setAiModel(savedModel);
        if (s.AiDefaultPrompts) {
          setAiDefaultPrompts(s.AiDefaultPrompts);
          applyAiPromptSettings(s, s.AiDefaultPrompts, {
            setAiPrompt,
            setAiDescriptionPrompt,
            setAiPopulatePrompt,
            setAiCategoryPrompt,
          });
        } else {
          setAiPrompt(s.AiPrompt || '');
          setAiDescriptionPrompt(s.AiDescriptionPrompt || '');
          setAiPopulatePrompt(s.AiPopulatePrompt || '');
          setAiCategoryPrompt(s.AiCategoryPrompt || '');
        }
        setAiEndpoint(savedEndpoint);

        if (s.AiProvider === 'local' && savedEndpoint.trim()) {
          const cachedModels = readLocalAiModelsCache(savedEndpoint);
          if (cachedModels) {
            setLocalAiModels(cachedModels);
            const { mode, model } = applyLocalModelsState(cachedModels, savedModel);
            setLocalModelMode(mode);
            if (model !== savedModel) {
              setAiModel(model);
            }
          }
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Verification failed. Settings not saved.', 'error');
    } finally {
      setIsSaving(false);
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
      aiProvider={aiProvider}
      setAiProvider={setAiProvider}
      aiApiKey={aiApiKey}
      setAiApiKey={setAiApiKey}
      aiModel={aiModel}
      setAiModel={setAiModel}
      aiPrompt={aiPrompt}
      setAiPrompt={setAiPrompt}
      aiDescriptionPrompt={aiDescriptionPrompt}
      setAiDescriptionPrompt={setAiDescriptionPrompt}
      aiPopulatePrompt={aiPopulatePrompt}
      setAiPopulatePrompt={setAiPopulatePrompt}
      aiCategoryPrompt={aiCategoryPrompt}
      setAiCategoryPrompt={setAiCategoryPrompt}
      aiDefaultPrompts={aiDefaultPrompts}
      onResetPrompt={handleResetPrompt}
      aiEndpoint={aiEndpoint}
      setAiEndpoint={handleAiEndpointChange}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      showAiKey={showAiKey}
      setShowAiKey={setShowAiKey}
      openrouterModels={openrouterModels}
      isLoadingModels={isLoadingModels}
      companies={companies}
      selectedCompany={selectedCompany}
      setSelectedCompany={setSelectedCompany}
      filteredModels={filteredModels}
      localAiModels={localAiModels}
      localModelMode={localModelMode}
      onLocalModelSelection={handleLocalModelSelection}
      aiConnectionStatus={aiConnectionStatus}
      aiConnectionMessage={aiConnectionMessage}
      onTestAiConnection={() => { void checkLocalAiConnection(); }}
      isTestingAiConnection={aiConnectionStatus === 'checking'}
      isLoading={isLoading}
      isSaving={isSaving}
      handleSave={handleSave}
      isServerOwner={!!user?.IsOwner}
      onDeleteServer={handleDeleteServer}
      isDeletingServer={isDeletingServer}
    />
  );
};
export default ServerSettingsTab;
