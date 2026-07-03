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

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async (e: React.FormEvent) => {
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
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      isLoading={isLoading}
      isSaving={isSaving}
      handleSave={handleSave}
    />
  );
};
export default ServerSettingsTab;
