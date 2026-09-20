import { useEffect, useState } from 'react';
import { systemApi } from '../api/system.api';
import type { MetadataPackView } from '../interfaces/metadata-pack-view.interface';
import type { UseMetadataPacksCatalogResult } from '../interfaces/use-metadata-packs-catalog-result.interface';

export function useMetadataPacksCatalog(): UseMetadataPacksCatalogResult {
  const [catalog, setCatalog] = useState<MetadataPackView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await systemApi.listMetadataPacks();
        if (!active) {
          return;
        }

        setCatalog(result.Catalog ?? []);
        setError(null);
      } catch (err: unknown) {
        if (!active) {
          return;
        }

        const message = err instanceof Error ? err.message : 'Failed to load metadata packs';
        setError(message);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  return { catalog, isLoading, error };
}
