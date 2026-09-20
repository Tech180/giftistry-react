import type { MetadataPackView } from './metadata-pack-view.interface';

export interface UseMetadataPacksCatalogResult {
  catalog: MetadataPackView[];
  isLoading: boolean;
  error: string | null;
}
