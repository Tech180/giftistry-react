import { useState } from 'react';
import type { UseDbSettingsResult } from '../interfaces/use-db-settings-result.interface';

export function useDbSettings(): UseDbSettingsResult {
  const [dbType, setDbType] = useState<'local' | 'remote'>('local');
  const [dbUrl, setDbUrl] = useState('');
  const [publicAppUrl, setPublicAppUrl] = useState('');

  return {
    dbType,
    setDbType,
    dbUrl,
    setDbUrl,
    publicAppUrl,
    setPublicAppUrl,
  };
}
