import { useState } from 'react';
import type { UseGiphySettingsResult } from '../interfaces/use-giphy-settings-result.interface';

export function useGiphySettings(): UseGiphySettingsResult {
  const [giphyApiKey, setGiphyApiKey] = useState('');

  return {
    giphyApiKey,
    setGiphyApiKey,
  };
}
