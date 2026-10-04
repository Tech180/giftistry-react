import { useEffect, useState } from 'react';
import { gifsApi } from '../api/gifs.api';

export function useGiphyConfigured(): boolean {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    let active = true;
    void gifsApi.getStatus().then((value) => {
      if (active) {
        setConfigured(value);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return configured;
}
