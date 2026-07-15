import { beforeEach, describe, expect, test, vi } from 'vitest';
import { apiClient } from 'core/api/client';
import { systemApi } from './system.api';

vi.mock('core/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('systemApi.listModels', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('requests openrouter models and normalizes DTO', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      Models: [
        {
          Id: 'google/gemini',
          Name: 'Google: Gemini',
          Company: 'Google',
          DisplayName: 'Gemini',
        },
      ],
    });

    const models = await systemApi.listModels({ provider: 'openrouter' });

    expect(apiClient.get).toHaveBeenCalledWith('/api/system/models?Provider=openrouter');
    expect(models).toEqual([
      {
        id: 'google/gemini',
        name: 'Google: Gemini',
        company: 'Google',
        displayName: 'Gemini',
      },
    ]);
  });

  test('includes endpoint and api key for local provider', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      Models: [{ Id: 'llama3', Name: 'llama3', Company: 'Local', DisplayName: 'llama3' }],
    });

    await systemApi.listModels({
      provider: 'local',
      endpoint: 'http://localhost:11434/v1',
      apiKey: 'secret',
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      '/api/system/models?Provider=local&Endpoint=http%3A%2F%2Flocalhost%3A11434%2Fv1&ApiKey=secret'
    );
  });
});
