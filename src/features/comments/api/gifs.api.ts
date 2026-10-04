import { apiClient } from 'core/api/client';
import type { GifImportResultDto } from '../interfaces/gif-import-result-dto.interface';
import type { GifSearchResultDto } from '../interfaces/gif-search-result-dto.interface';
import type { GifItem } from '../interfaces/gif-item.interface';
import type { GifStatusDto } from '../interfaces/gif-status-dto.interface';
import { mapGifSearchResultDto } from '../utils/map-gif-search-result-dto.util';

let giphyStatusPromise: Promise<boolean> | null = null;

export const gifsApi = {
  getStatus: async (): Promise<boolean> => {
    if (!giphyStatusPromise) {
      giphyStatusPromise = apiClient
        .get<GifStatusDto>('/api/gifs/status')
        .then((result) => result.Configured === true)
        .catch(() => false);
    }
    return giphyStatusPromise;
  },

  search: async (query: string, limit = 12): Promise<GifItem[]> => {
    const params = new URLSearchParams();
    if (query.trim()) {
      params.set('q', query.trim());
    }
    params.set('limit', String(limit));
    const path = `/api/gifs/search?${params.toString()}`;
    const rows = await apiClient.get<GifSearchResultDto[]>(path);
    if (!Array.isArray(rows)) {
      return [];
    }
    return rows.map(mapGifSearchResultDto);
  },

  importFromUrl: async (imageUrl: string): Promise<string> => {
    const result = await apiClient.post<GifImportResultDto>(
      '/api/gifs/import',
      { ImageUrl: imageUrl },
      'Gifs'
    );
    return result.DataUrl;
  },
};
