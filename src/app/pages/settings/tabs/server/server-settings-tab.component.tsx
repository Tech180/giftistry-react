import React, { useState, useEffect } from 'react';
import { ServerSettingsTabTemplate } from './server-settings-tab.html';
import { apiClient } from 'core/api/client';
import { ServerSettingsTabProps } from './interfaces/server-settings-tab-props.interface';
import { BackendSettings } from './interfaces/backend-settings.interface';

export const ServerSettingsTab: React.FC<ServerSettingsTabProps> = ({ showToast }) => {
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
  const [aiEndpoint, setAiEndpoint] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showAiKey, setShowAiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [openrouterModels, setOpenrouterModels] = useState<Array<{ id: string; name: string; company: string; displayName: string }>>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');

  const companies = Array.from(new Set(openrouterModels.map(m => m.company))).sort();
  const filteredModels = openrouterModels.filter(m => m.company === selectedCompany);

  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get<{ success: boolean; data: BackendSettings }>('/api/system/settings');
        if (active && response && response.data) {
          const s = response.data;
          setDbType(s.dbType);
          setDbUrl(s.dbUrl || '');
          setSmtpType(s.smtpType);
          setSmtpHost(s.smtpHost || '');
          setSmtpPort(s.smtpPort ? s.smtpPort.toString() : '1025');
          setSmtpUser(s.smtpUser || '');
          setSmtpPass(s.smtpPass || '');
          setSmtpSecure(!!s.smtpSecure);
          setSmtpFrom(s.smtpFrom || 'noreply@giftistry.local');
          setAiEnabled(!!s.aiEnabled);
          setAiProvider(s.aiProvider || 'gemini');
          setAiApiKey(s.aiApiKey || '');
          setAiModel(s.aiModel || '');
          setAiPrompt(s.aiPrompt || '');
          setAiEndpoint(s.aiEndpoint || '');
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

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      dbType,
      dbUrl: dbType === 'remote' ? dbUrl : '',
      smtpType,
      smtpHost: smtpType === 'remote' ? smtpHost : '',
      smtpPort: smtpType === 'remote' ? Number(smtpPort) : 1025,
      smtpUser: smtpType === 'remote' ? smtpUser : '',
      smtpPass: smtpType === 'remote' ? smtpPass : '',
      smtpSecure: smtpType === 'remote' ? smtpSecure : false,
      smtpFrom: smtpType === 'remote' ? smtpFrom : 'noreply@giftistry.local',
      aiEnabled,
      aiProvider: aiEnabled ? aiProvider : 'gemini',
      aiApiKey: aiEnabled ? aiApiKey : '',
      aiModel: aiEnabled ? aiModel : '',
      aiPrompt: aiEnabled ? aiPrompt : '',
      aiEndpoint: aiEnabled ? aiEndpoint : '',
    };

    try {
      await apiClient.post<{ success: boolean }>('/api/system/settings', payload, 'System');
      showToast('Server configuration saved and verified successfully!', 'success');
      
      const response = await apiClient.get<{ success: boolean; data: BackendSettings }>('/api/system/settings');
      if (response && response.data) {
        const s = response.data;
        setDbType(s.dbType);
        setDbUrl(s.dbUrl || '');
        setSmtpType(s.smtpType);
        setSmtpHost(s.smtpHost || '');
        setSmtpPort(s.smtpPort ? s.smtpPort.toString() : '1025');
        setSmtpUser(s.smtpUser || '');
        setSmtpPass(s.smtpPass || '');
        setSmtpSecure(!!s.smtpSecure);
        setSmtpFrom(s.smtpFrom || 'noreply@giftistry.local');
        setAiEnabled(!!s.aiEnabled);
        setAiProvider(s.aiProvider || 'gemini');
        setAiApiKey(s.aiApiKey || '');
        setAiModel(s.aiModel || '');
        setAiPrompt(s.aiPrompt || '');
        setAiEndpoint(s.aiEndpoint || '');
      }
    } catch (err: any) {
      showToast(err.message || 'Verification failed. Settings not saved.', 'error');
    } finally {
      setIsSaving(false);
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
      aiEndpoint={aiEndpoint}
      setAiEndpoint={setAiEndpoint}
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
      isLoading={isLoading}
      isSaving={isSaving}
      handleSave={handleSave}
    />
  );
};
export default ServerSettingsTab;
