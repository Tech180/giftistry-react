import { useState } from 'react';
import { systemApi } from '../api/system.api';
import type { UsePushSettingsResult } from '../interfaces/use-push-settings-result.interface';

export function usePushSettings(
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void,
): UsePushSettingsResult {
  const [ntfyEnabled, setNtfyEnabled] = useState(false);
  const [ntfyBaseUrl, setNtfyBaseUrl] = useState('https://ntfy.sh');
  const [ntfyAuthToken, setNtfyAuthToken] = useState('');
  const [ntfyTopicPrefix, setNtfyTopicPrefix] = useState('giftistry');
  const [webPushEnabled, setWebPushEnabled] = useState(false);
  const [webPushVapidPublicKey, setWebPushVapidPublicKey] = useState('');
  const [webPushVapidPrivateKey, setWebPushVapidPrivateKey] = useState('');
  const [webPushSubject, setWebPushSubject] = useState('mailto:admin@localhost');
  const [fcmEnabled, setFcmEnabled] = useState(false);
  const [fcmProjectId, setFcmProjectId] = useState('');
  const [fcmServiceAccountJson, setFcmServiceAccountJson] = useState('');
  const [isTestingNtfy, setIsTestingNtfy] = useState(false);

  const handleTestNtfy = async () => {
    setIsTestingNtfy(true);
    try {
      const result = await systemApi.testNtfy();
      const topic = result?.Topic ? ` (topic: ${result.Topic})` : '';
      showToast(`ntfy test published successfully${topic}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to publish ntfy test', 'error');
    } finally {
      setIsTestingNtfy(false);
    }
  };

  return {
    ntfyEnabled,
    setNtfyEnabled,
    ntfyBaseUrl,
    setNtfyBaseUrl,
    ntfyAuthToken,
    setNtfyAuthToken,
    ntfyTopicPrefix,
    setNtfyTopicPrefix,
    webPushEnabled,
    setWebPushEnabled,
    webPushVapidPublicKey,
    setWebPushVapidPublicKey,
    webPushVapidPrivateKey,
    setWebPushVapidPrivateKey,
    webPushSubject,
    setWebPushSubject,
    fcmEnabled,
    setFcmEnabled,
    fcmProjectId,
    setFcmProjectId,
    fcmServiceAccountJson,
    setFcmServiceAccountJson,
    isTestingNtfy,
    onTestNtfy: () => {
      void handleTestNtfy();
    },
  };
}
