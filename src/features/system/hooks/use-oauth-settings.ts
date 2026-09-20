import { useState } from 'react';
import type { UseOauthSettingsResult } from '../interfaces/use-oauth-settings-result.interface';

export function useOauthSettings(): UseOauthSettingsResult {
  const [oauthEnabled, setOauthEnabled] = useState(false);
  const [oauthIssuerUrl, setOauthIssuerUrl] = useState('');
  const [oauthClientId, setOauthClientId] = useState('');
  const [oauthClientSecret, setOauthClientSecret] = useState('');
  const [oauthButtonText, setOauthButtonText] = useState('Sign in with SSO');
  const [oauthAutoRegister, setOauthAutoRegister] = useState(true);

  return {
    oauthEnabled,
    setOauthEnabled,
    oauthIssuerUrl,
    setOauthIssuerUrl,
    oauthClientId,
    setOauthClientId,
    oauthClientSecret,
    setOauthClientSecret,
    oauthButtonText,
    setOauthButtonText,
    oauthAutoRegister,
    setOauthAutoRegister,
  };
}
