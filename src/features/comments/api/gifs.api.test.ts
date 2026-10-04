import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { Mock } from 'vitest';
import { apiClient } from 'core/api/client';
vi.mock('core/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('gifsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  test('getStatus returns configured flag', async () => {
    vi.resetModules();
    const { gifsApi: api } = await import('./gifs.api');
    (apiClient.get as Mock).mockResolvedValue({ Configured: true });

    await expect(api.getStatus()).resolves.toBe(true);
    expect(apiClient.get).toHaveBeenCalledWith('/api/gifs/status');
  });

  test('search calls backend with query and limit', async () => {
    const { gifsApi: api } = await import('./gifs.api');
    (apiClient.get as Mock).mockResolvedValue([
      {
        Id: 'g1',
        Url: 'https://media.giphy.com/media/g1/200.gif',
        OriginalUrl: 'https://media.giphy.com/media/g1/giphy.gif',
        Title: 'Wave',
      },
    ]);

    const items = await api.search('wave', 12);

    expect(apiClient.get).toHaveBeenCalledWith('/api/gifs/search?q=wave&limit=12');
    expect(items).toEqual([
      {
        id: 'g1',
        url: 'https://media.giphy.com/media/g1/200.gif',
        originalUrl: 'https://media.giphy.com/media/g1/giphy.gif',
        title: 'Wave',
      },
    ]);
  });

  test('importFromUrl posts wrapped body and returns data URL', async () => {
    const { gifsApi: api } = await import('./gifs.api');
    (apiClient.post as Mock).mockResolvedValue({
      DataUrl: 'data:image/gif;base64,abc',
    });

    const dataUrl = await api.importFromUrl('https://media.giphy.com/media/x/giphy.gif');

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/gifs/import',
      { ImageUrl: 'https://media.giphy.com/media/x/giphy.gif' },
      'Gifs'
    );
    expect(dataUrl).toBe('data:image/gif;base64,abc');
  });
});
