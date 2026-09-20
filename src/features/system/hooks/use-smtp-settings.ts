import { useState } from 'react';
import type { UseSmtpSettingsResult } from '../interfaces/use-smtp-settings-result.interface';

export function useSmtpSettings(): UseSmtpSettingsResult {
  const [smtpType, setSmtpType] = useState<'local' | 'remote'>('local');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('1025');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpSecure, setSmtpSecure] = useState(false);
  const [smtpFrom, setSmtpFrom] = useState('');

  return {
    smtpType,
    setSmtpType,
    smtpHost,
    setSmtpHost,
    smtpPort,
    setSmtpPort,
    smtpUser,
    setSmtpUser,
    smtpPass,
    setSmtpPass,
    smtpSecure,
    setSmtpSecure,
    smtpFrom,
    setSmtpFrom,
  };
}
